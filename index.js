var config = require('./config/config.json');
var mongoose = require('mongoose');
var MongoClient = require('mongodb').MongoClient;
var co = require('co');
var NodeCache = require("node-cache");
var marketAPI = require('stock-market-api'),
    money18Api = marketAPI.money18Api,
    hkejApi = marketAPI.hkejApi;
var os = require('os');
var ipAddress = os.networkInterfaces();
var stockQuotesArrayCache = new NodeCache({
    stdTTL: 5760,
    checkperiod: 120
});
var StockSchema = require('./stockSchema');
var stockSchema = new StockSchema(mongoose);

try {
    var mongoURI = config.mongoDbConn;
}
catch (err) {
    var mongoURI = config.mongoDbConn;
}
var programLogModel = stockSchema.ProgramLog;
var nodestockbotLog = new programLogModel({appName: 'node-stock-bot', beginDateTime: new Date()});
//nodestockbotLog.ipAddress = ipAddress["eth0"][0]['address'];

var symbol = '00700:HK';
mongoose.connect(mongoURI);

var fillAndLoadStockQuotesArrayCache = function()
{
    return function(callback)
    {
        stockQuotesArrayCache.get( 'stockQuotesArray',  function ( err, value ){
            if(!err ){
                if(value == undefined){
                    var StockQuotesArrayModel = stockSchema.StockQuotesArray;
                    StockQuotesArrayModel.findBySymbol(symbol)(function callback(err,result){
                        stockQuotesArrayCache.set('stockQuotesArray',result);
                        callback(err,result)
                    });

                }else{
                    callback(err,value);
                }
            }else
            {
                callback(err,value);
            }
        });
    }

};

mongoose.connection.on("open", function(err) {
                co(function*() {
                    var stockQuotesArray = yield fillAndLoadStockQuotesArrayCache();

                    
                    var currentQuote = yield hkejApi.getstockTodayQuoteList(symbol);
                 

                }).then(function(result) {

                }).catch(function(err, result) {

                });

  
    
});
// var interval = setInterval(function(str1, str2) {
//     console.log(str1 + " " + str2);
// }, 1000, "Hello.", "How are you?");

//clearInterval(interval);


//  hkejApi.getstockTodayQuoteList('00700:HK')(function(err, result)
// {
//     console.log(result);
// }
// );
