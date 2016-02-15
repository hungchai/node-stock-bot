'use strict'
var config = require('./config/config.json');
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var co = require('co');
var coFs = require('co-fs');
var NodeCache = require("node-cache");
var marketAPI = require('stock-market-api'),
    money18Api = marketAPI.money18Api,
    hkejApi = marketAPI.hkejApi;
var os = require('os');
var StockSchema = require('./stockSchema');
var stockSchema = new StockSchema(mongoose);
var stockQuotesArrayCache = new NodeCache({
    stdTTL: 5760,
    checkperiod: 120
});
var BotRulesTester = require('./botRulesTester');


var ipAddress = os.networkInterfaces();

try {
    var mongoURI = config.mongoDbConn;
}
catch (err) {
    var mongoURI = config.mongoDbConn;
}
var programLogModel = stockSchema.ProgramLog;
var nodestockbotLog = new programLogModel({
    appName: 'node-stock-bot',
    beginDateTime: new Date()
});
//nodestockbotLog.ipAddress = ipAddress["eth0"][0]['address'];

var symbol = '00700:HK';
var rulesJsPath = 'customRules_00700_EMA.js';
mongoose.connect(mongoURI);

var fillAndLoadStockQuotesArrayCache = function() {
    return function(callback) {
        stockQuotesArrayCache.get('stockQuotesArray', function(err, value) {
            if (!err) {
                if (value == undefined) {
                    var StockQuotesArrayModel = stockSchema.StockQuotesArray;
                    StockQuotesArrayModel.findBySymbol(symbol)(function(err, result) {
                        stockQuotesArrayCache.set('stockQuotesArray', result,
                            function(err, success) {
                                if (!err && success) {
                                    callback(err, result)
                                }
                            }
                        );

                    });

                }
                else {
                    callback(err, value);
                }
            }
            else {
                callback(err, value);
            }
        });
    }

};

mongoose.connection.on("open", function(err) {
    co(function*() {
        let stockQuotesArray = yield fillAndLoadStockQuotesArrayCache();
        let customRulesScript = yield coFs.readFile(rulesJsPath, 'utf8');

        //load current portfolio
        let stockPortfolioModel = stockSchema.StockPortfolio;
        let currentstockPortfolio = yield stockPortfolioModel.findOne({'symbol':symbol});

        if (process.env.NODE_ENV === "development")
        {
            // console.log(JSON.stringify(stockQuotesArray));
            console.log(JSON.stringify(currentstockPortfolio));
        }
        let currentQuote = yield hkejApi.getstockTodayQuoteList(symbol);

        if (process.env.NODE_ENV === "development"){
            console.log(JSON.stringify(currentQuote));}

        stockQuotesArray.opens.push(currentQuote.Open);
        stockQuotesArray.lows.push(currentQuote.Low);
        stockQuotesArray.highs.push(currentQuote.High);
        stockQuotesArray.volumes.push(currentQuote.Volume);
        stockQuotesArray.turnovers.push(currentQuote.Turnover);
        stockQuotesArray.dates.push(currentQuote.Date);
        console.log(JSON.stringify(stockQuotesArray.lows));


        var botRulesTester = new BotRulesTester(-1, 100, stockQuotesArray,customRulesScript);
       
        botRulesTester.on('finish', function *(message) {
          console.log("I say: " + message);
          return true;
        });
        var result = yield botRulesTester.run();
        return result;
        
    }).then(function(result) {
        console.log(JSON.stringify(result));
        process.exit(1);
    }).catch(function(err) {
        console.log(err);
        process.exit(0);
    });
});


