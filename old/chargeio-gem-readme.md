## Notes from speaking with James
  - At a minimum, we need to tell developers that they need an AffiniPay merchant account and secret key to run tests
  - As a footnote, we should also inform them that the tests expect a baseline merchant account configuration. We should enumerate these config items (get from James)
  - There's also a limit of 25 transactions on merchant test accounts in the VT. James is going to submit a ticket to either remove the limit or increase it to a ridiculously high level
  - James will likely remove a good portion of tests as a matter of course and change the code to emit an error if a developer attempts to run tests without configuring a secret key environment variable
