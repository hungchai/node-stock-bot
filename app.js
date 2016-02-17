var config = require('./config/config.json');
var NodeStockBot = require('./NodeStockBot');
var mongoose = require('mongoose');
var StockSchema = require('./stockSchema');
var stockSchema = new StockSchema(mongoose);
var co = require('co');

var defer = require('co-defer');

var symbol = '00700:HK';
var shares = '500';
var rulesJsPath = 'customRules_00700_EMA.js';

var mongoURI = config.mongoDbConn;
mongoose.connect(mongoURI);

mongoose.connection.on('open', function() {
    co(function*() {
        var nodeStockBot = new NodeStockBot(symbol, shares, rulesJsPath, stockSchema);
        nodeStockBot.on("finish", function*(result) {
            console.log(JSON.stringify(result));
            return true;
        });

        defer.setInterval(function*(){yield nodeStockBot.invoke()}, 2000)
        
    }).catch(function(err) {
        console.error(err);

    })
})