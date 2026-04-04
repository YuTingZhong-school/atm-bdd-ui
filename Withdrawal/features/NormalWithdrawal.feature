Feature: 一般提款
  為了讓持卡人可依需求選擇固定金額或自訂金額提款
  系統應提供一般提款流程
  並驗證提款金額、鈔券條件與交易結果

  Background:
    Given 使用者已插入有效金融卡
    And 使用者已完成密碼驗證
    And 系統已進入主選單

  Scenario Outline: 主選單一般提款選擇固定金額成功
    Given 系統主選單提供一般提款功能
    And 主機回應為交易成功
    When 使用者於主選單選擇一般提款
    And 使用者選擇固定提款金額 <amount>
    Then 系統應顯示交易成功畫面
    And 系統應顯示提款金額 <amount>
    And 系統應顯示繼續交易選項
    And 系統應顯示結束交易選項

    Examples:
      | amount |
      | 1000   |
      | 3000   |
      | 5000   |
      | 20000  |

  Scenario Outline: 一般提款錯誤輸入達三次後終止交易
    Given 系統主選單提供一般提款功能
    When 使用者於主選單選擇一般提款

    When 使用者第1次輸入錯誤金額 <amount>
    Then 系統應顯示錯誤訊息
    And 系統應允許使用者重新輸入提款金額

    When 使用者第2次輸入錯誤金額 <amount>
    Then 系統應顯示錯誤訊息
    And 系統應允許使用者重新輸入提款金額

    When 使用者第3次輸入錯誤金額 <amount>
    Then 系統應結束本次交易流程
    And 系統應退卡

    Examples:
      | amount | precondition          |
      | 1250   | ATM 鈔券狀態正常       |
      | 1300   | ATM 百元鈔券庫存不足   |

  Scenario: 一般提款輸入非百元倍數失敗
    Given 系統主選單提供一般提款功能
    When 使用者於主選單選擇一般提款
    And 使用者輸入提款金額 1250
    Then 系統應顯示交易失敗訊息
    And 系統應顯示非百元倍數錯誤訊息
    And 系統應允許使用者重新輸入提款金額

  Scenario: 一般提款輸入百元倍數成功
    Given 系統主選單提供一般提款功能
    And 主機回應為交易成功
    When 使用者於主選單選擇一般提款
    And 使用者輸入提款金額 1300
    Then 系統應顯示交易成功畫面
    And 系統應顯示提款金額 1300
    And 系統應依原鈔種配置並吐鈔
    When 使用者取鈔
    And 使用者選擇結束交易
    Then 系統應結束本次交易流程
    And 系統應退卡
    When 使用者取卡
    Then 系統應返回 Idle 狀態

  Scenario: 一般提款輸入百元倍數但缺百元鈔券
    Given 系統主選單提供一般提款功能
    And ATM 百元鈔券庫存不足
    When 使用者於主選單選擇一般提款
    And 使用者輸入提款金額 1300
    Then 系統應顯示交易失敗訊息
    And 系統應顯示鈔券不足訊息
    And 系統應允許使用者重新輸入提款金額

  Scenario: 一般提款輸入千元倍數並選擇換鈔
    Given 系統主選單提供一般提款功能
    And 主機回應為交易成功
    When 使用者於主選單選擇一般提款
    And 使用者輸入提款金額 1000
    And 使用者選擇換鈔
    Then 系統應顯示交易成功畫面
    And 系統應依原鈔種配置並吐鈔
    When 使用者取鈔
    And 使用者選擇結束交易
    Then 系統應結束本次交易流程
    And 系統應退卡
    When 使用者取卡
    Then 系統應返回 Idle 狀態

  Scenario: 一般提款輸入千元倍數並選擇不換鈔
    Given 系統主選單提供一般提款功能
    And 主機回應為交易成功
    When 使用者於主選單選擇一般提款
    And 使用者輸入提款金額 1000
    And 使用者選擇不換鈔
    Then 系統應顯示交易成功畫面
    And 系統應依原鈔種配置並吐鈔
    When 使用者取鈔
    And 使用者選擇結束交易
    Then 系統應結束本次交易流程
    And 系統應退卡
    When 使用者取卡
    Then 系統應返回 Idle 狀態