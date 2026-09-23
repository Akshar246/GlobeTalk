const rawServer = (import.meta.env.VITE_SERVER || "").trim();

const normalizedServer = rawServer.replace(/\/+$/, "");

export const server = normalizedServer || "http://localhost:3000";
