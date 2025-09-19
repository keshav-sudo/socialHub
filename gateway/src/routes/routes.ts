import { Application } from "express";
import express, { Request, Response } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { ClientRequest } from "http";

export const setupRoutes = (app: Application): void => {
  // Ensure POST body parsing
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Proxy without TS type errors
  app.use(
    "/auth",
    createProxyMiddleware({
      target: "http://localhost:5000",
      changeOrigin: true,
      pathRewrite: { "^/auth": "/api/v1/auth" },
      onProxyReq: (proxyReq: ClientRequest, req: Request, res: Response) => {
        console.log(`Proxying request: ${req.method} ${req.url} -> ${proxyReq.path}`);
      },
      onError: (err: Error, req: Request, res: Response) => {
        console.error("Proxy error:", err);
        res.status(500).send("Proxy error");
      },
      logLevel: "debug",
    } as any) // ✅ bypass TypeScript check
  );
};
