// Cross-platform production entry: serves the built app (dist/) and the API from one port.
process.env.NODE_ENV = 'production';
await import('../server/index.mjs');
