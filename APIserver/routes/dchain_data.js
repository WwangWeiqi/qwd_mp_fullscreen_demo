var express = require('express');
var router = express.Router();
var mongoModal = require("../mongo/mongoInit/mongoModal")
var utils = require("../utils/common_util")
var _ = require('lodash');

/**
 * @param {Number} blocknumber 开始区块号
 * @return 从开始区块号到最新记录的LIST
 */
router.get('/', function(req, res) {
    let blocknumber = req.query.blocknumber
    mongoModal.DCHAIN_DATA.find({ blocknumber: { "$gt": blocknumber } }).
    then(data => {
        res.send(utils.resSuccess("获取下链数据列表成功", data))
    }).catch(err => {
        res.send(utils.resFail(7001, `获取下链数据列表失败：${err.message}`))
    })
});

/**
 * @return 查询结果LIST
 */
router.get('/search', function(req, res) {
    mongoModal.DCHAIN_DATA.find(query).
    then(data => {
        res.send(utils.resSuccess("查询下链数据列表成功", data))
    }).catch(err => {
        res.send(utils.resFail(7001, `查询下链数据列表失败：${err.message}`))
    })
});


/**
 * @param {Number} trace_id 审计周期id
 * @return 查询某一审计周期最新状态数据
 */
router.get('/latest_record', function(req, res) {
    let trace_id = req.query.trace_id
    mongoModal.DCHAIN_DATA.findOne({ trace_id: trace_id }).sort({ "createdAt": -1 }).
    then(data => {
        res.send(utils.resSuccess("查询下链数据列表成功", data))
    }).catch(err => {
        res.send(utils.resFail(7001, `查询下链数据列表失败：${err.message}`))
    })
});


router.post('/', async function(req, res) {
    try {
        let dchain_data_list = req.body.dchain_data_list;
        dchain_data_list = Object.prototype.toString.call(dchain_data_list) == '[object String]' ? JSON.parse(dchain_data_list) : dchain_data_list;

        dchain_data_list = dchain_data_list.sort((a, b) => {
            return a.blocknumber - b.blocknumber
        })
        let start_block = await mongoModal.DCHAIN_DATA.findOne({}, { _id: 0, blocknumber: 1 }).sort({ 'blocknumber': -1 }).lean();
        let start_index = start_block ? _.findIndex(dchain_data_list, start_block) : -1;

        let post_list = _.slice(dchain_data_list, start_index + 1)

        if (post_list.length == 0) { res.send(utils.resSuccess('没有新的下链记录', [])); return }

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