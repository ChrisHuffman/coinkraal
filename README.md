# CoinKraal
#### keep those cryptos in check




TODO
---

- Filter by coin on transactions page
- My holdings on summary page
- sell today bug

- Requery for coin summary chart is hours if low data
- Notification on Portfolio chart to say 'TAU data only available from x date'
- Filter on coin in transaction table
- Volume on summary chart
- why do we need to root api?
- why do we keep getting a 401?
- component cleanup 
    - imports that are unused
    - inject
    - @withrouter
    - @observer
- have sell and buy dots on the chart

- nodejs warnings
    npm WARN deprecated babel-preset-es2015@6.24.1: ߙ젠Thanks for using Babel: we recommend using babel-preset-env now: please read babeljs.io/env to update! 

Ideas
---
- Ranking
    1. Bitcoin 2009
    2. Moon
    3. Lambo
    4. Good HODL
    5. 
    6. B-Cash
    7. Heavy Bags
    8. Ian Shillina - All Star
    9. Total Sh*tcoin
    10. Biitconeeeeeeect! v2.0

Windows
---
C:\Windows\System32>taskkill /F /IM node.exe
SUCCESS: The process "node.exe" with PID 11008 has been terminated.

Deployment
---

gcloud app deploy -v beta-02 --promote --stop-previous-version

Links:
https://console.cloud.google.com/cloudshell/editor?project=coinkraal
https://cloud.google.com/sdk/gcloud/reference/app/deploy
https://cloud.google.com/appengine/docs/flexible/nodejs/configuring-your-app-with-app-yaml


Db Design
---

### user

|col name           |required   |type               |
|-------------------|-----------|-------------------|
|_id 	            |yes        |uuid               |
|firstName		    |yes        |string             |
|lastName           |yes        |string             |
|email   	        |yes        |string             |
|picture		    |yes        |string             |
|googleId	        |yes        |string             |
|dateCreated        |yes        |date               |
|settings	        |yes        |userSettings[]     |

### userSetting

|col name           |required   |type               |
|-------------------|-----------|-------------------|
|name 	            |yes        |string             |
|value		        |yes        |string             |


### transaction

|col name           |required   |type               |
|-------------------|-----------|-------------------|
|userId			    |yes        |uuid               |
|date               |yes        |date               |
|notes   	        |no         |string             |
|currency		    |yes        |string             |
|amount	            |yes        |float              |
|purchaseCurrency   |yes        |string             |
|purchaseUnitPrice	|yes        |float              |
|exchangeRates	    |yes        |exchangeRate[]     |
|sales			    |no         |transactionSale[]  |


### transactionSale

|col name           |required   |type               |
|-------------------|-----------|-------------------|
|date               |yes        |date               |
|amount   	        |yes        |float              |
|saleCurrency		|yes        |string             |
|saleUnitPrice	    |yes        |float              |
|notes              |no         |string             |
|exchangeRates	    |yes        |exchangeRate[]     |


### exchangeRate

|col name           |required   |type               |
|-------------------|-----------|-------------------|
|fromSymbol         |yes        |string             |
|rates   	        |yes        |exchangeRatesRate[]|


### exchangeRatesRate

|col name           |required   |type               |
|-------------------|-----------|-------------------|
|symbol             |yes        |string             |
|rate   	        |yes        |float              |



	
