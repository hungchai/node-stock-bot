var stockProfileSchema = require('./stockProfileSchema');
var stockDayQuoteSchema = require('./stockDayQuoteSchema');
var stockQuotesArraySchema= require("./stockQuotesArray");
var programLogSchema = require("./programLog");

function stockSchema(mongoose)
{
    this.mongoose = mongoose;
    stockProfileSchema(mongoose);
    stockDayQuoteSchema(mongoose);
    stockQuotesArraySchema(mongoose);
    programLogSchema(mongoose);

    this.ProgramLog = mongoose.model('ProgramLog');
    this.StockProfile = mongoose.model('StockProfile');
    this.StockDayQuote = mongoose.model('StockDayQuote');
    this.StockQuotesArray = mongoose.model('StockQuotesArray');

}

module.exports = stockSchema;