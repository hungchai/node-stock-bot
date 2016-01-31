module.exports = function (mongoose) {
    var Schema = mongoose.Schema;
    var stockProfileSchema = new Schema({
        "_id" : Schema.Types.ObjectId,
        "symbol" : String,
        "chiName": String,
        "engName": String,
        "lastupdate" : Date
    });
    stockProfileSchema.index({symbol:1});
    mongoose.model('StockProfile', stockProfileSchema, 'stockProfile');
};