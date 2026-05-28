export function parseRelayPath(pathname) {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length !== 3 || parts[0] !== "ws") {
    return null;
  }

  return {
    routeId: decodeURIComponent(parts[1]),
    clientToken: decodeURIComponent(parts[2]),
  };
}

export function isWebSocketUpgrade(request) {
  return request.headers.get("Upgrade")?.toLowerCase() === "websocket";
}

function toUint8Array(message) {
  if (message instanceof Uint8Array) {
    return message;
  }

  if (message instanceof ArrayBuffer) {
    return new Uint8Array(message);
  }

  if (ArrayBuffer.isView(message)) {
    return new Uint8Array(message.buffer, message.byteOffset, message.byteLength);
  }

  return null;
}

export function decodePeerManagerHeader(message) {
  const bytes = toUint8Array(message);
  if (!bytes || bytes.byteLength < 16) {
    return null;
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return {
    fromPeerId: view.getUint32(0, true),
    toPeerId: view.getUint32(4, true),
    packetType: view.getUint8(8),
    flags: view.getUint8(9),
    forwardCounter: view.getUint8(10),
    reserved: view.getUint8(11),
    len: view.getUint32(12, true),
    rawBytes: bytes,
  };
}

export function peerKey(peerId) {
  return String(peerId ?? 0);
}

export function shouldBroadcastPeerMessage(header) {
  return !header || header.toPeerId === 0;
}

