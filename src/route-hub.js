import { decodePeerManagerHeader, parseRelayPath, peerKey, shouldBroadcastPeerMessage } from "./relay.js";

function json(data, init = {}) {
  return new Response(JSON.stringify(data, null, 2), {
    status: init.status ?? 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...(init.headers || {}),
    },
  });
}

function apiError(message, status = 400) {
  return json({ error: message }, { status });
}

function toArrayBuffer(message) {
  if (message instanceof ArrayBuffer) {
    return message;
  }

  if (ArrayBuffer.isView(message)) {
    return message.buffer.slice(message.byteOffset, message.byteOffset + message.byteLength);
  }

  return null;
}

function cloneBinary(message) {
  const buffer = toArrayBuffer(message);
  if (!buffer) {
    return null;
  }

  return buffer.slice(0);
}

async function loadRouteFromAdminStore(env, routeId) {
  const routeStore = env.ADMIN_STORE.get(env.ADMIN_STORE.idFromName("main"));
  const response = await routeStore.fetch(
    new Request(`https://admin-store.local/routes/${encodeURIComponent(routeId)}`),
  );
  if (!response.ok) {
    return null;
  }

  return await response.json();
}

async function storeEventInAdminStore(env, event) {
  const routeStore = env.ADMIN_STORE.get(env.ADMIN_STORE.idFromName("main"));
  return await routeStore.fetch(
    new Request("https://admin-store.local/events", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(event),
    }),
  );
}

export class RouteHub extends DurableObject {
  constructor(ctx, env) {
    super(ctx, env);
    this.env = env;
    this.wsByPeerId = new Map();
    this.connectionMeta = new Map();

    for (const ws of this.ctx.getWebSockets()) {
      const attachment = ws.deserializeAttachment() || {};
      this.connectionMeta.set(ws, attachment);
      if (attachment.peerId) {
        this.wsByPeerId.set(peerKey(attachment.peerId), ws);
      }
    }
  }

  async fetch(request) {
    const url = new URL(request.url);
    const parsed = parseRelayPath(url.pathname);
    if (!parsed) {
      return apiError("Invalid relay path", 404);
    }

    const route = await loadRouteFromAdminStore(this.env, parsed.routeId);
    if (!route) {
      return apiError("Route not found", 404);
    }

    if (!route.enabled) {
      return apiError("Route disabled", 403);
    }

    if (route.clientToken !== parsed.clientToken) {
      return apiError("Route not found", 404);
    }

    if (request.headers.get("Upgrade")?.toLowerCase() !== "websocket") {
      return apiError("Expected Upgrade: websocket", 426);
    }

    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);

    this.ctx.acceptWebSocket(server);

    const connectionId = crypto.randomUUID();
    const attachment = {
      routeId: route.id,
      connectionId,
      peerId: null,
      connectedAt: Date.now(),
    };

    server.serializeAttachment(attachment);
    this.connectionMeta.set(server, attachment);

    await storeEventInAdminStore(this.env, {
      routeId: route.id,
      type: "open",
      routeName: route.name,
      connectionId,
      clientIp: request.headers.get("cf-connecting-ip") ?? "",
      userAgent: request.headers.get("user-agent") ?? "",
      upstreamWsUrl: "",
      at: new Date().toISOString(),
      deltaActive: 1,
    });

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }

  sendToPeer(peerId, payload, senderWs = null) {
    const target = this.wsByPeerId.get(peerKey(peerId));
    if (target && target !== senderWs) {
      try {
        target.send(cloneBinary(payload) ?? payload);
        return true;
      } catch {
        return false;
      }
    }

    let delivered = false;
    for (const ws of this.ctx.getWebSockets()) {
      if (ws === senderWs) {
        continue;
      }
      try {
        ws.send(cloneBinary(payload) ?? payload);
        delivered = true;
      } catch {
      }
    }

    return delivered;
  }

  registerPeer(ws, peerId) {
    const key = peerKey(peerId);
    const existing = this.wsByPeerId.get(key);
    if (existing && existing !== ws) {
      try {
        existing.close(1012, "replaced");
      } catch {
      }
    }
    this.wsByPeerId.set(key, ws);
    const attachment = this.connectionMeta.get(ws) || {};
    attachment.peerId = peerId;
    ws.serializeAttachment(attachment);
    this.connectionMeta.set(ws, attachment);
  }

  removeConnection(ws, code = 1000, reason = "", wasClean = false) {
    const attachment = this.connectionMeta.get(ws) || ws.deserializeAttachment() || {};
    this.connectionMeta.delete(ws);

    if (attachment.peerId !== undefined && attachment.peerId !== null) {
      const key = peerKey(attachment.peerId);
      const current = this.wsByPeerId.get(key);
      if (current === ws) {
        this.wsByPeerId.delete(key);
      }
    }

    if (attachment.routeId) {
      void storeEventInAdminStore(this.env, {
        routeId: attachment.routeId,
        type: "close",
        routeName: "",
        connectionId: attachment.connectionId || crypto.randomUUID(),
        clientIp: "",
        userAgent: "",
        upstreamWsUrl: "",
        code,
        reason,
        wasClean,
        message: "",
        direction: "",
        at: new Date().toISOString(),
        deltaActive: -1,
      });
    }
  }

  async webSocketMessage(ws, message) {
    const attachment = this.connectionMeta.get(ws) || ws.deserializeAttachment() || {};
    const bytes = toArrayBuffer(message);
    if (!bytes) {
      try {
        ws.close(1003, "binary frames only");
      } catch {
      }
      return;
    }

    const header = decodePeerManagerHeader(bytes);
    if (!header) {
      try {
        ws.close(1003, "invalid packet");
      } catch {
      }
      return;
    }

    if (!attachment.peerId && header.fromPeerId) {
      this.registerPeer(ws, header.fromPeerId);
    } else if (attachment.peerId && header.fromPeerId && attachment.peerId !== header.fromPeerId) {
      try {
        ws.close(1008, "peer mismatch");
      } catch {
      }
      return;
    }

    if (header.toPeerId && this.wsByPeerId.has(peerKey(header.toPeerId))) {
      this.sendToPeer(header.toPeerId, bytes, ws);
      return;
    }

    if (shouldBroadcastPeerMessage(header)) {
      for (const peerSocket of this.ctx.getWebSockets()) {
        if (peerSocket === ws) {
          continue;
        }
        try {
          peerSocket.send(bytes.slice(0));
        } catch {
        }
      }
      return;
    }

    for (const peerSocket of this.ctx.getWebSockets()) {
      if (peerSocket === ws) {
        continue;
      }
      try {
        peerSocket.send(bytes.slice(0));
      } catch {
      }
    }
  }

  webSocketClose(ws, code, reason, wasClean) {
    this.removeConnection(ws, code, reason, wasClean);
  }

  webSocketError(ws, error) {
    this.removeConnection(ws, 1011, error?.message ?? "websocket error", false);
  }
}
