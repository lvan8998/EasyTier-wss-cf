import { randomToken } from "./auth.js";

export const STATE_KEY = "state";

export function createEmptyState() {
  return {
    routes: [],
    events: [],
    summary: {
      activeConnections: 0,
      totalConnections: 0,
      updatedAt: null,
    },
  };
}

function normalizeText(value, fallback = "") {
  return String(value ?? fallback).trim();
}

function ensureRouteStats(route) {
  return {
    activeConnections: Number(route?.stats?.activeConnections ?? 0),
    totalConnections: Number(route?.stats?.totalConnections ?? 0),
    lastSeenAt: route?.stats?.lastSeenAt ?? null,
    lastError: route?.stats?.lastError ?? null,
  };
}

export function normalizeRouteInput(input, existing = null) {
  const route = existing ?? {};
  const now = new Date().toISOString();

  return {
    id: normalizeText(input.id ?? route.id ?? crypto.randomUUID()),
    name: normalizeText(input.name ?? route.name ?? "Unnamed route") || "Unnamed route",
    networkName: normalizeText(input.networkName ?? route.networkName),
    networkSecret: normalizeText(input.networkSecret ?? route.networkSecret),
    clientToken: normalizeText(input.clientToken ?? route.clientToken ?? randomToken(24)),
    enabled: input.enabled ?? route.enabled ?? true,
    notes: normalizeText(input.notes ?? route.notes),
    createdAt: input.createdAt ?? route.createdAt ?? now,
    updatedAt: input.updatedAt ?? route.updatedAt ?? now,
    stats: ensureRouteStats(route),
  };
}

export function ensureStateShape(value) {
  const state = value && typeof value === "object" ? value : createEmptyState();
  const routes = Array.isArray(state.routes) ? state.routes : [];
  const events = Array.isArray(state.events) ? state.events : [];

  return {
    routes: routes.map((route) => ({
      ...normalizeRouteInput(route, route),
      stats: ensureRouteStats(route),
    })),
    events: events.slice(0, 100),
    summary: {
      activeConnections:
        typeof state.summary?.activeConnections === "number" ? state.summary.activeConnections : 0,
      totalConnections:
        typeof state.summary?.totalConnections === "number" ? state.summary.totalConnections : 0,
      updatedAt: state.summary?.updatedAt ?? null,
    },
  };
}

export function buildPublicWsUrl(origin, routeId, clientToken) {
  const url = new URL(origin);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.pathname = `/ws/${encodeURIComponent(routeId)}/${encodeURIComponent(clientToken)}`;
  url.search = "";
  url.hash = "";
  return url.toString();
}

function shellQuote(value) {
  return `'${String(value).replace(/'/g, `'\"'\"'`)}'`;
}

export function buildEasyTierCommand(route, publicWsUrl) {
  const networkName = route.networkName || "<network-name>";
  const networkSecret = route.networkSecret || "<network-secret>";
  return [
    "sudo easytier-core -d",
    `--network-name ${shellQuote(networkName)}`,
    `--network-secret ${shellQuote(networkSecret)}`,
    `-p ${shellQuote(publicWsUrl)}`,
  ].join(" ");
}

export function toRouteView(route, origin) {
  const publicWsUrl = buildPublicWsUrl(origin, route.id, route.clientToken);
  return {
    ...route,
    publicWsUrl,
    easyTierCommand: buildEasyTierCommand(route, publicWsUrl),
  };
}

export function toRouteViews(routes, origin) {
  return routes.map((route) => toRouteView(route, origin));
}

export async function loadState(storage) {
  return ensureStateShape(await storage.get(STATE_KEY));
}

export async function saveState(storage, state) {
  await storage.put(STATE_KEY, ensureStateShape(state));
}

function refreshSummary(state) {
  const totals = state.routes.reduce(
    (accumulator, route) => {
      const stats = ensureRouteStats(route);
      accumulator.activeConnections += stats.activeConnections;
      accumulator.totalConnections += stats.totalConnections;
      return accumulator;
    },
    { activeConnections: 0, totalConnections: 0 },
  );

  state.summary = {
    activeConnections: totals.activeConnections,
    totalConnections: totals.totalConnections,
    updatedAt: new Date().toISOString(),
  };
}

export async function listRoutes(storage) {
  const state = await loadState(storage);
  return state.routes;
}

export async function getRoute(storage, routeId) {
  const state = await loadState(storage);
  return state.routes.find((route) => route.id === routeId) ?? null;
}

export async function createRoute(storage, input) {
  const state = await loadState(storage);
  const route = normalizeRouteInput(input);
  state.routes.unshift(route);
  refreshSummary(state);
  await saveState(storage, state);
  return route;
}

export async function updateRoute(storage, routeId, patch) {
  const state = await loadState(storage);
  const index = state.routes.findIndex((route) => route.id === routeId);
  if (index < 0) {
    return null;
  }

  const updated = normalizeRouteInput({ ...state.routes[index], ...patch, id: routeId }, state.routes[index]);
  updated.id = routeId;
  updated.createdAt = state.routes[index].createdAt;
  updated.updatedAt = new Date().toISOString();
  state.routes[index] = updated;
  refreshSummary(state);
  await saveState(storage, state);
  return updated;
}

export async function deleteRoute(storage, routeId) {
  const state = await loadState(storage);
  const before = state.routes.length;
  state.routes = state.routes.filter((route) => route.id !== routeId);
  if (state.routes.length === before) {
    return false;
  }

  refreshSummary(state);
  await saveState(storage, state);
  return true;
}

export async function recordEvent(storage, event) {
  const state = await loadState(storage);
  const route = state.routes.find((item) => item.id === event.routeId);
  if (route) {
    const stats = ensureRouteStats(route);
    if (typeof event.deltaActive === "number" && event.deltaActive !== 0) {
      stats.activeConnections = Math.max(0, stats.activeConnections + event.deltaActive);
    }
    if (event.type === "open") {
      stats.totalConnections += 1;
      stats.lastSeenAt = event.at;
      stats.lastError = null;
    }
    if (event.type === "close") {
      stats.lastSeenAt = event.at;
    }
    if (event.type === "error") {
      stats.lastError = event.message ?? "Unknown error";
      stats.lastSeenAt = event.at;
    }
    route.stats = stats;
    route.updatedAt = event.at;
  }

  state.events.unshift({
    id: crypto.randomUUID(),
    ...event,
  });
  state.events = state.events.slice(0, 100);
  refreshSummary(state);
  await saveState(storage, state);
  return state;
}
