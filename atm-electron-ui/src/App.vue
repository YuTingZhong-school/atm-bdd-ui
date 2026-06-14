<template>
    <div class="atm-shell">
        <div class="atm-bezel">
            <header class="atm-topbar">
                <div class="brand-lockup">
                    <div class="brand-mark">◈</div>
                    <div>
                        <p class="eyebrow">數位金融</p>
                        <h1>ATM 服務介面</h1>
                    </div>
                </div>

                <div class="serial time" data-testid="time-value">{{ currentTime }}</div>
            </header>

            <main class="atm-layout">
                <section class="screen">
                    <div class="screen-shell">
                        <div class="screen-header">
                            <div>
                                <p class="screen-kicker">{{ screenMeta.kicker }}</p>
                                <h2>{{ screenMeta.title }}</h2>
                                <p class="screen-subtitle">{{ screenMeta.subtitle }}</p>
                            </div>
                        </div>

                        <template v-if="state === STATES.IDLE">
                            <div class="idle-layout">
                                <div class="idle-main">
                                    <div class="idle-grid">
                                        <button class="service-card service-card--primary" data-testid="btn-start-service" @click="goTo(STATES.WAIT_INSERT_CARD)">
                                            <span class="service-index">1</span>
                                            <span class="service-title">提款</span>
                                            <span class="service-hint">提領作業</span>
                                            <span class="service-icon">₪</span>
                                        </button>

                                        <div class="service-card service-card--neutral">
                                            <span class="service-index">2</span>
                                            <span class="service-title">存款</span>
                                            <span class="service-hint">現金入帳</span>
                                            <span class="service-icon">▣</span>
                                        </div>

                                        <div class="service-card service-card--neutral">
                                            <span class="service-index">3</span>
                                            <span class="service-title">轉帳</span>
                                            <span class="service-hint">帳戶轉移</span>
                                            <span class="service-icon">⇄</span>
                                        </div>

                                        <div class="service-card service-card--neutral compact">
                                            <span class="service-index">4</span>
                                            <span class="service-title">繳費</span>
                                            <span class="service-icon">◔</span>
                                        </div>

                                        <div class="service-card service-card--neutral compact">
                                            <span class="service-index">5</span>
                                            <span class="service-title">其他服務</span>
                                            <span class="service-icon">⚙</span>
                                        </div>
                                    </div>

                                    <div class="account-summary">
                                        <div class="summary-row">
                                            <span class="summary-label">帳號</span>
                                            <strong>123 1234568 1234567</strong>
                                            <button class="mini-pill" type="button" @click="goTo(STATES.WAIT_INSERT_CARD)">切換帳戶</button>
                                        </div>
                                        <div class="summary-row">
                                            <span class="summary-label">餘額</span>
                                            <strong>{{ idleBalance }}</strong>
                                            <button class="mini-pill" type="button">顯示餘額</button>
                                            <button class="mini-pill" type="button">列印餘額</button>
                                        </div>
                                        <p class="summary-note">免費跨轉前 10 次</p>
                                    </div>
                                </div>

                                <aside v-if="showQuickRail" class="quick-rail quick-rail--idle">
                                    <h3>快速提款</h3>
                                    <button v-for="amount in quickAmounts" :key="amount" class="quick-button" type="button">{{ formatAmount(amount) }}</button>
                                </aside>
                            </div>
                        </template>

                        <template v-else-if="state === STATES.WAIT_INSERT_CARD">
                            <div class="welcome-stage">
                                <div class="promo-card">
                                    <p class="promo-eyebrow">無障礙語音模式 按5進入</p>
                                    <div class="promo-visual">
                                        <div class="promo-ribbon"></div>
                                        <div class="promo-art">
                                            <div class="promo-sun"></div>
                                            <div class="promo-wave"></div>
                                            <div class="promo-brand">數位服務</div>
                                        </div>
                                    </div>
                                </div>

                                <div class="welcome-actions">
                                    <button class="choice-card choice-card--light" type="button">
                                        <span class="choice-index">1</span>
                                        <span class="choice-title">按鈕字數大字</span>
                                        <span class="choice-icon">₪</span>
                                    </button>

                                    <button class="choice-card choice-card--accent" data-testid="btn-insert-card" @click="startCardReading">
                                        <span class="choice-index">2</span>
                                        <span class="choice-title">按鈕字數大字</span>
                                        <span class="choice-icon">₪</span>
                                    </button>
                                </div>

                                <p class="info-line">本機可提領面額 1000 / 100 / 2000 / 200</p>
                                <div class="warning-box">首頁提醒元件的文字限制為一行每行字的字數限制為二十七字</div>
                            </div>
                        </template>

                        <template v-else-if="state === STATES.READING_CARD">
                            <div class="loading-stage">
                                <div class="loading-panel">
                                    <div class="loader large"></div>
                                    <h3>讀卡中</h3>
                                    <p>正在讀取卡片資訊，請稍候。</p>
                                </div>
                            </div>
                        </template>

                        <template v-else-if="state === STATES.PIN_INPUT">
                            <div class="pin-stage">
                                <div class="copy-block">
                                    <h3>交易頁的標題字數限制為一行，最多二十個字</h3>
                                    <p>內容文字字數限制為一行，每行最多二十三個中文字。內容文字數限制為一行。</p>
                                </div>

                                <div class="pin-visual">
                                    <div class="lock-halo"></div>
                                    <div class="lock-card">
                                        <div class="lock-body"></div>
                                        <div class="lock-keyhole"></div>
                                    </div>
                                </div>

                                <input
                                    v-model="pin"
                                    type="password"
                                    maxlength="6"
                                    placeholder="******"
                                    class="field"
                                    data-testid="input-pin"
                                />
                                <p v-if="pinError" class="error" data-testid="error-pin">{{ pinError }}</p>
                                <button class="primary large-action" data-testid="btn-submit-pin" @click="verifyPin">送出密碼</button>
                            </div>
                        </template>

                        <template v-else-if="state === STATES.PIN_VERIFY_LOADING">
                            <div class="loading-stage">
                                <div class="loading-panel">
                                    <div class="loader large"></div>
                                    <h3>密碼驗證中</h3>
                                    <p>請稍候，正在進行驗證...</p>
                                </div>
                            </div>
                        </template>

                        <template v-else-if="state === STATES.MAIN_MENU">
                            <div class="menu-stage">
                                <div class="menu-grid">
                                    <button class="menu-card menu-card--accent" data-testid="btn-fast-withdraw" @click="selectQuickWithdraw">
                                        <span class="menu-index">1</span>
                                        <span class="menu-title">快速提款</span>
                                        <span class="menu-amount">1,000</span>
                                        <span class="menu-icon">₪</span>
                                    </button>

                                    <button class="menu-card menu-card--light" data-testid="btn-withdraw-service" @click="goTo(STATES.WITHDRAW_INPUT)">
                                        <span class="menu-index">2</span>
                                        <span class="menu-title">提款交易服務</span>
                                        <span class="menu-amount">自訂金額</span>
                                        <span class="menu-icon">₪</span>
                                    </button>
                                </div>

                                <div class="service-strip">
                                    <div>
                                        <span class="service-strip-label">帳號</span>
                                        <strong>050 01234567891</strong>
                                    </div>
                                    <div>
                                        <span class="service-strip-label">餘額</span>
                                        <strong>{{ balanceDisplay }}</strong>
                                    </div>
                                </div>
                            </div>
                        </template>

                        <template v-else-if="state === STATES.WITHDRAW_INPUT">
                            <div class="amount-stage">
                                <div class="copy-block compact-copy">
                                    <h3>輸入提款金額</h3>
                                    <p>金額需為 100 的倍數，範圍介於 100 到 100000。</p>
                                </div>

                                <div class="quick-amounts">
                                    <button
                                        v-for="amount in quickAmounts"
                                        :key="amount"
                                        type="button"
                                        class="quick-chip"
                                        @click="amountInput = String(amount)"
                                    >
                                        {{ formatAmount(amount) }}
                                    </button>
                                </div>

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

                                <div class="action-row">
                                    <button class="primary large-action" data-testid="btn-submit-amount" @click="submitWithdrawAmount">確認金額</button>
                                    <button class="ghost large-action" type="button" @click="goTo(STATES.MAIN_MENU)">返回主選單</button>
                                </div>
                            </div>
                        </template>

                        <template v-else-if="state === STATES.TXN_LOADING">
                            <div class="loading-stage">
                                <div class="loading-panel">
                                    <div class="loader large"></div>
                                    <h3>提款交易進行中</h3>
                                    <p>送電文中，請稍候...</p>
                                </div>
                            </div>
                        </template>

                        <template v-else-if="state === STATES.CONTINUE_DECISION">
                            <div class="receipt-stage">
                                <div class="receipt-card">
                                    <div class="receipt-line">
                                        <span>交易類別</span>
                                        <strong>快速提款</strong>
                                    </div>
                                    <div class="receipt-line">
                                        <span>交易金額</span>
                                        <strong>{{ formatMoney(selectedAmount) }}</strong>
                                    </div>
                                    <div class="receipt-line">
                                        <span>手續費</span>
                                        <strong>$0</strong>
                                    </div>
                                    <div class="receipt-line">
                                        <span>交易日</span>
                                        <strong>{{ receiptDate }}</strong>
                                    </div>
                                </div>

                                <div class="receipt-meta">
                                    <p class="receipt-account">提領帳號 <strong>050 01234567891</strong></p>
                                    <p class="receipt-balance">可用餘額 <strong>{{ balanceDisplay }}</strong></p>
                                    <button class="mini-pill" type="button" @click="toggleBalance">{{ balanceVisible ? '隱藏餘額' : '顯示餘額' }}</button>
                                </div>

                                <div class="action-row action-row--end">
                                    <button class="primary large-action" data-testid="btn-continue-yes" @click="decideContinue(true)">是，繼續交易</button>
                                    <button class="primary alt large-action" data-testid="btn-continue-no" @click="decideContinue(false)">否，結束交易</button>
                                </div>
                            </div>
                        </template>

                        <template v-else-if="state === STATES.RESULT_VIEW">
                            <div class="result-stage">
                                <div class="success-banner">交易成功</div>

                                <div class="result-summary">
                                    <div class="result-card result-card--receipt">
                                        <div class="receipt-line"><span>交易類別</span><strong>快速提款</strong></div>
                                        <div class="receipt-line"><span>交易金額</span><strong>{{ formatMoney(selectedAmount) }}</strong></div>
                                        <div class="receipt-line"><span>手續費</span><strong>$0</strong></div>
                                        <div class="receipt-line"><span>交易日</span><strong>{{ receiptDate }}</strong></div>
                                    </div>

                                    <div class="result-card result-card--account">
                                        <div class="result-label">提領帳號</div>
                                        <div class="result-value">050 01234567891</div>
                                        <div class="result-label">可用餘額</div>
                                        <div class="result-value result-value--balance">{{ balanceDisplay }}</div>
                                        <button class="mini-pill" type="button" @click="toggleBalance">{{ balanceVisible ? '隱藏餘額' : '顯示餘額' }}</button>
                                    </div>
                                </div>

                                <p class="card-reminder">提醒您！卡片仍在 ATM 中</p>

                                <div class="action-row action-row--end">
                                    <button class="primary large-action soft-action" type="button">8 列印明細表</button>
                                    <button class="primary large-action" data-testid="btn-confirm-dispense" @click="startDispense">9 不印明細表</button>
                                </div>
                            </div>
                        </template>

                        <template v-else-if="state === STATES.DISPENSING">
                            <div class="loading-stage">
                                <div class="loading-panel">
                                    <div class="loader large"></div>
                                    <h3>吐鈔中</h3>
                                    <p>請稍候，正在出鈔...</p>
                                </div>
                            </div>
                        </template>

                        <template v-else-if="state === STATES.TAKE_CASH">
                            <div class="finish-stage">
                                <div class="finish-visual finish-visual--cash"></div>
                                <div class="finish-copy">
                                    <h3>請取走您的現金</h3>
                                    <p>請確認鈔票已取出，再繼續下一步。</p>
                                </div>
                                <button class="primary large-action" data-testid="btn-take-cash" @click="finishTakeCash">我已取鈔</button>
                            </div>
                        </template>

                        <template v-else-if="state === STATES.EJECT_CARD">
                            <div class="finish-stage">
                                <div class="finish-visual finish-visual--card"></div>
                                <div class="finish-copy">
                                    <h3>請取回您的金融卡</h3>
                                    <p>完成交易後，請記得將卡片取回。</p>
                                </div>
                                <button class="primary large-action" data-testid="btn-take-card" @click="goTo(STATES.THANK_YOU)">我已取卡</button>
                            </div>
                        </template>

                        <template v-else-if="state === STATES.THANK_YOU">
                            <div class="thanks-stage">
                                <h3>謝謝光臨</h3>
                                    <p>感謝使用本 ATM，歡迎再次光臨。</p>
                                <button class="primary large-action" data-testid="btn-finish" @click="resetToIdle">完成</button>
                            </div>
                        </template>
                    </div>
                </section>

                <aside class="meta-panel">
                    <div class="status-chip" data-testid="status-chip">目前狀態: <span data-testid="state-value">{{ state }}</span></div>

                    <div class="history-card">
                        <h3>流程追蹤</h3>
                        <ol>
                            <li v-for="(item, idx) in flowHistory" :key="idx">{{ item }}</li>
                        </ol>
                    </div>
                </aside>
                <!-- quick-rail is now rendered inside the screen to keep ATM area consistent -->
            </main>
            <!-- footer language/contact removed per design requirement -->
        </div>
    </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

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
const balanceVisible = ref(true);
const quickAmounts = [1000, 3000, 5000, 10000, 20000, 30000];
const timers = new Set();
const currencyFormatter = new Intl.NumberFormat('zh-TW');

