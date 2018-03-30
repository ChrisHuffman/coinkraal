# CoinKraal
### keep those cryptos in check

gcloud
---

gcloud app deploy -v beta-01 --promote --stop-previous-version

Links:
https://console.cloud.google.com/cloudshell/editor?project=coinkraal
https://cloud.google.com/sdk/gcloud/reference/app/deploy
https://cloud.google.com/appengine/docs/flexible/nodejs/configuring-your-app-with-app-yaml


TODO
---
- CommonStore to use BigNumber
- Clear add transaction modals after save
- Volumn on summary chart
- Notification on Portfolio chart to say 'TAU data only available from x date'
- IOTA Price not loading?
- Sale dates must be after transaction date
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
- Donate to Bitconnect get rick rolled
- setting show random Carlos Matos quotes
- TCs no Carlos
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


Db Design
---
### transaction

|col name           |required   |
|-------------------|-----------|
|_id 	            |yes        |
|userId			    |yes        |
|type(buy/sell)     |yes        |
|in_currency   	    |no         |
|in_amount		    |no         |
|in_unitPriceUSD	|no         |
|out_currency   	|no         |
|out_amount		    |no         |
|out_unitPriceUSD	|no         |
|date			    |no         |
|exchange		    |no         |
|notes		        |no         |
	

test
test1