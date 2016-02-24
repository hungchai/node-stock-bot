'use strict'
var talib = require('co-talib');
var co = require('co');
var thunkify = require('thunkify');
var util = require('util');
var _ = require("underscore");
var moment = require('moment-timezone');
var Emitter = require("co-emitter");
var util         = require("util");
var EventEmitter = require("events").EventEmitter;

class BotRulesTester {
    constructor(entryPrice, shares, stockQuotesArray, customRulesScript) {
        this.stockQuotesArray = stockQuotesArray;
        this.customRulesScript = customRulesScript;
        this.holdprice = (entryPrice == null) ? -1 : entryPrice  ;
        this.shares = shares;
        //console.log("TALib Version: " + talib.version);
    }

    run() {
        //Reserved variable names
        var closes = this.stockQuotesArray.closes;
        var highs = this.stockQuotesArray.highs;
        var lows = this.stockQuotesArray.lows;
        var opens = this.stockQuotesArray.opens;
        var volumes = this.stockQuotesArray.volumes;
        var turnovers = this.stockQuotesArray.turnovers;
        var dates = this.stockQuotesArray.dates;
        var holdprice = this.holdprice;
        //var holdprice = -1;
        var quotelength = closes.length;
        var buyrules = [];
        var sellrules = [];
        var customHeaders = [];
        var self = this;
        let customRulesScript = this.customRulesScript;
        return function (callback) {
            co(function*() {
                //importance
                //eval(customRulesScript);
                var myFunction = new Function("talib", "co", "closes", "highs", "lows", "opens", "volumes", "turnovers", "dates", "quotelength", "buyrules", "sellrules", "customHeaders",'return function(callback) {co(function*() {'
                    + customRulesScript + ' ;return "1"})'
                    + '.then(function(val) {callback(null, val)})'
                    + '.catch(function(err, result) {console.log("err: " + err + ", result: " + result);callback(err, result);});}');
                //importance

                var customRulesScriptReady = yield myFunction(talib, co, closes, highs, lows, opens, volumes, turnovers, dates, quotelength, buyrules, sellrules, customHeaders);

                var idx = quotelength - 1;
                    var dayResult = {};
                    dayResult.date = moment(dates[idx].toISOString()).tz("Asia/Hong_Kong").format('YYYY-MM-DD');
                    dayResult.close = closes[idx];
                    dayResult.high = highs[idx];
                    dayResult.low = lows[idx];
                    dayResult.open = opens[idx];
                    dayResult.volume = volumes[idx];
                    dayResult.turnover = turnovers[idx];
                    dayResult.holdprice = holdprice;
                    dayResult.action="";
                    dayResult.profit = 0;

                    for (var buyruleName in buyrules) {
                        dayResult[buyruleName] = false;
                    }
                    for (var sellruleName in sellrules) {
                        dayResult[sellruleName] = false;
                    }
                    for (var customHeader in customHeaders) {
                        dayResult[customHeader] = customHeaders[customHeader](idx);
                    }
                    
                    for (var buyruleName in buyrules) {
                        if (holdprice < 0 && buyrules[buyruleName](idx, holdprice)) {
                            holdprice = lows[idx]
                            dayResult.holdprice = holdprice;
                            dayResult[buyruleName] = true;
                            dayResult.action = "buy";
                        }
                        else if (buyrules[buyruleName](idx, holdprice)) {
                            dayResult[buyruleName] = true;
                            dayResult.action = "";
                        }
                    }
                    ;
                    for (var sellruleName in sellrules) {
                        if (holdprice > 0 && sellrules[sellruleName](idx, holdprice)) {
                            dayResult.profit = closes[idx] - holdprice;
                            dayResult[sellruleName] = true;
                            dayResult.action = "sell";
                            dayResult.holdprice = holdprice;
                            break;
                        }
                    }
                    ;
                return dayResult;
            })
                .then(function (backtestResult) {
                    callback(null, backtestResult);
                })
                .catch(function (err, result) {
                    console.log('err: ' + err + ', result: ' + result);
                    callback(err, result);
                });

        }
    }
}
;

module.exports = BotRulesTester;