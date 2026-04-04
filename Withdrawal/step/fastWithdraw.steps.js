const { When, Then } = require('@cucumber/cucumber');
const assert = require('assert');

function setFastWithdrawSuccess(world, amount) {
    world.cash.requestedAmount = amount;
    world.ui.currentScreen = 'SUCCESS';
    world.ui.shownAmount = amount;
    world.ui.showContinueOption = true;
    world.ui.showEndOption = true;
}

function setFastWithdrawFail(world, message) {
    world.ui.currentScreen = 'FAIL';
    world.ui.message = message;
    world.txn.cardEjected = true;
}

When('使用者於主選單選擇快速提款金額 {int}', function (amount) {
    this.cash.requestedAmount = amount;

    if (!this.ui.fastWithdrawVisible) {
        return setFastWithdrawFail(this, '功能未提供');
    }

    if (this.host.success) {
        return setFastWithdrawSuccess(this, amount);
    }

    if (this.host.responseCode === 'H003') {
        return setFastWithdrawFail(this, '交易逾時');
    }

    if (this.host.responseCode === '3327' || this.host.responseCode === '4202') {
        return setFastWithdrawFail(this, '超過當日限額');
    }

    return setFastWithdrawFail(this, '交易失敗');
});

Then('系統應顯示交易逾時訊息', function () {
    assert.strictEqual(this.ui.message, '交易逾時');
});

Then('系統應顯示超過當日限額訊息', function () {
    assert.strictEqual(this.ui.message, '超過當日限額');
});