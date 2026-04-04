Feature: 提款例外與異常處理
  為了確保提款流程在硬體異常、用戶未取件與網路異常下仍能依規格處理
  系統應記錄正確結果、列印代碼並依條件決定是否沖正

  Background:
    Given 使用者已插入有效金融卡
    And 使用者已完成密碼驗證
    And 系統已進入主選單
    And 系統主選單提供提款功能
    And 使用者於主選單選擇提款金額 1000
    And 目前交易條件為只須千元鈔

  Scenario: 結束交易後未取鈔
    Given 主機回應為交易成功
    And 出鈔作業完成
    When 使用者選擇結束交易
    And 使用者取卡但未取鈔
    Then 系統應列印 C101
    And 系統不應執行沖正
    And 系統應記錄 Pending log
    And 系統應返回 Idle 狀態

  Scenario: 繼續交易後未取鈔
    Given 主機回應為交易成功
    And 出鈔作業完成
    When 使用者選擇繼續交易
    And 使用者未取鈔
    Then 系統應列印 C101
    And 系統不應執行沖正
    And 系統應記錄 Pending log
    And 系統應結束本次交易流程
    And 系統應返回 Idle 狀態

  Scenario: 結束交易後未取卡
    Given 主機回應為交易成功
    And 出鈔作業完成
    When 使用者選擇結束交易
    And 使用者未取卡
    Then 系統應列印 C011
    And 系統應執行沖正
    And 系統應記錄 Pending log
    And 系統應返回 Idle 狀態

  Scenario: 疊鈔異常
    Given 主機回應為交易成功
    And 出鈔模組發生疊鈔異常
    When 系統執行出鈔
    Then 系統應列印 D101
    And 系統應執行沖正
    And 系統應記錄 Pending log

  Scenario: 出鈔異常
    Given 主機回應為交易成功
    And 出鈔模組發生出鈔異常
    When 系統執行出鈔
    Then 系統應列印 D111
    And 系統不應執行沖正
    And 系統應記錄 Pending log

  Scenario: ATM 端網路中斷
    Given 主機回應為交易成功
    When ATM 端網路中斷
    Then 系統應列印 H001
    And 系統應記錄 Pending log
    And 系統應返回 Idle 狀態

  Scenario: Server 端網路中斷
    Given 主機回應為交易成功
    When Server 端網路中斷
    Then 系統應列印 H003
    And 系統應記錄 Pending log
    And 系統應返回 Idle 狀態