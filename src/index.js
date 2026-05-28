import { DurableObject } from "cloudflare:workers";
import { readAdminToken, signAdminToken, verifyAdminToken } from "./auth.js";
import {
  createRoute,
  deleteRoute,
  getRoute,
  loadState,
  recordEvent,
  toRouteView,
  toRouteViews,
  updateRoute,
} from "./store.js";
import { parseRelayPath } from "./relay.js";
import { renderAdminPage } from "./ui.js";
import { RouteHub } from "./route-hub.js";

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

function text(body, init = {}) {
  return new Response(body, {
    status: init.status ?? 200,
    headers: {
      "content-type": init.contentType ?? "text/plain; charset=utf-8",
      "cache-control": "no-store",
      ...(init.headers || {}),
    },
  });
}

function apiError(message, status = 400) {
  return json({ error: message }, { status });
}

function adminSecret(env) {
  return env.ADMIN_PASSWORD || env.ADMIN_SECRET || "development-secret";
}

async function requireAdmin(request, env) {
  const token = readAdminToken(request);
  if (!token) {
    return null;
  }

  return await verifyAdminToken(adminSecret(env), token);
}

async function readJsonBody(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function adminStoreStub(env) {
  return env.ADMIN_STORE.get(env.ADMIN_STORE.idFromName("main"));
}

function routeHubStub(env, routeId) {
  return env.ROUTE_HUB.get(env.ROUTE_HUB.idFromName(routeId));
}

async function adminFetch(env, path, options = {}) {
  const stub = adminStoreStub(env);
  return await stub.fetch(
    new Request(`https://admin-store.local${path}`, {
      method: options.method || "GET",
      headers: {
        "content-type": "application/json",
        ...(options.headers || {}),
      },
      body: options.body,
    }),
  );
}

async function loadAdminState(env) {
  const response = await adminFetch(env, "/state");
  return await response.json();
}

function withRouteView(route, origin) {
  return toRouteView(route, origin);
}

function withRouteViews(routes, origin) {
  return toRouteViews(routes, origin);
}

async function handleLogin(request, env) {
  if (request.method !== "POST") {
    return apiError("Method not allowed", 405);
  }

  const body = await readJsonBody(request);
  if (!body?.password) {
    return apiError("Password is required");
  }

  if (body.password !== adminSecret(env)) {
    return apiError("Invalid password", 401);
  }

  const token = await signAdminToken(adminSecret(env), { role: "admin" });
  return json({
    token,
    expiresInSeconds: 12 * 60 * 60,
  });
}

async function handleAdminState(request, env) {
  const auth = await requireAdmin(request, env);
  if (!auth) {
    return apiError("Unauthorized", 401);
  }

  const origin = new URL(request.url).origin;
  const state = await loadAdminState(env);
  return json({
    routes: withRouteViews(state.routes, origin),
    summary: state.summary,
    events: state.events,
  });
}

async function handleCreateRoute(request, env) {
  const auth = await requireAdmin(request, env);
  if (!auth) {
    return apiError("Unauthorized", 401);
  }

  const body = await readJsonBody(request);
  if (!body) {
    return apiError("Invalid JSON body");
  }

  try {
    const response = await adminFetch(env, "/routes", {
      method: "POST",
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      return apiError(payload?.error || "Failed to create route", response.status || 400);
    }
    const route = await response.json();
    const origin = new URL(request.url).origin;
    return json(withRouteView(route, origin), { status: 201 });
  } catch (error) {
    return apiError(error instanceof Error ? error.message : String(error));
  }
}

async function handleUpdateRoute(request, env, routeId) {
  const auth = await requireAdmin(request, env);
  if (!auth) {
    return apiError("Unauthorized", 401);
  }

  const body = await readJsonBody(request);
  if (!body) {
    return apiError("Invalid JSON body");
  }

  try {
    const response = await adminFetch(env, `/routes/${encodeURIComponent(routeId)}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      return apiError(payload?.error || "Failed to update route", response.status || 400);
    }
    const updated = await response.json();
    const origin = new URL(request.url).origin;
    return json(withRouteView(updated, origin));
  } catch (error) {
    return apiError(error instanceof Error ? error.message : String(error));
  }
}

async function handleDeleteRoute(request, env, routeId) {
  const auth = await requireAdmin(request, env);
  if (!auth) {
    return apiError("Unauthorized", 401);
  }

  const response = await adminFetch(env, `/routes/${encodeURIComponent(routeId)}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    return apiError(payload?.error || "Route not found", response.status || 404);
  }

  return new Response(null, { status: 204 });
}

async function handleGetRoute(request, env, routeId) {
  const auth = await requireAdmin(request, env);
  if (!auth) {
    return apiError("Unauthorized", 401);
  }

  const response = await adminFetch(env, `/routes/${encodeURIComponent(routeId)}`);
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    return apiError(payload?.error || "Route not found", response.status || 404);
  }
  const route = await response.json();

  const origin = new URL(request.url).origin;
  return json(withRouteView(route, origin));
}

async function handleValidateRoute(request, env, routeId) {
  const auth = await requireAdmin(request, env);
  if (!auth) {
    return apiError("Unauthorized", 401);
  }

  const response = await adminFetch(env, `/routes/${encodeURIComponent(routeId)}`);
  if (!response.ok) {
    const payload = await response.json().catch(() => null);
    return apiError(payload?.error || "Route not found", response.status || 404);
  }

  const route = await response.json();
  const origin = new URL(request.url).origin;
  return json({
    ok: true,
    mode: "standalone-workers",
    route: withRouteView(route, origin),
  });
}

async function handleRelay(request, env) {
  if (request.headers.get("Upgrade")?.toLowerCase() !== "websocket") {
    return apiError("Expected Upgrade: websocket", 426);
  }

  const parsed = parseRelayPath(new URL(request.url).pathname);
  if (!parsed) {
    return apiError("Invalid relay path", 404);
  }

  return await routeHubStub(env, parsed.routeId).fetch(request);
}

async function routeRequest(request, env) {
  const url = new URL(request.url);

  if (url.pathname === "/health") {
    return json({
      ok: true,
      service: env.APP_NAME || "EasyTier WSS CF",
      now: new Date().toISOString(),
    });
  }

  if (url.pathname === "/" || url.pathname === "/panel") {
    return new Response(renderAdminPage(env.APP_NAME || "EasyTier WSS CF"), {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  }

  if (url.pathname === "/api/login") {
    return await handleLogin(request, env);
  }

  if (url.pathname === "/api/state") {
    return await handleAdminState(request, env);
  }

  if (url.pathname === "/api/routes" && request.method === "POST") {
    return await handleCreateRoute(request, env);
  }

  if (url.pathname.startsWith("/api/routes/")) {
    const segments = url.pathname.split("/").filter(Boolean);
    const routeId = segments[2];
    if (!routeId) {
      return apiError("Route id is required", 400);
    }

    if (segments.length === 3) {
      if (request.method === "GET") {
        return await handleGetRoute(request, env, routeId);
      }
      if (request.method === "PUT") {
        return await handleUpdateRoute(request, env, routeId);
      }
      if (request.method === "DELETE") {
        return await handleDeleteRoute(request, env, routeId);
      }
    }

    if (segments.length === 4 && segments[3] === "test" && request.method === "POST") {
      return await handleValidateRoute(request, env, routeId);
    }
  }

  if (url.pathname.startsWith("/ws/")) {
    return await handleRelay(request, env);
  }

  return text("Not found", { status: 404 });
}

export class AdminStore extends DurableObject {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/state") {
      const state = await loadState(this.ctx.storage);
      return json(state);
    }

    if (request.method === "GET" && url.pathname === "/routes") {
      const state = await loadState(this.ctx.storage);
      return json({ routes: state.routes });
    }

    if (request.method === "GET" && url.pathname.startsWith("/routes/")) {
      const routeId = url.pathname.split("/").filter(Boolean)[1];
      const route = await getRoute(this.ctx.storage, routeId);
      if (!route) {
        return apiError("Route not found", 404);
      }
      return json(route);
    }

    if (request.method === "POST" && url.pathname === "/routes") {
      const body = await readJsonBody(request);
      if (!body) {
        return apiError("Invalid JSON body");
      }

      try {
        const route = await createRoute(this.ctx.storage, body);
        return json(route, { status: 201 });
      } catch (error) {
        return apiError(error instanceof Error ? error.message : String(error));
      }
    }

    if (request.method === "PUT" && url.pathname.startsWith("/routes/")) {
      const routeId = url.pathname.split("/").filter(Boolean)[1];
      const body = await readJsonBody(request);
      if (!body) {
        return apiError("Invalid JSON body");
      }

      try {
        const route = await updateRoute(this.ctx.storage, routeId, body);
        if (!route) {
          return apiError("Route not found", 404);
        }
        return json(route);
      } catch (error) {
        return apiError(error instanceof Error ? error.message : String(error));
      }
    }

    if (request.method === "DELETE" && url.pathname.startsWith("/routes/")) {
      const routeId = url.pathname.split("/").filter(Boolean)[1];
      const deleted = await deleteRoute(this.ctx.storage, routeId);
      if (!deleted) {
        return apiError("Route not found", 404);
      }
      return new Response(null, { status: 204 });
    }

    if (request.method === "POST" && url.pathname === "/events") {
      const body = await readJsonBody(request);
      if (!body || !body.routeId || !body.type) {
        return apiError("routeId and type are required");
      }
      const updatedState = await recordEvent(this.ctx.storage, {
        routeId: String(body.routeId),
        type: String(body.type),
        routeName: String(body.routeName || ""),
        connectionId: String(body.connectionId || crypto.randomUUID()),
        clientIp: String(body.clientIp || ""),
        userAgent: String(body.userAgent || ""),
        code: body.code,
        reason: String(body.reason || ""),
        wasClean: Boolean(body.wasClean),
        message: String(body.message || ""),
        direction: String(body.direction || ""),
        at: String(body.at || new Date().toISOString()),
        deltaActive: Number(body.deltaActive || 0),
      });
      return json(updatedState);
    }

    return text("Not found", { status: 404 });
  }
}

export { RouteHub } from "./route-hub.js";

export default {
  async fetch(request, env) {
    return await routeRequest(request, env);
  },
};
