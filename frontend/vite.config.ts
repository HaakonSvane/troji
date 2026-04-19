import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import relay from "vite-plugin-relay";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [tailwindcss(), relay, reactRouter()],
  resolve: {
    tsconfigPaths: true,
  },
});
