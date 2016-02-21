module.exports = function (mongoose) {
    var Schema = mongoose.Schema;
    var stockTransactionHistSchema = new Schema({
        'symbol': String,
        'date': Date,
        'shares': Number,
        'price':Number,
        'action':String,
        'remarks': {}
    });
    
    stockTransactionHistSchema.index({ symbol: 1, date: 1}); // schema level, ensure index
    stockTransactionHistSchema.index({ date: -1}); // schema level, ensure index

    mongoose.model('StockTransactionHist', stockTransactionHistSchema, 'stockTransactionHist');
};