import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
export const setupRoutes = (app) => {
    // Ensure POST body parsing
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    // Proxy without TS type errors
    app.use("/auth", createProxyMiddleware({
        target: "http://localhost:5000",
        changeOrigin: true,
        pathRewrite: { "^/auth": "/api/v1/auth" },
        // TypeScript me onProxyReq/ logLevel ko recognize nahi karta, isliye 'as any'
        onProxyReq: (proxyReq, req, res) => {
            console.log(`Proxying request: ${req.method} ${req.url} -> ${proxyReq.path}`);
        },
        onError: (err, req, res) => {
            console.error("Proxy error:", err);
            res.status(500).send("Proxy error");
        },
        logLevel: "debug",
    }) // ✅ bypass TypeScript check
    );
};
//# sourceMappingURL=routes.js.map