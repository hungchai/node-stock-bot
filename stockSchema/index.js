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
    
    this.constructor.prototype.ProgramLog = mongoose.model('ProgramLog');
    this.constructor.prototype.StockProfile = mongoose.model('StockProfile');
    this.constructor.prototype.StockDayQuote = mongoose.model('StockDayQuote');
    this.constructor.prototype.StockQuotesArray = mongoose.model('StockQuotesArray');
    this.constructor.prototype.StockPortfolio = mongoose.model('StockPortfolio');
    this.constructor.prototype.StockTransactionHist = mongoose.model('StockTransactionHist');
}

module.exports = stockSchema;