var mongoose = require('mongoose')
var mongo_config = require('../../config/mongoConfig')
let mongo_url

if (process.env.NODE_ENV === 'local' || !process.env.NODE_ENV) {
    mongo_url = `mongodb://${mongo_config.mongoLocalServer.host}:${mongo_config.mongoLocalServer.port}/${mongo_config.mongoLocalServer.dbname}`
}

mongoose.connect(mongo_url, { useNewUrlParser: true, useUnifiedTopology: true }, function(e, r) {
    if (!e) {
        console.log("\033[42;37mmongodb connected successful " + mongo_url + "\033[0m")
    } else {
        console.log("mongodb connect error", e)
    }
});