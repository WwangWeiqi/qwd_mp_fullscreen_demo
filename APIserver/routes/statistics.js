var express = require('express');
var router = express.Router();
var mongoModal = require("../mongo/mongoInit/mongoModal")
var utils = require("../utils/common_util")
var _ = require('lodash');

router.get('/', function(req, res) {
    mongoModal.STATISTICS.find(req.query)
        .then(data => { res.send(utils.resSuccess("获取统计数据成功", data)) })
        .catch(err => { res.send(utils.resFail(7001, `获取统计数据失败：${err.message}`)) })
});


module.exports = router;