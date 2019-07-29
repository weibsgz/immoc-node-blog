
//统计谷歌占比

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const fullFileName = path.join(__dirname,'../','../','logs','access.log')

//创建readstream
const readStream =  fs.createReadStream(fullFileName)

//创建readline对象
const rl = readline.createInterface({
    input : readStream
})

let chromeNum = 0;
let sumNum = 0;

rl.on('line',lineData=>{
    if(!lineData) return
    //记录总行数
    sumNum++;
    const arr = lineData.split(" -- ");
    if(arr[2] && arr[2].indexOf('Chrome')>0) {
        chromeNum++
    }
})

rl.on('close',()=>{
    console.log('chrome占比是: ',chromeNum/sumNum)
})