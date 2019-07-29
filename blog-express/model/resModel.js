class BaseModel {
    constructor(data,message) {
        //可以传入一个对象，一个字符串
        //如果直接传入了一个字符串 那么就做个兼容
        if (typeof data === 'string') {
            this.message = data;
            data = null;
            message = null;
        }

        if(data) {
            this.data = data;
        }
        if(message) {
            this.message = message;
        }
    }
}


class SuccessModel extends BaseModel {
    constructor(data,message) {
        super(data,message)
        this.errno = 0
    }
}


class ErrorModel extends BaseModel {
    constructor(data,message) {
        super(data,message)
        this.errno = -1
    }
}

module.exports = {
    SuccessModel,
    ErrorModel
}