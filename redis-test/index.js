const redis = require('redis');

const redisClient = redis.createClient(6379,'127.0.0.1');

redisClient.on('error',err=>{
    console.log('redis ERROR: ',err)
})

//test
redisClient.set('myname','weibin',redis.print)
redisClient.get('myname',(err,val)=>{
    if(err) {
        console.log('redis ERROR: ',err)
        return 
    }
    console.log('redis val: ',val)

    //退出REDIS
    redisClient.quit()
})

