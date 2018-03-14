# CoinKraal
### keep those cryptos in check

gcloud
---

gcloud app deploy -v alpha-04 --promote --stop-previous-version

Links:
https://console.cloud.google.com/cloudshell/editor?project=coinkraal
https://cloud.google.com/sdk/gcloud/reference/app/deploy
https://cloud.google.com/appengine/docs/flexible/nodejs/configuring-your-app-with-app-yaml


TODO
---

- Sale dates must be after transaction date
- loader untill at least currencies are loaded
- Common form functions - sell
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


"deploy": "gcloud app deploy"


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