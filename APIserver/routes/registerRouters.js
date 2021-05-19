var dchain_data = require('./dchain_data.js');
var statistics = require('./statistics.js');
module.exports = function(app) {
    // app.use("/", index)
    app.use("/auth/dchain_data", dchain_data)
    app.use("/auth/statistics", statistics)
}