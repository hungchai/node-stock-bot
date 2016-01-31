module.exports = function (mongoose) {
    var Schema = mongoose.Schema;
    var stockQuotesArraySchema = new Schema({
        "_id" : String,
        opens: [Number],
        closes: [Number],
        highs: [Number],
        lows: [Number],
        volumes: [Number],
        turnovers: [Number],
        dates: [Date]
    });

    stockQuotesArraySchema.statics.findBySymbol = function(symbol){
        return function(callback){
            mongoose.model('StockQuotesArray').findOne({"_id":symbol}).exec(callback);
        }
    };
    mongoose.model('StockQuotesArray', stockQuotesArraySchema, 'stockQuotesArray');
};