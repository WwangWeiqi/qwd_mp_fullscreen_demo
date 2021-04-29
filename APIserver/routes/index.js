// var express = require('express');
// var router = express.Router();
// var Products = require("../mongo/products")
// var _ = require('lodash');

// /* 产品列表，只有root用户(权限6666)可编辑 */
// router.get('/', function(req, res, next) {
//     Products.find({}, function(e, r) {
//         res.send(_.map(r, 'product'))
//     })
// });

// router.post('/add', function(req, res, next) {
//     var new_product = new Products({
//         'product': req.body.product,
//     })
//     new_product.save().then((msg) => {
//         res.send(msg)
//     }).catch((err) => {
//         res.send(err)
//     });
// });

// router.post('/delete', function(req, res, next) {
//     var id = req.body.id;
//     Products.remove({ _id: id }, function(e, r) {
//         if (e) {
//             res.send(e)
//         } else {
//             res.send(r)
//         }
//     })

// });

// router.put('/update', function(req, res, next) {
//     var id = req.body.id;
//     var product = req.body.product;

//     Products.update({ _id: id }, {
//         'product': product,
//         "updatedAt": new Date()
//     }, function(e, r) {
//         if (e) {
//             res.send(e)
//         } else {
//             res.send(r)
//         }
//     })
// });

// module.exports = router;