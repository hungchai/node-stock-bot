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
var Emitter = require("co-emitter");

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
        
        Emitter(NodeStockBot.prototype);
        
    }
    * invoke() {
        var self = this;
       
        let stockQuotesArray =  yield self.fillAndLoadStockQuotesArrayCache();
        let currentQuote = yield hkejApi.getstockTodayQuoteList(self.symbol);
        let currentStockPortfolio = yield self.loadCurrentstockPortfolio();

        if (moment.tz(stockQuotesArray.dates[stockQuotesArray.dates.length-1], "Asia/Hong_Kong") <  moment.tz(currentQuote.date.substr(0, 10), "Asia/Hong_Kong"))
        {
            stockQuotesArray.closes.push(currentQuote.Close);
            stockQuotesArray.opens.push(currentQuote.Open);
            stockQuotesArray.lows.push(currentQuote.Low);
            stockQuotesArray.highs.push(currentQuote.High);
            stockQuotesArray.volumes.push(currentQuote.Volume);
            stockQuotesArray.turnovers.push(currentQuote.Turnover);
            stockQuotesArray.dates.push(moment.tz(currentQuote.date.substr(0, 10), "Asia/Hong_Kong"));
        }
        
        var customRulesScript= yield self.readRulesScriptFile();
        //console.log(JSON.stringify(stockQuotesArray.lows));
        var botRulesTester = new BotRulesTester(currentStockPortfolio == null? -1: currentStockPortfolio.entryPrice, 100, stockQuotesArray,customRulesScript);
       
        var botRulesTesterResult = yield botRulesTester.run();
        var entryPrice = yield self.emit('finish', botRulesTesterResult);

        //insert to stockProfile Schema
        if (botRulesTesterResult.action == 'buy')
        {
            //insert into StockPortfolio
            var StockPortfolioModel = self.stockSchema.StockPortfolio;
            var stockPortfolio = new StockPortfolioModel({
                'symbol': self.symbol,
                'bidDate': new Date(),
                'shares': self.shares,
                'entryPrice':entryPrice,
            });
             yield stockPortfolio.save();
            console.log("added to portfolio:"+JSON.stringify(stockPortfolio));
        }else if (botRulesTesterResult.action == 'sell')
        {
            var StockPortfolioModel = self.stockSchema.StockPortfolio;
            yield StockPortfolioModel.findOneAndRemove({'symbol':self.symbol});
        }

        //insert log
        if (botRulesTesterResult.action != '')
        {
            var StockTransactionHistModel = self.stockSchema.StockTransactionHist;
            var stockTransactionHist = new StockTransactionHistModel({
                'symbol': self.symbol,
                'date': new Date(),
                'shares': self.shares,
                'price': entryPrice,
                'action':botRulesTesterResult.action,
                'remarks': botRulesTesterResult
            });
            yield stockTransactionHist.save();
        }
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
    
    * loadCurrentstockPortfolio(){
                //load current portfolio
        let stockPortfolioModel = this.stockSchema.StockPortfolio;
        let currentstockPortfolio = yield stockPortfolioModel.findOne({'symbol':this.symbol});
        return currentstockPortfolio;
    }
}

module.exports = NodeStockBot;