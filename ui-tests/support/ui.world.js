const path = require('path');
const fs = require('fs');
const { setWorldConstructor, Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { _electron: electron } = require('playwright');

setDefaultTimeout(20000);

const screenshotDir = path.resolve(__dirname, '../artifacts/screenshots');

function sanitizeFileName(value) {
    return value.replace(/[^a-zA-Z0-9_-]+/g, '_');
}

class UiWorld {
    constructor() {
        this.electronApp = null;
        this.page = null;
        this.screenshotSequence = 0;
    }

    async captureStateScreenshot(stateName) {
        if (!this.page) {
            return;
        }

        await fs.promises.mkdir(screenshotDir, { recursive: true });
        this.screenshotSequence += 1;

        const fileName = `${String(this.screenshotSequence).padStart(2, '0')}_${sanitizeFileName(stateName)}_${Date.now()}.png`;
        await this.page.screenshot({   // Playwright 的 screenshot 方法
            path: path.join(screenshotDir, fileName),
            fullPage: true,
        });
    }
}

setWorldConstructor(UiWorld);

Before(async function () {
    const appPath = path.resolve(__dirname, '../../atm-electron-ui');
    const electronModulePath = path.join(appPath, 'node_modules', 'electron');
    const electronExecutable = require(electronModulePath);

    this.electronApp = await electron.launch({
        executablePath: electronExecutable,
        args: [appPath],
        cwd: appPath,
        env: {
            ...process.env,
            ELECTRON_E2E: process.env.ELECTRON_E2E || '1',
            ELECTRON_USE_DIST: process.env.ELECTRON_USE_DIST || '1',
        },
    });

    this.page = await this.electronApp.firstWindow();
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForSelector('[data-testid="state-value"]', { timeout: 15000 });
    this.screenshotSequence = 0;
});

After(async function () {
    if (this.electronApp) {
        await this.electronApp.close();
    }
});
