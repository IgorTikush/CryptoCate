const express = require('express')
const router = express.Router()

const category_controller = require('../controllers/categoryController')
const coin_controller = require('../controllers/coinController')

                                //// Categories routes////

// GET home page
router.get('/', category_controller.index)

// Get CREATE
router.get('/category/create', category_controller.category_create_get)

// POST CREATE
router.post('/category/create', category_controller.category_create_post)

//GET UPDATE
router.get('/category/:id/update', category_controller.category_update_get)

//POST UPDATE
router.post('/category/:id/update', category_controller.category_update_post)

//GET DELETE
router.get('/category/:id/delete', category_controller.category_delete_get)

//POST DELETE
router.post('/category/:id/delete', category_controller.category_delete_post)

//SHOW 1 category
router.get('/category/:id', category_controller.category_detail)

//SHOW all categories
router.get('/categories', category_controller.category_list)

                                        //// Coins routes //////
// GET create coin
router.get('/coin/create', coin_controller.coin_create_get)

//POST create coin
router.post('/coin/create', coin_controller.coin_create_post)

//GET delete coin
router.get('/coin/:id/delete', coin_controller.coin_delete_get)

//POST delete coin
router.post('/coin/:id/delete', coin_controller.coin_delete_post)

//GET update coin
router.get('/coin/:id/update', coin_controller.coin_update_get)

//POST update coin
router.get('/coin/:id/update', coin_controller.coin_update_post)

// show 1 coin
router.get('/coin/:id', coin_controller.coin_detail)

// show all coins
router.get('/coins', coin_controller.coin_list)

module.exports = router
