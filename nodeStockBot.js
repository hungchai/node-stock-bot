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

class NodeStockBot
{
    constructor(){
        
    }
    
}

exports.module = NodeStockBot;