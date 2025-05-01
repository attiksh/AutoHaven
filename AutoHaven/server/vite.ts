import { createServer as createViteServer } from "vite";
import type { Express } from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function setupVite(app: Express, server: any) {
  const rootDir = path.resolve(__dirname, "..", "client");

  const vite = await createViteServer({
    root: rootDir,
    appType: "custom",
    server: { middlewareMode: true },
    resolve: {
      alias: {
        "@": path.resolve(rootDir, "src"),
        "@shared": path.resolve(__dirname, "..", "shared"),
        "@assets": path.resolve(__dirname, "..", "attached_assets"),
      },
    },
  });

  app.use(vite.middlewares);
}

export async function serveStatic(app: Express) {
  const distPath = path.resolve(__dirname, "..", "dist", "public");

  if (fs.existsSync(distPath)) {
    const expressModule = await import("express");
    const expressStatic = expressModule.default.static;

    app.use(expressStatic(distPath));

    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    console.warn("[express] dist/public not found – skipping static serving");
  }
}

export function log(message: string) {
  console.log(`[express] ${message}`);
}