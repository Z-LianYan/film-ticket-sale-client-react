const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "http://localhost:7002",
      changeOrigin: false,
      pathRewrite: {
        "^/api": "",
      },
    })
  );
  app.use(
    "/socket.io",
    createProxyMiddleware({
      target: "http://localhost:7002",
      changeOrigin: true,
      ws: true
    })
  );
};
