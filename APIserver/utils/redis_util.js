const redis_config = require('../config/redisConfig')
let redis = require('redis')
global.redis_status = 0

RDS_OPT = { auth_pass: redis_config.redisRemoteServer.redispwd }
var redis_client;
if (process.env.NODE_ENV === 'local' || !process.env.NODE_ENV) {
    redis_client = redis.createClient(redis_config.redisLocalServer.redisPort, redis_config.redisLocalServer.redisHost)
} else if (process.env.NODE_ENV === 'dev') {
    redis_client = redis.createClient(redis_config.redisRemoteServer.redisPort, redis_config.redisRemoteServer.redisHost, RDS_OPT)
} else if (process.env.NODE_ENV === 'docker') {
    redis_client = redis.createClient(redis_config.redisDockerServer.redisPort, redis_config.redisDockerServer.redisHost, RDS_OPT)
}


redis_client.on('error', function(err) {
    global.redis_status = 0
    console.log('Error ' + err)
})

redis_client.on('connect', function(err, r) {
    if (err) {
        console.log('redis disconnected ' + err)
    } else {
        global.redis_status = 1
        console.log('\033[42;37mredis connect ' + redis_client.address + "\033[0m")
        redis_client.select(1, function(e, r) {
            console.log('\033[42;37mredis select db 1\033[0m')
        })
    }
})

redis = {}

// redis_client.hset("key3", "key1", `{"userid":"123","flow_name":"流程名"}`, function(e, r) {
//     console.log(e, r)
// });

// redis_client.hdel("key3", ["key2", "key1"], function(e, r) {
//     console.log(e, r)
// });

// redis_client.hgetall("key3", function(e, r) {
//     for (i in r) {
//         console.log(JSON.parse(r[i]))
//     }
// });

/**
 * 新增key-value
 * @param {string} key
 * @param {string} value
 */
redis.set = function(key, value) {
        return new Promise((resolve, reject) => {
            redis_client.set(key, value, function(err, res) {
                !err ? resolve(res) : reject(err)
            })
        })
    }
    /**
     * 获取value
     * @param {string} key
     */
redis.get = function(key) {
    return new Promise((resolve) => {
        redis_client.get(key, function(err, res) {
            return resolve(res)
        })
    })
}

/**
 * 设置过期时间
 * @param {string} key
 *  @param {string} value 过期时间seconds
 */
redis.expire = function(key, value) {
    return new Promise((resolve, reject) => {
        redis_client.expire(key, value, function(err, res) {
            !err ? resolve(res) : reject(err)
        })
    })
}

/**
 * 持久化key
 * @param {string} key key名
 */
redis.persist = function(key) {
    return new Promise((resolve, reject) => {
        redis_client.persist(key, value, function(err, res) {
            !err ? resolve(res) : reject(err)
        })
    })
}

redis.incr = function(key) {
    return new Promise((resolve, reject) => {
        redis_client.incr(key, function(err, res) {
            !err ? resolve(res) : reject(err)
        })
    })
}

// 事务
redis.multi = function() {
    return redis_client.multi()
}

/**
 * 查看key是否存在
 * @param {string} key key名
 * @returns {int} 1存在/0不存在
 */
redis.exists = function(key) {
    return new Promise((resolve, reject) => {
        redis_client.exists(key, function(err, res) {
            !err ? resolve(res) : reject(err)
        })
    })
}

/**
 * 添加成员到集合
 * @param {string} set 集合名
 * @param {Array} valuelist 成员名或列表
 *  @returns {int} 1成功/0失败
 */
redis.sadd = function(set, valuelist) {
    return new Promise((resolve, reject) => {
        redis_client.sadd(set, valuelist, function(err, res) {
            !err ? resolve(res) : reject(err)
        })
    })
}

/**
 * 从集合删除成员
 * @param {string} set 集合名
 * @param {Array} value 成员名
 *  @returns {int} 1成功/0失败
 */
redis.srem = function(set, valuelist) {
    return new Promise((resolve, reject) => {
        redis_client.srem(set, valuelist, function(err, res) {
            !err ? resolve(res) : reject(err)
        })
    })
}

/**
 * 查看成员是否在集合内
 * @param {string} set 集合名
 * @param {string} value 成员名
 * @returns {int} 1在/0不在
 */
redis.sismember = function(set, value) {
    return new Promise((resolve, reject) => {
        redis_client.sismember(set, value, function(err, res) {
            // return resolve(res);
            !err ? resolve(res) : reject(err)
        })
    })
}

/**
 * 添加成员[key-value]到哈希集合
 * @param {string} hashKey 哈希集合名
 * @param {string} subKey 成员键
 * @param {string} value 成员值
 *  @returns {int} 1成功/0失败
 */
redis.hset = function(hashKey, subKey, value) {
    return new Promise((resolve, reject) => {
        redis_client.hset(hashKey, subKey, value, function(err, res) {
            !err ? resolve(res) : reject(err)
        })
    })
}

/**
 * 添加成员对象到哈希集合
 * @param {string} hashKey 哈希集合名
 * @param {obj} obj 成员对象
 *  @returns {int} 1成功/0失败
 */
redis.hmset = function(hashKey, obj) {
    return new Promise((resolve, reject) => {
        redis_client.hmset(hashKey, obj, function(err, res) {
            !err ? resolve(res) : reject(err)
        })
    })
}

/**
 * 获取所有给定字段的值
 * @param {string} hashKey 哈希集合名
 * @param {Array} keylist 字段列表
 *  @returns {int} 1成功/0失败
 */
redis.hmget = function(hashKey, keylist) {
    return new Promise((resolve, reject) => {
        redis_client.hmget(hashKey, keylist, function(err, res) {
            !err ? resolve(res) : reject(err)
        })
    })
}

/**
 * 删除一个或多个Key-pair
 * @param {string} hashKey 哈希集合名
 * @param {Array} keylist 删除key数组
 *  @returns {int} 1成功/0失败
 */
redis.hdel = function(hashKey, keylist) {
    return new Promise((resolve, reject) => {
        redis_client.hdel(hashKey, keylist, function(err, res) {
            !err ? resolve(res) : reject(err)
        })
    })
}

/**
 * 从哈希集合获取一个key-pair
 * @param {string} hashKey 哈希集合名
 * @param {string} key 要获取的key
 *  @returns {int} 1成功/0失败
 */
redis.hget = function(hashKey, key) {
    return new Promise((resolve, reject) => {
        redis_client.hget(hashKey, key, function(err, res) {
            !err ? resolve(res) : reject(err)
        })
    })
}

/**
 * 从哈希集合获取对象
 * @param {string} hashKey 哈希集合名
 *  @returns {int} 1成功/0失败
 */
redis.hgetall = function(hashKey) {
    return new Promise((resolve, reject) => {
        redis_client.hgetall(hashKey, function(err, res) {
            !err ? resolve(res) : reject(err)
        })
    })
}

module.exports = redis