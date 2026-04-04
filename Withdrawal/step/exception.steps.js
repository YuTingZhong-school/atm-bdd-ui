const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

Given('使用者於主選單選擇提款金額 {int}', function (amount) {
    this.cash.requestedAmount = amount;
    this.ui.currentScreen = 'WITHDRAWAL';
});

Given('目前交易條件為只須千元鈔', function () {
    this.cash.onlyThousandRequired = true;
});

Given('出鈔作業完成', function () {
    this.cash.dispensed = true;
});

Given('出鈔模組發生疊鈔異常', function () {
    this.cash.stackError = true;
});

Given('出鈔模組發生出鈔異常', function () {
    this.cash.dispenseError = true;
});

When('系統執行出鈔', function () {
    if (this.cash.stackError) {
        this.txn.printedCode = 'D101';
        this.txn.reversalExecuted = true;
        this.txn.pendingLog = true;
        return;
    }

    if (this.cash.dispenseError) {
        this.txn.printedCode = 'D111';
        this.txn.reversalExecuted = false;
        this.txn.pendingLog = true;
        return;
    }

    this.cash.dispensed = true;
});

When('使用者取卡但未取鈔', function () {
    this.card.taken = true;
    this.cash.taken = false;
    this.txn.printedCode = 'C101';
    this.txn.reversalExecuted = false;
    this.txn.pendingLog = true;
    this.ui.currentScreen = 'IDLE';
});

When('使用者未取鈔', function () {
    this.cash.taken = false;
    this.txn.printedCode = 'C101';
    this.txn.reversalExecuted = false;
    this.txn.pendingLog = true;
    this.txn.terminated = true;
    this.ui.currentScreen = 'IDLE';
});

When('使用者未取卡', function () {
    this.card.taken = false;
    this.txn.printedCode = 'C011';
    this.txn.reversalExecuted = true;
    this.txn.pendingLog = true;
    this.ui.currentScreen = 'IDLE';
});

When('ATM 端網路中斷', function () {
    this.network.atmDisconnected = true;
    this.txn.printedCode = 'H001';
    this.txn.pendingLog = true;
    this.ui.currentScreen = 'IDLE';
});

When('Server 端網路中斷', function () {
    this.network.serverDisconnected = true;
    this.txn.printedCode = 'H003';
    this.txn.pendingLog = true;
    this.ui.currentScreen = 'IDLE';
});

Then('系統應列印 {word}', function (code) {
    assert.strictEqual(this.txn.printedCode, code);
});

Then('系統應執行沖正', function () {
    assert.strictEqual(this.txn.reversalExecuted, true);
});

Then('系統不應執行沖正', function () {
    assert.strictEqual(this.txn.reversalExecuted, false);
});

Then('系統應記錄 Pending log', function () {
    assert.strictEqual(this.txn.pendingLog, true);
});