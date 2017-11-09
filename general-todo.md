## Coding for Writers
-   Replace if/else if statements with switch statements in TOC to make code more readable
-   Write a callback function (e.g., function makes call to server; callback function is called when the server response is received)

## Merge subscription branches in this order:
  - TP-129
    - TP-130
      - TP-131
        - TP-133
          - TP-134             

## Scrum
Y: nada
T: nada
B: deploy doc site release `2017-Q2-5` to production (DEVOPS-276)

## API Tools
So for what reason are most of you using APIs or finding the need to document said APIs? For Swaggerizing API endpoints I often will read the API documentation however scarce it may be. Then test the endpoints in Postman saving my successful API calls to a Postman collection. From the Postman collection you can generate a link and use APImatic to transform the collection in to Swagger you can use in your pages. You still have to fill out the descriptions and so on but it saves quite a bit of time if you aren't in for typing up a long JSON or YAML swagger def. (edited)

Great tool: [https://apimatic.io](https://apimatic.io)

## Sample app (Q2 goal)
Extend the /payment-page project to accommodate an "ecommerce" flow:
-   Register/Sign up
-   Check out (amount should be immutable)

## jekyll
Run bulds with --profile to measure build times with different parsers (kramdown, red carpet)

Keep in mind that github pages doesn't support redcarpet)
