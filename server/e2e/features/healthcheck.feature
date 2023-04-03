Feature: Healthcheck
    As a user or a platform I'd like to know whether the API is working right now

    Scenario: Check liveness
        Given server is running
        And user is not authorized
        When request GET to /healthcheck without body
        Then response status: 200
        And response body: {"uptime": "NUMBER", "healthy": true}
