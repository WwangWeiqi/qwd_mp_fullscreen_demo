var mongoose = require('mongoose');
const Schema = mongoose.Schema

var statisticwSchema = new Schema({
    "trace_id": { type: String, required: true },
    "latest_blocknumber": { type: String, required: true },
    "current_phase": { type: String, required: true }, //当前审计周期所处阶段
    "total_qualified": { type: String, default: 0 },
    "total_breakrule": { type: String, default: 0 },


}, {
    strict: false,
    timestamps: true
})

module.exports = mongoose.model("statistics", statisticwSchema);