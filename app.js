var config = require('./config/config.json');
var NodeStockBot = require('./NodeStockBot');
var mongoose = require('mongoose');
var StockSchema = require('./stockSchema');
var stockSchema = new StockSchema(mongoose);
var co = require('co');

var defer = require('co-defer');

var symbol = '00700:HK';
var shares = 100;
var rulesJsPath = 'customRules_00700_EMA.js';



if (process.argv[2] != null)
{
    symbol = process.argv[2] ;
    console.log(symbol);
}
if (process.argv[3] != null)
{
    shares = parseInt(process.argv[3]) ;
    console.log(shares);
}
if (process.argv[4] != null)
{
    rulesJsPath = process.argv[4] ;
    console.log(rulesJsPath);
}


var mongoURI = config.mongoDbConn;
mongoose.connect(mongoURI);

mongoose.connection.on('open', function() {
    var nodeStockBot = new NodeStockBot(symbol, shares, rulesJsPath, stockSchema);
    nodeStockBot.on("finish", function*(result) {
        console.log('currenttime' + (new Date()).toISOString() + ' currentprice:' +result.close);
        if (result.action == "buy")
        {
            console.log('>>>'+result.action);
            return result.close;
        }else if (result.action == "sell")
        {
            console.log('>>>'+result.action);
            return result.close;
        }
         return result.close;
    });
    co(function*() {
    
    //yield nodeStockBot.invoke();
        defer.setInterval(function*(){
            yield nodeStockBot.invoke();
        }, 50000);
        
    }).catch(function(err) {
        console.error(err);
    })
})