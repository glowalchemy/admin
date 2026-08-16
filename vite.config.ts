import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const brandName = (env.BRAND_NAME || "GlowAlchemy").trim();
  const proxyTarget = env.VITE_PROXY_TARGET || "http://localhost:5000";

  return {
    server: {
      host: "::",
      port: 8080,
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
          secure: false,
          configure: (proxy) => {
            proxy.on("error", (err, _req, _res) => {
              console.error("[proxy] error", err);
            });
          },
        },
        "/uploads": {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
    // Expose BRAND_* vars to the client so `%BRAND_NAME%` in index.html is
    // replaced too. VITE_BRAND_NAME (below) is derived from the same value.
    envPrefix: ["VITE_", "BRAND_"],
    define: {
      "import.meta.env.VITE_BRAND_NAME": JSON.stringify(brandName),
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
