// const crypto = require('crypto')
/*
     Utils functions used by API server methods
    */

// 获取n位随机数
function getRandom(n) {
    let num = ''
    for (let i = 0; i < n; i++) {
        num += Math.floor(Math.random() * 10)
    }
    return num
}

// 生成主键id（三位随机数+当前时间戳）
function getGuid() {
    const length = 3
    let num = ''
    for (let i = 0; i < length; i++) {
        num += Math.floor(Math.random() * 10)
    }
    return num + new Date().getTime()
}

// 失败返回体
function resFail(statusCode, message) {
    const resBody = {}
    resBody.success = false
    resBody.statusCode = statusCode
    resBody.message = message
    resBody.data = ''

    return resBody
}

// app端成功返回体
function resSuccess(message, data) {
    const resBody = {}
    resBody.success = true
    resBody.statusCode = 200
    resBody.message = message
    resBody.data = data || ''

    return resBody
}


// function gen_session_id () {
//     return crypto.createHash('sha256').update(uuid.v4()).update(crypto.randomBytes(256)).digest('hex')
// }

module.exports = {
    getRandom,
    getGuid,
    resFail,
    resSuccess,
    // gen_session_id
}