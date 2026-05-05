const path = require('path');
const { setWorldConstructor, Before, After, setDefaultTimeout } = require('@cucumber/cucumber');
const { _electron: electron } = require('playwright');

setDefaultTimeout(20000);

class UiWorld {
    constructor() {
        this.electronApp = null;
        this.page = null;
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
});

After(async function () {
    if (this.electronApp) {
        await this.electronApp.close();
    }
});
