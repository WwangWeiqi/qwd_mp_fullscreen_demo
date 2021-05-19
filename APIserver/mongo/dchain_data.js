var mongoose = require('mongoose');
const Schema = mongoose.Schema

const default_statistics = {
    "secondCheckResult": {
        "qualified": 0,
        "breakRule": 0
    },
    "secondCheckNumber": {
        "wait": 0,
        "checked": 0
    },
    "finalCheckNumber": {
        "wait": 0,
        "checked": 0
    },
    "appealNumber": {
        "wait": 0,
        "appealed": 0
    },
    "firstCheckNumber": {
        "wait": 0,
        "checked": 0
    },
    "firstCheckResult": {
        "qualified": 0,
        "breakRule": 0
    },
    "appealResult": {
        "breakRule": 0,
        "expire": 0,
        "submitFile": 0
    },
    "iaCheckNumber": {
        "qualified": 0,
        "breakRule": 0
    },
    "finalCheckResult": {
        "qualified": 0,
        "breakRule": 0
    },
    "batchConfirm": {
        "wait": 0,
        "confirmed": 0
    },
    "archiveNumber": 0
}

var dchaindataSchema = new Schema({
    "txhash": { type: String, required: [true, "txhash missed"], unique: true }, //链上交易哈希
    "trace_id": { type: String, required: true },
    "blocknumber": { type: Number, required: true },
    "date": { type: Number, required: true },
    "hash": { type: String, required: true }, //数据存证hash
    "username": { type: String, required: true }, //上链操作者
    "from_user": { type: String, required: true }, //Token所有者
    "from_unit_name": { type: String, required: true }, //处理数据的上链单元名称
    "unit_type": { type: Number, required: true }, //链上数据类型：1.加密数据，2.存证数据（未加密）
    "statistics": { type: {}, required: true, default: default_statistics } //审计周期统计数据信息
}, {
    strict: false,
    timestamps: true
})

module.exports = mongoose.model("dchain_data", dchaindataSchema, "dchain_data");