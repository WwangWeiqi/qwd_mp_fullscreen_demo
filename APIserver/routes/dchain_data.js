var express = require('express');
var router = express.Router();
var mongoModal = require("../mongo/mongoInit/mongoModal")
var utils = require("../utils/common_util")
var _ = require('lodash');

router.get('/', function (req, res) {
    mongoModal.DCHAIN_DATA.find(req.query).
        then(data => {
            res.send(utils.resSuccess("获取下链数据列表成功", data))
        }).catch(err => {
            res.send(utils.resFail(7001, `获取下链数据列表失败${err.message}`))
        })
});

router.post('/', async function (req, res) {
    try {
        let dchain_data_list = req.body.dchain_data_list;
        dchain_data_list = Object.prototype.toString.call(dchain_data_list) == '[object String]' ? JSON.parse(dchain_data_list) : dchain_data_list;
        dchain_data_list = dchain_data_list.sort((a, b) => {
            return a.blocknumber - b.blocknumber
        })
        let start_block = await mongoModal.DCHAIN_DATA.findOne({}, { _id: 0, blocknumber: 1 }).sort({ 'blocknumber': -1 }).lean();
        let start_index = start_block ? _.findIndex(dchain_data_list, start_block) : -1;

        let post_list = _.slice(dchain_data_list, start_index + 1)

        mongoModal.DCHAIN_DATA.insertMany(post_list).
            then(data => { res.send(utils.resSuccess('添加下链记录数据成功', data)) }).
            catch(err => { res.send(utils.resFail(7002, `添加下链记录数据失败:${err.message}`)) })
    } catch (err) {
        res.send(utils.resFail(7002, `添加下链记录数据失败:${err.message}`))
    }
});

// router.post('/delete', function(req, res, next) {
//     var id = req.body.id;
//     Entities.remove({ _id: id }, function(e, r) {
//         if (e) {
//             res.send(e)
//         } else {
//             res.send(r)
//         }
//     })

// });

// router.put('/update', function(req, res, next) {
//     var id = req.body.id;
//     var entity_type = req.body.entity_type;
//     var brand = req.body.brand;

//     Entities.update({ _id: id }, {
//         'entity_type': entity_type,
//         'brand': brand,
//         updatedAt: new Date()
//     }, function(e, r) {
//         if (e) {
//             res.send(e)
//         } else {
//             res.send(r)
//         }
//     })

// });
module.exports = router;