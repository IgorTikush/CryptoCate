const mongoose = require('mongoose')

let Schema = mongoose.Schema

let CategorySchema = new Schema({
    name: {type: String, required: true},
    description: {type: String},
    image: {type: String, required: false, default: ''}
})

CategorySchema
    .virtual('url')
    .get(function() {
        return '/catalog/category/' + this._id
    })

module.exports = mongoose.model('Category', CategorySchema)