<template>
    <div class="atm-shell">
        <header class="atm-header">
            <div>
                <p class="eyebrow">ATM FRONT FLOW</p>
                <h1>提款流程模擬</h1>
            </div>
            <div class="status-chip" data-testid="status-chip">目前狀態: <span data-testid="state-value">{{ state }}</span></div>
        </header>

        <main class="atm-stage">
            <section class="panel">
                <template v-if="state === STATES.IDLE">
                    <h2>IDLE</h2>
                    <p>ATM 待機中，等待客戶插卡。</p>
                    <button class="primary" data-testid="btn-start-service" @click="goTo(STATES.WAIT_INSERT_CARD)">開始服務</button>
                </template>

                <template v-else-if="state === STATES.WAIT_INSERT_CARD">
                    <h2>等候插卡</h2>
                    <p>請插入金融卡。</p>
                    <button class="primary" data-testid="btn-insert-card" @click="startCardReading">插入卡片</button>
                    <button class="ghost" @click="resetToIdle">返回待機</button>
                </template>

                <template v-else-if="state === STATES.READING_CARD">
                    <h2>讀卡中</h2>
                    <div class="loader"></div>
                    <p>正在讀取卡片資訊...</p>
                </template>

                <template v-else-if="state === STATES.PIN_INPUT">
                    <h2>輸入密碼</h2>
                    <p>請輸入 6 碼密碼。</p>
                    <input
                        v-model="pin"
                        type="password"
                        maxlength="6"
                        placeholder="******"
                        class="field"
                        data-testid="input-pin"
                    />
                    <p v-if="pinError" class="error" data-testid="error-pin">{{ pinError }}</p>
                    <button class="primary" data-testid="btn-submit-pin" @click="verifyPin">送出密碼</button>
                </template>

                <template v-else-if="state === STATES.PIN_VERIFY_LOADING">
                    <h2>密碼驗證中</h2>
                    <div class="loader"></div>
                    <p>請稍候，正在進行驗證...</p>
                </template>

                <template v-else-if="state === STATES.MAIN_MENU">
                    <h2>主選單</h2>
                    <p>請選擇交易服務。</p>
                    <div class="actions">
                        <button class="primary" data-testid="btn-fast-withdraw" @click="selectQuickWithdraw">快速提款（1000）</button>
                        <button class="primary alt" data-testid="btn-withdraw-service" @click="goTo(STATES.WITHDRAW_INPUT)">提款交易服務</button>
                    </div>
                </template>

                <template v-else-if="state === STATES.WITHDRAW_INPUT">
                    <h2>提款輸入金額頁</h2>
                    <p>輸入提款金額（100 的倍數，100 ~ 100000）。</p>
                    <input
                        v-model="amountInput"
                        type="number"
                        min="100"
                        step="100"
                        placeholder="例如 1300"
                        class="field"
                        data-testid="input-amount"
                    />
                    <p v-if="amountError" class="error" data-testid="error-amount">{{ amountError }}</p>
                    <button class="primary" data-testid="btn-submit-amount" @click="submitWithdrawAmount">確認金額</button>
                    <button class="ghost" @click="goTo(STATES.MAIN_MENU)">返回主選單</button>
                </template>

                <template v-else-if="state === STATES.TXN_LOADING">
                    <h2>提款交易進行中</h2>
                    <div class="loader"></div>
                    <p>送電文中，請稍候...</p>
                </template>

                <template v-else-if="state === STATES.CONTINUE_DECISION">
                    <h2>交易成功，是否繼續交易？</h2>
                    <p>本次提款金額 {{ selectedAmount }} 元。</p>
                    <div class="actions">
                        <button class="primary" data-testid="btn-continue-yes" @click="decideContinue(true)">是，繼續交易</button>
                        <button class="primary alt" data-testid="btn-continue-no" @click="decideContinue(false)">否，結束交易</button>
                    </div>
                </template>

                <template v-else-if="state === STATES.RESULT_VIEW">
                    <h2>交易結果顯示頁</h2>
                    <p>交易成功，提款金額 {{ selectedAmount }} 元。</p>
                    <button class="primary" data-testid="btn-confirm-dispense" @click="startDispense">確認並吐鈔</button>
                </template>

                <template v-else-if="state === STATES.DISPENSING">
                    <h2>吐鈔中</h2>
                    <div class="loader"></div>
                    <p>請稍候，正在出鈔...</p>
                </template>

                <template v-else-if="state === STATES.TAKE_CASH">
                    <h2>取鈔頁</h2>
                    <p>請取走您的現金。</p>
                    <button class="primary" data-testid="btn-take-cash" @click="finishTakeCash">我已取鈔</button>
                </template>

                <template v-else-if="state === STATES.EJECT_CARD">
                    <h2>退卡頁</h2>
                    <p>請取回您的金融卡。</p>
                    <button class="primary" data-testid="btn-take-card" @click="goTo(STATES.THANK_YOU)">我已取卡</button>
                </template>

                <template v-else-if="state === STATES.THANK_YOU">
                    <h2>謝謝光臨頁</h2>
                    <p>感謝使用本行 ATM。</p>
                    <button class="primary" data-testid="btn-finish" @click="resetToIdle">完成</button>
                </template>
            </section>

            <aside class="timeline">
                <h3>流程追蹤</h3>
                <ol>
                    <li v-for="(item, idx) in flowHistory" :key="idx">{{ item }}</li>
                </ol>
            </aside>
        </main>
    </div>
