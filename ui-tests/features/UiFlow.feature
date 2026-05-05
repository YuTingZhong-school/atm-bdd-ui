Feature: ATM UI 自動化流程
    為了驗證前端 UI 與 BDD 情境一致
    系統應可由 Cucumber 自動操作 Electron 頁面完成提款流程

    Scenario: 快速提款成功後不繼續交易
        Given UI ATM 已開啟於 IDLE
        When UI 使用者開始服務並插入卡片
        Then UI 應顯示狀態 PIN_INPUT

        When UI 使用者輸入密碼 123456 並送出
        Then UI 應顯示狀態 MAIN_MENU

        When UI 使用者選擇快速提款
        Then UI 應顯示狀態 CONTINUE_DECISION

        When UI 使用者選擇不繼續交易
        Then UI 應顯示狀態 RESULT_VIEW

        When UI 使用者確認並執行吐鈔
        Then UI 應顯示狀態 TAKE_CASH

        When UI 使用者取鈔
        Then UI 應顯示狀態 EJECT_CARD

        When UI 使用者取卡
        Then UI 應顯示狀態 THANK_YOU
