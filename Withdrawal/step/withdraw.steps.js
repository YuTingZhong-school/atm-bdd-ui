const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

function setSuccessResult(world, amount) {
    world.ui.currentScreen = 'SUCCESS';
    world.ui.shownAmount = amount;
    world.ui.showContinueOption = true;
    world.ui.showEndOption = true;
}

function setFailResult(world, message) {
    world.ui.currentScreen = 'FAIL';
    world.ui.message = message;
}

When('使用者於主選單選擇一般提款', function () {
    this.ui.currentScreen = 'WITHDRAWAL';
});

When('使用者選擇固定提款金額 {int}', function (amount) {
    this.cash.requestedAmount = amount;

    if (this.host.success) {
        setSuccessResult(this, amount);
    } else {
        setFailResult(this, '交易失敗');
    }
});

When('使用者輸入提款金額 {int}', function (amount) {
    this.cash.requestedAmount = amount;

    if (amount % 100 !== 0) {
        return setFailResult(this, '非百元倍數');
    }

    if (this.card.type === 'OWN' && amount > 100000) {
        return setFailResult(this, '超過自行卡提款限額');
    }

    if (this.card.type === 'OTHER' && amount > 20000) {
        return setFailResult(this, '超過他行卡提款限額');
    }

    if (this.cash.hundredInsufficient && amount % 1000 !== 0) {
        return setFailResult(this, '鈔券不足');
    }

    if (this.host.success) {
        return setSuccessResult(this, amount);
    }

    return setFailResult(this, '交易失敗');
});

Given('ATM 百元鈔券庫存不足', function () {
    this.cash.hundredInsufficient = true;
});

When('使用者選擇換鈔', function () {
    this.cash.exchangeRequested = true;
});

When('使用者選擇不換鈔', function () {
    this.cash.exchangeRequested = false;
});

Then('系統應依原鈔種配置並吐鈔', function () {
    this.cash.dispensed = true;
    assert.strictEqual(this.cash.dispensed, true);
});

Then('系統應完成吐鈔', function () {
    this.cash.dispensed = true;
    assert.strictEqual(this.cash.dispensed, true);
});

When('使用者第1次輸入錯誤金額 {int}', function (amount) {
    this.cash.requestedAmount = amount;
    this.txn.errorCount = 1;
    this.ui.currentScreen = 'FAIL';
    this.ui.message = '錯誤金額';
});

When('使用者第2次輸入錯誤金額 {int}', function (amount) {
    this.cash.requestedAmount = amount;
    this.txn.errorCount = 2;
    this.ui.currentScreen = 'FAIL';
    this.ui.message = '錯誤金額';
});

When('使用者第3次輸入錯誤金額 {int}', function (amount) {
    this.cash.requestedAmount = amount;
    this.txn.errorCount = 3;
    this.txn.terminated = true;
    this.txn.cardEjected = true;
});

Then('系統應顯示非百元倍數錯誤訊息', function () {
    assert.strictEqual(this.ui.message, '非百元倍數');
});

Then('系統應顯示鈔券不足訊息', function () {
    assert.strictEqual(this.ui.message, '鈔券不足');
});

Then('系統應顯示超過自行卡提款限額訊息', function () {
    assert.strictEqual(this.ui.message, '超過自行卡提款限額');
});

Then('系統應顯示超過他行卡提款限額訊息', function () {
    assert.strictEqual(this.ui.message, '超過他行卡提款限額');
});