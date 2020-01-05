# binanceQA
## QA Automation Assignment

## Table of contents
* [General info](#general-info)
* [Technologies](#technologies)
* [Setup](#setup)
* [Running the tests](#running the tests)
* [To Do](#to do)
* [Author](#author)

## General info
This assignment comprises end-to-end test script of binance.com. It covers below three scenarios:
a) Verify hompage data is loading properly.
b) Verify currency coversion formula is working properly.
c) Verify data is loaded and there is consistent stream of data.
	
## Technologies
Project is created with:
* npm version: 6.12.1
* cypress version: 3.3.0
	
## Setup
To run this project, install it locally using npm: 

```
$ cd ../binanceQA
$ npm install cypress --save-dev
$ npm i -D @lensesio/cypress-websocket-testing
```

## Running the tests
```
$ npx cypress open
```

## To Do
Image based testing (Screenshot diffing)

## Author
Praveen Jaiswal
