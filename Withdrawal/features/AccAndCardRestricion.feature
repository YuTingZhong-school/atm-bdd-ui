Feature: 卡別與帳號規則
  為了依不同卡片與帳號條件提供正確提款流程
  系統應依卡別、帳號型態與限額規則處理提款交易

  Background:
    Given 使用者已插入有效金融卡
    And 使用者已完成密碼驗證
    And 系統已進入主選單
    And 系統主選單提供一般提款功能

  Scenario: 自行卡輸入超過十萬元
    Given 卡片類型為自行卡
    When 使用者於主選單選擇一般提款
    And 使用者輸入提款金額 100100
    Then 系統應顯示交易失敗訊息
    And 系統應顯示超過自行卡提款限額訊息
    And 系統應允許使用者重新輸入提款金額

  Scenario: 他行卡輸入超過兩萬元
    Given 卡片類型為他行卡
    When 使用者於主選單選擇一般提款
    And 使用者輸入提款金額 20100
    Then 系統應顯示交易失敗訊息
    And 系統應顯示超過他行卡提款限額訊息
    And 系統應允許使用者重新輸入提款金額

  Scenario Outline: 多帳號卡選擇帳號後以固定金額提款成功
    Given 卡片類型為多帳號卡
    And 主機回應為交易成功
    When 使用者於主選單選擇一般提款
    And 使用者選擇 <accountType>
    And 使用者選擇固定提款金額 1000
    Then 系統應顯示交易成功畫面
    And 系統應顯示提款金額 1000
    And 系統應完成吐鈔
    When 使用者取鈔
    And 使用者選擇結束交易
    Then 系統應結束本次交易流程
    And 系統應退卡
    When 使用者取卡
    Then 系統應返回 Idle 狀態

    Examples:
      | accountType |
      | 主帳號      |
      | 子帳號      |

  Scenario: 單帳號卡以固定金額提款成功
    Given 卡片類型為單帳號卡
    And 主機回應為交易成功
    When 使用者於主選單選擇一般提款
    And 使用者選擇固定提款金額 1000
    Then 系統應顯示交易成功畫面
    And 系統應顯示提款金額 1000
    And 系統應完成吐鈔
    When 使用者取鈔
    And 使用者選擇結束交易
    Then 系統應結束本次交易流程
    And 系統應退卡
    When 使用者取卡
    Then 系統應返回 Idle 狀態

  Scenario Outline: 多帳號卡選擇帳號後以自訂金額提款成功
    Given 卡片類型為多帳號卡
    And 主機回應為交易成功
    When 使用者於主選單選擇一般提款
    And 使用者選擇 <accountType>
    And 使用者輸入提款金額 1300
    Then 系統應顯示交易成功畫面
    And 系統應顯示提款金額 1300
    And 系統應完成吐鈔
    When 使用者取鈔
    And 使用者選擇結束交易
    Then 系統應結束本次交易流程
    And 系統應退卡
    When 使用者取卡
    Then 系統應返回 Idle 狀態

    Examples:
      | accountType |
      | 主帳號      |
      | 子帳號      |

  Scenario: 單帳號卡以自訂金額提款成功
    Given 卡片類型為單帳號卡
    And 主機回應為交易成功
    When 使用者於主選單選擇一般提款
    And 使用者輸入提款金額 1300
    Then 系統應顯示交易成功畫面
    And 系統應顯示提款金額 1300
    And 系統應完成吐鈔
    When 使用者取鈔
    And 使用者選擇結束交易
    Then 系統應結束本次交易流程
    And 系統應退卡
    When 使用者取卡
    Then 系統應返回 Idle 狀態