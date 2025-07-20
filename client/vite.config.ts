import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'src/cert/key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'src/cert/cert.pem')),
    },
    port: 5173,
    host: 'localhost'
  }
})




























// Install chocolatey via "cmd [admin]" is easier
// choco install mkcert
// mkcert -install
// mkdir cert
// mkcert -key-file key.pem -cert-file cert.pem localhost
