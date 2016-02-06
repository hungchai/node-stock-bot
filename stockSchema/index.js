var stockProfileSchema = require('./stockProfileSchema');
var stockDayQuoteSchema = require('./stockDayQuoteSchema');
var stockQuotesArraySchema= require("./stockQuotesArraySchema");
var programLogSchema = require("./programLogSchema");
var stockTransactionHistSchema = require("./stockTransactionHistSchema");
var stockPortfolioSchema = require("./stockPortfolioSchema");

function stockSchema(mongoose)
{
    this.constructor.prototype.mongoose = mongoose;
    stockProfileSchema(mongoose);
    stockDayQuoteSchema(mongoose);
    stockQuotesArraySchema(mongoose);
    programLogSchema(mongoose);
    stockPortfolioSchema(mongoose);
    stockTransactionHistSchema(mongoose);
    
    this.ProgramLog = mongoose.model('ProgramLog');
    this.StockProfile = mongoose.model('StockProfile');
    this.StockDayQuote = mongoose.model('StockDayQuote');
    this.StockQuotesArray = mongoose.model('StockQuotesArray');
    this.StockPortfolio = mongoose.model('StockPortfolio');
    this.StockTransactionHist = mongoose.model('StockTransactionHist');
}

module.exports = stockSchema;