let mongoose = require('mongoose');
let Schema = mongoose.Schema;

const CommentsSchema = new Schema({
    text :{
        type: String,
        unique : false,
        required : true
	},
});

module.exports = Profile = mongoose.model('comment', CommentsSchema);