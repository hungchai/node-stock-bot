module.exports = function (mongoose) {
    var Schema = mongoose.Schema;
    var programLogSchema = new Schema({
        '_id' :  {type: Schema.Types.ObjectId, default: function () { return new mongoose.Types.ObjectId} },
        'appName': String,
        'ipAddress': String,
        'enterDate': {type:Date, default: Date.now()},
        'status': String,
        'remark': String,
        'beginDateTime': Date,
        'endDateTime': Date
    });
    
    programLogSchema.index({ 'appName': 1, 'enterDate': -1, 'status':1}); // schema level, ensure index
    programLogSchema.index({ 'enterDate': -1}, {sparse: true}); // schema level, ensure index
    
    mongoose.model('ProgramLog', programLogSchema, 'programLog');
};