</template>

<script setup>
import { ref } from 'vue';

const STATES = {
    IDLE: 'IDLE',
    WAIT_INSERT_CARD: 'WAIT_INSERT_CARD',
    READING_CARD: 'READING_CARD',
    PIN_INPUT: 'PIN_INPUT',
    PIN_VERIFY_LOADING: 'PIN_VERIFY_LOADING',
    MAIN_MENU: 'MAIN_MENU',
    WITHDRAW_INPUT: 'WITHDRAW_INPUT',
    TXN_LOADING: 'TXN_LOADING',
    CONTINUE_DECISION: 'CONTINUE_DECISION',
    RESULT_VIEW: 'RESULT_VIEW',
    DISPENSING: 'DISPENSING',
    TAKE_CASH: 'TAKE_CASH',
    EJECT_CARD: 'EJECT_CARD',
    THANK_YOU: 'THANK_YOU',
};

const state = ref(STATES.IDLE);
const selectedAmount = ref(0);
const continueTrade = ref(false);
const amountInput = ref('');
const amountError = ref('');
const pin = ref('');
const pinError = ref('');
const flowHistory = ref(['IDLE']);

function pushHistory(label) {
    flowHistory.value.push(label);
    if (flowHistory.value.length > 16) {
        flowHistory.value.shift();
    }
}

function goTo(next) {
    state.value = next;
    pushHistory(next);
}

function resetToIdle() {
    selectedAmount.value = 0;
    continueTrade.value = false;
    amountInput.value = '';
    amountError.value = '';
    pin.value = '';
    pinError.value = '';
    state.value = STATES.IDLE;
    flowHistory.value = ['IDLE'];
}

function startCardReading() {
    goTo(STATES.READING_CARD);
    setTimeout(() => goTo(STATES.PIN_INPUT), 1000);
}

function verifyPin() {
    const isSixDigits = /^\d{6}$/.test(pin.value);
    if (!isSixDigits) {
        pinError.value = '密碼必須為 6 碼數字';
        return;
    }

    pinError.value = '';
    goTo(STATES.PIN_VERIFY_LOADING);
    setTimeout(() => goTo(STATES.MAIN_MENU), 1000);
}

function selectQuickWithdraw() {
    selectedAmount.value = 1000;
    submitTransaction();
}

function submitWithdrawAmount() {
    amountError.value = '';
    const amount = Number(amountInput.value);

    if (!Number.isInteger(amount) || amount <= 0) {
        amountError.value = '請輸入有效整數金額';
        return;
    }

    if (amount < 100 || amount > 100000) {
        amountError.value = '金額需介於 100 至 100000';
        return;
    }

    if (amount % 100 !== 0) {
        amountError.value = '提款金額必須為 100 的倍數';
        return;
    }

    selectedAmount.value = amount;
    submitTransaction();
}

function submitTransaction() {
    goTo(STATES.TXN_LOADING);
    setTimeout(() => goTo(STATES.CONTINUE_DECISION), 1200);
}

function decideContinue(willContinue) {
    continueTrade.value = willContinue;
    goTo(STATES.RESULT_VIEW);
}

function startDispense() {
    goTo(STATES.DISPENSING);
    setTimeout(() => goTo(STATES.TAKE_CASH), 1200);
}

function finishTakeCash() {
    if (continueTrade.value) {
        pin.value = '';
        goTo(STATES.PIN_INPUT);
        return;
    }

    goTo(STATES.EJECT_CARD);
}
</script>
