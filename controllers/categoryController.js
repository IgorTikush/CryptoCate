const Category = require('../models/category');
const Coin = require('../models/coin')
const async = require('async');
const { body,validationResult } = require('express-validator');



exports.index = function(req, res, next) {
    Category.find()
        .exec(function (err, category_list){
            if (err) {return next(err)}
            res.render('index', {category_list: category_list, title: 'Crypto categories'})
        })
}
exports.category_create_get = function(req,res, next) {
    res.render('category_form', {title: 'Create category', action: 'Create'})
}

exports.category_create_post = [
    //Validate and sanitize all fields
    body('name', 'Name is required').trim().isLength({min: 3}).escape(),
    body('description', 'Description is required').trim().isLength({min: 10}).escape(),
    //After validation continue
    (req, res, next) => {
        //Extract validation errors
        const errors = validationResult(req);
        
        //Create new category instance
        let category = new Category({
            name: req.body.name,
            description: req.body.description
        })
        if(!errors.isEmpty()) {
            //there are errors, render form again with sanitazed values
            res.render('category_form', {title: 'Create category', category: category, action: 'Create'})
            console.log(errors)
            return
        } else {
            //Data from form is valid
            category.save(function(err) {
                if(err) { return next(err); }
                //Success
                res.redirect('/catalog')
            })
        }
        
    }

]

exports.category_update_get = function(req,res, next) {
    Category.findById(req.params.id)
        .exec(function(err, category) {
            if (err) {return next(err)}
            res.render('category_form', {title: 'Update category', category: category, action: 'Update'})
        })
}

exports.category_update_post = [
    //Validate and sanitize all fields
    body('name', 'Name is required').trim().isLength({min: 3}).escape(),
    body('description', 'Description is required').trim().isLength({min: 10}).escape(),
    //After validation continue
    (req, res, next) => {
        //Extract validation errors
        const errors = validationResult(req);
        
        //Create new category instance
        let category = new Category({
            name: req.body.name,
            description: req.body.description,
            _id: req.params.id
        })
        if(!errors.isEmpty()) {
            //there are errors, render form again with sanitazed values
            res.render('category_form', {title: 'Create category', category: category, action: 'Update'})
            console.log(errors)
            return
        } else {
            //Data from form is valid
            Category.findByIdAndUpdate(req.params.id, category, {}, function (err) {
                if(err) { return next(err); }
                //Success
                res.redirect('/catalog')
            })
        }
        
    }

]

exports.category_delete_get = function(req,res, next) {
    async.parallel({
        category: function(callback){
            Category.findById(req.params.id).exec(callback)
        },
        coins: function(callback){
            Coin.find({'category': req.params.id}).exec(callback)
        }
        
    }, function(err, results) {
        if(err) {return next(err)}
        if(results.category === null) {
            res.redirect('/catalog/categories')
        }
        res.render('category_delete', {title: 'Delete Category', coins: results.coins, category: results.category})
    })
}

exports.category_delete_post = function(req,res, next) {
    Category.findByIdAndDelete(req.body.categoryid)
        .exec(function(err){
            if(err) {return next(err)}
            res.redirect('/catalog/categories')
        })
}

exports.category_detail = function(req,res, next) {
    async.parallel({
        category: function(callback){
            Category.findById(req.params.id).exec(callback)
        },
        coins: function(callback){
            Coin.find({'category': req.params.id}).exec(callback)
    
        }
    }, function(err, results) {
        if(err) {return next(err)}
        if(results.category === null) {
            res.redirect('/')
        }
        res.render('category_detail', {title: results.category.name, category: results.category, coins: results.coins})
    })
}

exports.category_list = function(req, res, next) {
    res.redirect('/')
}
