import type { NextConfig } from "next";
import { loadEnvConfig } from "@next/env";
import path from "path";
import { fileURLToPath } from "url";

/** This app’s folder (where `package.json` + `.env.local` live). */
const appRoot = path.dirname(fileURLToPath(import.meta.url));

// Merge `.env*` from this directory into `process.env` for the dev server / build.
// Do not set `turbopack.root` here: with a parent `package-lock.json`, pointing Turbopack at this
// folder breaks PostCSS/Tailwind resolution (it tries to resolve `tailwindcss` from the parent path).
loadEnvConfig(appRoot);

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "api.dicebear.com", pathname: "/**" },
      { protocol: "https", hostname: "i.pravatar.cc", pathname: "/**" },
    ],
  },
};

export default nextConfig;
