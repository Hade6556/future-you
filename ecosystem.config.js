const path = require("path");

const WAT_DIR = "C:/Users/btixa/Desktop/Agentic workflow";
const APP_DIR = __dirname;

module.exports = {
  apps: [
    {
      name: "pipeline-api",
      script: "C:/Users/btixa/AppData/Local/Programs/Python/Python312/python.exe",
      args: ["tools/api_server.py"],
      cwd: WAT_DIR,
      interpreter: "none",
      autorestart: true,
      watch: false,
      max_restarts: 10,
      restart_delay: 3000,
      env: { PYTHONUNBUFFERED: "1" },
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
    {
      name: "behavio-app",
      script: "node_modules/next/dist/bin/next",
      args: ["start"],
      cwd: APP_DIR,
      interpreter: "node",
      autorestart: true,
      watch: false,
      max_restarts: 10,
      restart_delay: 3000,
      env: {
        NODE_ENV: "production",
        PIPELINE_API_URL: "http://localhost:8000",
      },
      log_date_format: "YYYY-MM-DD HH:mm:ss",
    },
  ],
};
