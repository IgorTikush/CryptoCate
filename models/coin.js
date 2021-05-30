const mongoose = require('mongoose')

let Schema = mongoose.Schema;

let CoinSchema = new Schema(
    {
        name: {type: String, required: true},
        description: {type: String},
        category: {type: Schema.Types.ObjectId, ref: 'Category', required: true},
        image: {type: String, required: false, default:''}
    }
)

CoinSchema
    .virtual('url')
    .get(function() {
        return '/catalog/coin/' + this._id
    })

module.exports = mongoose.model('Coin', CoinSchema)