# CoinKraal
### keep those cryptos in check

TODO
---
- set user id when add transaction
- validate the google client id
- why do we keep getting a 401?
- add Nav header
- validation on the add form

- nodejs warnings
    npm WARN deprecated guid@0.0.12: Please use node-uuid instead. It is much better.
    npm WARN deprecated babel-preset-es2015@6.24.1: ߙ젠Thanks for using Babel: we recommend using babel-preset-env now: please read babeljs.io/env to update! 


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