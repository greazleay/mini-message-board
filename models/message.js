const mongoose = require('mongoose');
const { DateTime } = require('luxon')

const Schema = mongoose.Schema
const MessageSchema = new Schema(
    {
        user: {type: String, required: true, maxlength: 100},
        text: {type: String, required: true},
        date_added: {type: Date}
    }
);

// Virtual for message's url
MessageSchema.virtual('url').get(function () {
    return '/messages/message/' + this._id
});

MessageSchema.virtual('since_added').get(function () {
   const dt = DateTime.local(DateTime.now()).diff(DateTime.fromJSDate(this.date_added), 'minutes').toString();
   return Number(dt.slice(2, -1)).toFixed()
})

module.exports = mongoose.model('Message', MessageSchema)