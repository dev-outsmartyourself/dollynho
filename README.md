Dollynho, seu amiguinho
=========



## Installation

  `npm install dollynho`

## Usage

  ```js
  import dollynho from 'dollynho'

  const dollynhoMiddleware = dollynho({
    webhookUrl: 'WEBHOOK_URL',
    shouldSendToSlack: (err) => err.statusCode === 500
  })

  //  At the end of your middleware chain
  app.use(dollynhoMiddleware())
  ```

  You can pass additional config to dollynho to make it even better
  ```
  String channel,
  String iconUrl,
  String username,
  Function getText,
  ```

  The function getText will receive this object on it's first param:
  ```
  {
    packageName,
    platform,
    env = 'development',
    ip,
    err,
  }
  ```

  So you can build your own custom message :)

## Tests

  `npm test`