const currentTime = ref('');

function updateTime() {
    const now = new Date();
    currentTime.value = now.toLocaleTimeString('zh-TW', { hour12: false });
}

const receiptDate = computed(() => {
    const now = new Date();
    const year = now.getFullYear() - 1911;
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}/${month}/${day}`;
});

const idleBalance = '$***,***,***';
const showQuickRail = computed(() => state.value === STATES.IDLE);
const balanceDisplay = computed(() => (balanceVisible.value ? `$${formatAmount(999999999)}` : '$***,***,***'));
const screenMeta = computed(() => {
    switch (state.value) {
        case STATES.IDLE:
            return {
                kicker: '金融卡首頁',
                title: '請選擇您要的服務',
                subtitle: '左側為主要交易功能，右側提供快速提款。',
            };
        case STATES.WAIT_INSERT_CARD:
            return {
                kicker: '插卡提示',
                title: '請插入金融卡',
                subtitle: '完成插卡後，系統將自動進入讀卡流程。',
            };
        case STATES.READING_CARD:
            return {
                kicker: '卡片處理中',
                title: '讀卡作業進行中',
                subtitle: '系統正在確認卡片資訊，請稍候。',
            };
        case STATES.PIN_INPUT:
            return {
                kicker: '安全驗證',
                title: '請輸入交易密碼',
                subtitle: '為了保護您的帳戶，請完成 6 碼密碼驗證。',
            };
        case STATES.PIN_VERIFY_LOADING:
            return {
                kicker: '驗證中',
                title: '密碼驗證中',
                subtitle: '系統正在與主機確認交易權限。',
            };
        case STATES.MAIN_MENU:
            return {
                kicker: '主選單',
                title: '請選擇交易服務',
                subtitle: '常用功能已放在前方，便於快速操作。',
            };
        case STATES.WITHDRAW_INPUT:
            return {
                kicker: '提款設定',
                title: '輸入提款金額',
                subtitle: '支援 100 的倍數，介於 100 到 100000。',
            };
        case STATES.TXN_LOADING:
            return {
                kicker: '交易處理',
                title: '提款交易進行中',
                subtitle: '正在送出交易電文，請勿抽卡。',
            };
        case STATES.CONTINUE_DECISION:
            return {
                kicker: '交易完成',
                title: '是否繼續交易？',
                subtitle: '您可以選擇繼續操作或直接結束交易。',
            };
        case STATES.RESULT_VIEW:
            return {
                kicker: '交易結果',
                title: '交易成功',
                subtitle: '請確認明細後再進行吐鈔。',
            };
        case STATES.DISPENSING:
            return {
                kicker: '出鈔中',
                title: '吐鈔中',
                subtitle: '現金正在輸出，請稍候。',
            };
        case STATES.TAKE_CASH:
            return {
                kicker: '取鈔',
                title: '請取走您的現金',
                subtitle: '確認取鈔後，交易才會進入下一步。',
            };
        case STATES.EJECT_CARD:
            return {
                kicker: '退卡',
                title: '請取回您的金融卡',
                subtitle: '交易已結束，請記得帶走卡片。',
            };
        case STATES.THANK_YOU:
            return {
                kicker: '完成',
                title: '謝謝光臨',
                subtitle: '感謝使用本 ATM。',
            };
        default:
            return {
                kicker: 'ATM',
                title: '服務畫面',
                subtitle: '準備中。',
            };
    }
});

function schedule(callback, delay) {
    const timerId = window.setTimeout(() => {
        timers.delete(timerId);
        callback();
    }, delay);

    timers.add(timerId);
    return timerId;
}

onMounted(() => {
    updateTime();
    const clockId = window.setInterval(updateTime, 1000);
    timers.add(clockId);
});

onBeforeUnmount(() => {
    timers.forEach((timerId) => {
        window.clearTimeout(timerId);
        window.clearInterval(timerId);
    });
    timers.clear();
});

function formatAmount(value) {
    return currencyFormatter.format(value);
}

function formatMoney(value) {
    return `$${formatAmount(value)}`;
}

function toggleBalance() {
    balanceVisible.value = !balanceVisible.value;
}

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
    balanceVisible.value = true;
    state.value = STATES.IDLE;
    flowHistory.value = ['IDLE'];
}

function startCardReading() {
    goTo(STATES.READING_CARD);
    schedule(() => goTo(STATES.PIN_INPUT), 1000);
}

function verifyPin() {
    const isSixDigits = /^\d{6}$/.test(pin.value);
    if (!isSixDigits) {
        pinError.value = '密碼必須為 6 碼數字';
        return;
    }

    pinError.value = '';
    goTo(STATES.PIN_VERIFY_LOADING);
    schedule(() => goTo(STATES.MAIN_MENU), 1000);
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
    schedule(() => goTo(STATES.CONTINUE_DECISION), 1200);
}

function decideContinue(willContinue) {
    continueTrade.value = willContinue;
    goTo(STATES.RESULT_VIEW);
}

function startDispense() {
    goTo(STATES.DISPENSING);
    schedule(() => goTo(STATES.TAKE_CASH), 1200);
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
