module.exports = function (mongoose) {
    var Schema = mongoose.Schema;
    var stockPortfolioSchema = new Schema({
        'symbol': String,
        'bidDate': Date,
        'shares': Number,
        'entryPrice':Number,
    });
    
    stockPortfolioSchema.index({ symbol: 1, entryPrice: 1}); // schema level, ensure index
    mongoose.model('StockPortfolio', stockPortfolioSchema, 'stockPortfolio');
};