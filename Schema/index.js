var stockProfileSchema = require('./stockProfileSchema');
var stockDayQuoteSchema = require('./stockDayQuoteSchema');
var stockQuotesArray = require("./stockQuotesArray");
var programLogSchema = require("./programLog");

function()
{
    stockProfileSchema();
    stockDayQuoteSchema();
     stockQuotesArray();
     programLogSchema();
}

module.exports.stockProfileSchema = stockProfileSchema();
module.exports.stockDayQuoteSchema = stockDayQuoteSchema();
module.exports.stockQuotesArray = stockQuotesArray();
module.exports.programLogSchema = programLogSchema();