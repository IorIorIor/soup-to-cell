import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: 'tests/e2e',
  use: {
    baseURL: 'http://localhost:4173',
    launchOptions: {
      // Set PW_CHROMIUM_PATH to use a preinstalled Chromium instead of Playwright's download.
      executablePath: process.env.PW_CHROMIUM_PATH || undefined,
      args: ['--enable-unsafe-swiftshader', '--use-angle=swiftshader'],
    },
  },
  webServer: {
    command: 'npm run preview -- --port 4173 --strictPort',
    port: 4173,
    reuseExistingServer: true,
  },
  projects: [{ name: 'phone', use: { ...devices['Pixel 7'] } }],
})
