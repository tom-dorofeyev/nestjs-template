Feature: Service health
  As a service consumer
  I want to check whether the API is available
  So that I can safely send it requests

  Scenario: The health endpoint reports that the service is available
    When I request the health endpoint
    Then the response status is 200
    And the response body is
      """
      {"status":200}
      """
