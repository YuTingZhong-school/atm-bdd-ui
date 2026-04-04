Feature: 快速提款
  為了讓使用者快速完成常用金額提款
  系統應於主選單提供快速提款功能
  並依交易結果顯示正確後續流程

  Background:
    Given 使用者已插入有效金融卡
    And 使用者已完成密碼驗證
    And 系統已進入主選單

  Scenario Outline: 主選單快速提款成功
    Given 系統主選單提供快速提款功能
    And 主機回應為交易成功
    When 使用者於主選單選擇快速提款金額 <amount>
    Then 系統應顯示交易成功畫面
    And 顯示提款金額 <amount>
    And 系統應顯示繼續交易選項
    And 顯示結束交易選項

    Examples:
      | amount |
      | 1000   |
      | 2000   |
      | 5000   |

  Scenario: 快速提款成功後繼續交易
    Given 系統主選單提供快速提款功能
    And 主機回應為交易成功
    When 使用者於主選單選擇快速提款金額 1000
    Then 系統應顯示交易成功畫面
    When 使用者選擇繼續交易
    And 系統應完成吐鈔
    When 使用者取鈔
    Then 系統應重新讀卡並返回輸入密碼

  Scenario: 快速提款成功後結束交易
    Given 系統主選單提供快速提款功能
    And 主機回應為交易成功
    When 使用者於主選單選擇快速提款金額 1000
    Then 系統應顯示交易成功畫面
    And 系統應完成吐鈔
    When 使用者取鈔
    And 使用者選擇結束交易
    Then 系統應結束本次交易流程
    And 系統應退卡
    When 使用者取卡
    Then 系統應返回 Idle 狀態

  Scenario: 主選單快速提款交易失敗(交易逾時)
    Given 系統主選單提供快速提款功能
    And 主機回應錯誤碼為 H003
    When 使用者於主選單選擇快速提款金額 1000
    Then 系統應顯示交易失敗訊息
    And 系統應顯示交易逾時訊息
    And 系統應退卡
    When 使用者取卡
    Then 系統應返回 Idle 狀態

  Scenario: 自行卡快速提款超過當日限額
    Given 系統主選單提供快速提款功能
    And 主機回應錯誤碼為 3327
    And 卡片類型為自行卡
    When 使用者於主選單選擇快速提款金額 1000
    Then 系統應顯示交易失敗訊息
    And 系統應顯示超過當日限額訊息
    And 系統應退卡
    When 使用者取卡
    Then 系統應返回 Idle 狀態

  Scenario: 他行卡快速提款超過當日限額
    Given 系統主選單提供快速提款功能
    And 主機回應錯誤碼為 4202
    And 卡片類型為他行卡
    When 使用者於主選單選擇快速提款金額 1000
    Then 系統應顯示交易失敗訊息
    And 系統應顯示超過當日限額訊息
    And 系統應退卡
    When 使用者取卡
    Then 系統應返回 Idle 狀態

  Scenario: 不提供提款服務時隱藏快速提款與提款按鈕
    Given 系統目前不提供提款服務
    When 使用者進入主選單
    Then 系統不應顯示快速提款按鈕
    And 系統不應顯示提款按鈕
    And 系統應退卡
    When 使用者取卡
    Then 系統應返回 Idle 狀態

  Scenario: 自快速提款頁面取消交易
    Given 系統主選單提供快速提款功能
    And 主機回應為交易成功
    When 使用者進入主選單
    And 使用者取消交易
    Then 系統應結束本次交易流程
    And 系統應退卡
    When 使用者取卡
    Then 系統應返回 Idle 狀態