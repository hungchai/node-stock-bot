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
var moment = require('moment-timezone');
var BotRulesTester = require('./botRulesTester');


class NodeStockBot
{
    constructor(symbol, shares, rulesJsPath, stockSchema){
        this.symbol = symbol;
        this.shares = shares;
        this.rulesJsPath = rulesJsPath;
        this.stockSchema = stockSchema;
        this.stockQuotesArrayCache  = new NodeCache({
            stdTTL: 5760,
            checkperiod: 3600
        });
        
    }
    * invoke() {
        var self = this;
       
        let stockQuotesArray =  yield self.fillAndLoadStockQuotesArrayCache();
        let currentQuote = yield hkejApi.getstockTodayQuoteList(self.symbol);
        let currentTime = moment(Date.now()).tz("Asia/Hong_Kong").toDate();
        if (stockQuotesArray.dates[stockQuotesArray.length] == currentTime)
        {
            
        }
        stockQuotesArray.opens.push(currentQuote.Open);
        stockQuotesArray.lows.push(currentQuote.Low);
        stockQuotesArray.highs.push(currentQuote.High);
        stockQuotesArray.volumes.push(currentQuote.Volume);
        stockQuotesArray.turnovers.push(currentQuote.Turnover);
        stockQuotesArray.dates.push(currentQuote.Date);
          
        yield self.readRulesScriptFile();
        console.log(JSON.stringify(stockQuotesArray.lows));

        return stockQuotesArray;
    }
    
    * readRulesScriptFile()
    {
        return yield coFs.readFile(this.rulesJsPath, 'utf8');
    }
    
    fillAndLoadStockQuotesArrayCache () {
        var self = this;
    return function(callback) {
        self.stockQuotesArrayCache.get('stockQuotesArray', function(err, value) {
            if (!err) {
                if (value == undefined) {
                    var StockQuotesArrayModel = self.stockSchema.StockQuotesArray;
                    StockQuotesArrayModel.findBySymbol(self.symbol)(function(err, result) {
                        self.stockQuotesArrayCache.set('stockQuotesArray', result,
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
}

module.exports = NodeStockBot;