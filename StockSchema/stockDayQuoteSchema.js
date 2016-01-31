module.exports = function (mongoose) {
    var Schema = mongoose.Schema;
    var stockDayQuoteSchema = new Schema({
        'symbol': String,
        'date': Date,
        'high': Number,
        'low': Number,
        'open': Number,
        'close': Number,
        'turnover': Number

    });
    
    stockDayQuoteSchema.index({ symbol: 1, date: -1}); // schema level, ensure index
    mongoose.model('StockDayQuote', stockDayQuoteSchema, 'stockDayQuote');
};