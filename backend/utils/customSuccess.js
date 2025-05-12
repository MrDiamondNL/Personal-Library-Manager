class CustomSuccess {
    constructor(message, statusCode = 200, data = {}) {
        this.success = true;
        this.message = message;
        this.data = data;
        this.statusCode = statusCode;
    }
}

module.exports = CustomSuccess;