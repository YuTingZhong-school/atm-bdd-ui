const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

async function expectState(world, stateName) {
    await world.page.waitForFunction(
        (expected) => {
            const el = document.querySelector('[data-testid="state-value"]');
            return el && el.textContent && el.textContent.trim() === expected;
        },
        stateName,
        { timeout: 7000 }
    );

    const actual = await world.page.locator('[data-testid="state-value"]').textContent();
    assert.strictEqual((actual || '').trim(), stateName);
}

Given('UI ATM 已開啟於 IDLE', async function () {
    await expectState(this, 'IDLE');
});

When('UI 使用者開始服務並插入卡片', async function () {
    await this.page.getByTestId('btn-start-service').click();
    await expectState(this, 'WAIT_INSERT_CARD');
    await this.page.getByTestId('btn-insert-card').click();
});

Then('UI 應顯示狀態 {word}', async function (stateName) {
    await expectState(this, stateName);
});

When('UI 使用者輸入密碼 {word} 並送出', async function (pin) {
    await this.page.getByTestId('input-pin').fill(pin);
    await this.page.getByTestId('btn-submit-pin').click();
});

When('UI 使用者選擇快速提款', async function () {
    await this.page.getByTestId('btn-fast-withdraw').click();
});

When('UI 使用者選擇不繼續交易', async function () {
    await this.page.getByTestId('btn-continue-no').click();
});

When('UI 使用者確認並執行吐鈔', async function () {
    await this.page.getByTestId('btn-confirm-dispense').click();
});

When('UI 使用者取鈔', async function () {
    await this.page.getByTestId('btn-take-cash').click();
});

When('UI 使用者取卡', async function () {
    await this.page.getByTestId('btn-take-card').click();
});
