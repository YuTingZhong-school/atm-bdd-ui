const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

Given('使用者已插入有效金融卡', function () {
    this.card.inserted = true;
    this.card.valid = true;
});

Given('使用者已完成密碼驗證', function () {
    this.pinVerified = true;
});

Given('系統已進入主選單', function () {
    this.ui.currentScreen = 'MAIN_MENU';
});

When('使用者進入主選單', function () {
    this.ui.currentScreen = 'MAIN_MENU';
});

Given('系統主選單提供一般提款功能', function () {
    this.ui.withdrawVisible = true;
});

Given('系統主選單提供快速提款功能', function () {
    this.ui.fastWithdrawVisible = true;
});

Given('系統主選單提供提款功能', function () {
    this.ui.withdrawVisible = true;
});

Given('系統目前不提供提款服務', function () {
    this.ui.withdrawVisible = false;
    this.ui.fastWithdrawVisible = false;
    this.txn.cardEjected = true;
});

Given('主機回應為交易成功', function () {
    this.host.success = true;
    this.host.responseCode = '00';
});

Given('主機回應錯誤碼為 {word}', function (code) {
    this.host.success = false;
    this.host.responseCode = code;
});

Given('卡片類型為自行卡', function () {
    this.card.type = 'OWN';
});

Given('卡片類型為他行卡', function () {
    this.card.type = 'OTHER';
});

Given('卡片類型為多帳號卡', function () {
    this.card.type = 'MULTI';
});

Given('卡片類型為單帳號卡', function () {
    this.card.type = 'SINGLE';
});

When('使用者選擇主帳號', function () {
    this.card.accountType = 'PRIMARY';
});

When('使用者選擇子帳號', function () {
    this.card.accountType = 'SECONDARY';
});

When('使用者選擇 {word}', function (accountType) {
    if (accountType === '主帳號') this.card.accountType = 'PRIMARY';
    if (accountType === '子帳號') this.card.accountType = 'SECONDARY';
});

When('使用者選擇繼續交易', function () {
    this.txn.terminated = false;
    this.ui.currentScreen = 'WAIT_TAKE_CASH';
});

When('使用者選擇結束交易', function () {
    this.txn.terminated = true;
    this.txn.cardEjected = true;
});

When('使用者取消交易', function () {
    this.txn.terminated = true;
    this.txn.cardEjected = true;
});

When('使用者取鈔', function () {
    this.cash.taken = true;

    if (!this.txn.terminated && this.ui.currentScreen === 'WAIT_TAKE_CASH') {
        this.ui.currentScreen = 'PIN_ENTRY';
    }
});

When('使用者取卡', function () {
    this.card.taken = true;
    this.ui.currentScreen = 'IDLE';
});

Then('系統應顯示交易成功畫面', function () {
    assert.strictEqual(this.ui.currentScreen, 'SUCCESS');
});

Then('系統應顯示交易失敗訊息', function () {
    assert.strictEqual(this.ui.currentScreen, 'FAIL');
});

Then('系統應顯示錯誤訊息', function () {
    assert.strictEqual(this.ui.currentScreen, 'FAIL');
});

Then('系統應顯示提款金額 {int}', function (amount) {
    assert.strictEqual(this.ui.shownAmount, amount);
});

Then('顯示提款金額 {int}', function (amount) {
    assert.strictEqual(this.ui.shownAmount, amount);
});

Then('系統應顯示繼續交易選項', function () {
    assert.strictEqual(this.ui.showContinueOption, true);
});

Then('系統應顯示結束交易選項', function () {
    assert.strictEqual(this.ui.showEndOption, true);
});

Then('顯示繼續交易選項', function () {
    assert.strictEqual(this.ui.showContinueOption, true);
});

Then('顯示結束交易選項', function () {
    assert.strictEqual(this.ui.showEndOption, true);
});

Then('系統應允許使用者重新輸入提款金額', function () {
    assert.ok(['FAIL', 'WITHDRAWAL'].includes(this.ui.currentScreen));
});

Then('系統應結束本次交易流程', function () {
    assert.strictEqual(this.txn.terminated, true);
});

Then('系統應退卡', function () {
    assert.strictEqual(this.txn.cardEjected, true);
});

Then('系統應返回 Idle 狀態', function () {
    assert.strictEqual(this.ui.currentScreen, 'IDLE');
});

Then('系統不應顯示快速提款按鈕', function () {
    assert.strictEqual(this.ui.fastWithdrawVisible, false);
});

Then('系統不應顯示提款按鈕', function () {
    assert.strictEqual(this.ui.withdrawVisible, false);
});

Then('系統應重新讀卡並返回輸入密碼', function () {
    assert.strictEqual(this.ui.currentScreen, 'PIN_ENTRY');
});