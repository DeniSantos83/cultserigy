import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests', timeout: 45000, expect: { timeout: 15000 },
  workers: 1, retries: 0, reporter: [['list'], ['html', {open:'never'}]],
  use: {baseURL:'http://localhost:5173', browserName:'chromium', screenshot:'only-on-failure', trace:'retain-on-failure'},
  webServer: {command:'npm run dev -- --host localhost --port 5173 --strictPort', url:'http://localhost:5173', reuseExistingServer:false, timeout:60000}
});
