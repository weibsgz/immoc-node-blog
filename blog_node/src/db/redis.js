const redis = require('redis')

const {REDIS_CONF} = require('../conf/db')


const redisClient = redis.createClient(REDIS_CONF.port,REDIS_CONF.host);

redisClient.on('error',err=>{
    console.log('redis ERROR: ',err)
})

function set(key,value) {
    if(typeof value === 'object') {
        value = JSON.stringify(value)
    }
    redisClient.set(key,value,redis.print)
}

function get(key) {
    const promise = new Promise((resolve,reject)=>{
        redisClient.get(key,(err,val)=>{
            if(err) {
                reject(err)
                return 
            }
            if (val === null) {
                resolve(null)
            }
            //如果能转JSON格式就转 不能直接返回
            try{
                resolve(JSON.parse(val))
            }catch(ex) {
                resolve(val)
            }
            
        })
    })
    return promise
}

module.exports = {
    set,get
}