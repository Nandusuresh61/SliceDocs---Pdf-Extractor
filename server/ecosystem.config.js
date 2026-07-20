module.exports = {
  apps: [
    {
      name: "slicedocs-api",
      script: "dist/server.js",
      instances: "max", // Run as many instances as CPU cores
      exec_mode: "cluster",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 5000 // You can specify your production port here
      }
    }
  ]
};
