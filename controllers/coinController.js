const Coin = require('../models/coin');

const async = require('async');
const { body,validationResult } = require('express-validator');
const Category = require('../models/category');

exports.coin_list = function(req, res, next) {
    Coin.find()
        .exec(function(err, coins){
            if(err){return next(err)}
            res.render('coins', {title: 'All coins', coins: coins})
        })
}
exports.coin_create_get = function(req,res, next) {
    Category.find()
        .exec(function(err, categories){
            if(err){return next(err)}
            res.render('coin_form', {title:'Create coin', categories: categories, action:'Create'})
        })
}

exports.coin_create_post = [
    
    //Validate and sanitize all fields
    body('name', 'Name is required').trim().isLength({min: 3}).escape(),
    body('description', 'Description is required').trim().isLength({min: 10}).escape(),
    body('image').trim().escape(),
    //After validation continue
    (req, res, next) => {
        const errors = validationResult(req)
        let coin = new Coin({
            name: req.body.name,
            description: req.body.description,
            image: req.body.image,
            category: req.body.category
        })
        if(!errors.isEmpty()) {
            //there are errors - render create form with values
            async.parallel({
                categories: function(callback){
                    Category.find().exec(callback)
                }
            }, function(err, results){
                if(err){return next(err)}

                console.log(errors)
                res.render('coin_form', {title:'Create coin', categories: results.categories, action:'Create', coin: coin})
                return
            })
        } else {
            //There are no errors
            coin.save(function(err){
                if(err){return next(err)}
                res.redirect('/')
            })
        }

    }
    
]

exports.coin_update_get = function(req,res, next) {
    async.parallel({
        categories: function(callback){
            Category.find().exec(callback)
        },
        coin: function(callback){
            Coin.findById(req.params.id).exec(callback)
        }
    }, function(err, results){
        if(err){return next(err)}
        
        res.render('coin_form', {title:'Update coin', categories: results.categories, action:'Update', coin: results.coin})
        return
    })
}

exports.coin_update_post = [ 
       //Validate and sanitize all fields
       body('name', 'Name is required').trim().isLength({min: 3}).escape(),
       body('description', 'Description is required').trim().isLength({min: 10}).escape(),
       body('image').trim(),
       //After validation continue
       (req, res, next) => {
           const errors = validationResult(req)
           let coin = new Coin({
               name: req.body.name,
               description: req.body.description,
               category: req.body.category,
               image: req.body.image,
               _id: req.params.id
           })
           if(!errors.isEmpty()) {
               //there are errors - render create form with values
               async.parallel({
                   categories: function(callback){
                       Category.find().exec(callback)
                   }
               }, function(err, results){
                   if(err){return next(err)}
   
                   console.log(errors)
                   res.render('coin_form', {title:'Create coin', categories: results.categories, action:'Create', coin: coin})
                   return
               })
           } else {
               //There are no errors
               Coin.findByIdAndUpdate(req.params.id, coin, {},  function(err){
                   if(err){return next(err)}
                   res.redirect('/catalog/category/' + coin.category)
               })
           }
   
       }
]

exports.coin_delete_get = function(req,res, next) {
    res.send('to be implemented')
}

exports.coin_delete_post = function(req,res, next) {
    Coin.findByIdAndDelete(req.params.id)
        .exec(function(err){
            if(err){return next(err)}
            res.redirect('/')
        })
}

exports.coin_detail = function(req,res, next) {
    Coin.findById(req.params.id)
        .exec(function(err,coin) {
            if(err){return next(err)}
            res.render('coin_detail', {title: coin.name, coin: coin})
        })
}

