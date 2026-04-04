const { setWorldConstructor } = require('@cucumber/cucumber');

class AtmWorld {
    constructor() {
        this.pinVerified = false;

        this.card = {
            inserted: false,
            valid: false,
            type: null, // OWN / OTHER / MULTI / SINGLE
            accountType: null, // PRIMARY / SECONDARY
            taken: false,
        };

        this.host = {
            success: false,
            responseCode: null,
        };

        this.cash = {
            requestedAmount: null,
            dispensed: false,
            taken: false,
            hundredInsufficient: false,
            onlyThousandRequired: false,
            stackError: false,
            dispenseError: false,
            exchangeRequested: null, // true / false
        };

        this.network = {
            atmDisconnected: false,
            serverDisconnected: false,
        };

        this.ui = {
            currentScreen: 'IDLE',
            message: '',
            shownAmount: null,
            showContinueOption: false,
            showEndOption: false,
            fastWithdrawVisible: false,
            withdrawVisible: false,
        };

        this.txn = {
            terminated: false,
            cardEjected: false,
            reversalExecuted: false,
            pendingLog: false,
            printedCode: null,
            errorCount: 0,
        };
    }
}

setWorldConstructor(AtmWorld);