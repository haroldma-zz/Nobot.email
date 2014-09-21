var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var CounterSchema = new Schema({
  _id: String,
  next: Number
});

CounterSchema.statics.findAndModify = function (query, sort, doc, options, callback) {
  return this.collection.findAndModify(query, sort, doc, options, callback);
};

CounterSchema.statics.increment = function (counter, callback) {
  return this.collection.findAndModify({ _id: counter }, [], { $inc: { next: 1 } }, callback);
};

module.exports = mongoose.model('Counter', CounterSchema);
