Feature: /api/v1/balance/{address}
  As a user I'd like to see balance of some addresses

  Scenario: Invalid address
    Given server is running
    And user is authorized
    When request GET to /api/v1/balance/<Address> without body
    Then response status: 400
    And response body: <ResponseBody>

    Examples:
      | Address                                                            | ResponseBody                                                                 |
      | invalid                                                            | {"status":400,"code":"validation","message":"Provided address is not valid"} |
      | 0x9dc6220df274bec6c3683b2cf529181e303b10806fdf868446316c8d4d03466P | {"status":400,"code":"validation","message":"Provided address is not valid"} |
      | 9dc6220df274bec6c3683b2cf529181e303b10806fdf868446316c8d4d03466e   | {"status":400,"code":"validation","message":"Provided address is not valid"} |
      | 0x1a965d9660674aa927722e0738a825bd58c8356p                         | {"status":400,"code":"validation","message":"Provided address is not valid"} |

  Scenario: Unknown address
    Given server is running
    And user is authorized
    When request GET to /api/v1/balance/<Address> without body
    Then response status: 404
    And response body: <ResponseBody>

    Examples:
      | Address                                    | ResponseBody                                                   |
      | 0x1a965d9660674aa927722e0738a825bd58c83562 | {"status":404,"code":"not-found","message":"Entity not found"} |


  Scenario: get info of a single token
    Given server is running
    And user is authorized
    When request GET to /api/v1/balance/<Address> without body
    Then response status: 200
    And standard response body
    And key in data is called "addressBalance" with a type of "object"
    And element has property "hash": {"type": "string"}
    And element has property "blockNumber": {"type": "string"}
    And element has property "sender": {"type": "string"}
    And element has property "senderBalance": {"type": "string"}
    And element has property "recipient": {"type": "string"}
    And element has property "recipientBalance": {"type": "string"}


    Examples:
      | Address            |
      | {recipientAddress} |
      | {senderAddress}    |