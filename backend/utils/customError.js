class CustomError extends Error {
    constructor (statusCode, message, errors = []) {
        super(message);
        this.statusCode = statusCode;
        this.errors = errors;
        this.success = false
    }

    static badRequest(msg = "Bad Request", errors = []) {
        return new CustomError(400, msg, errors);
    }

    static unauthorized(msg = "Unauthorized") {
        return new CustomError(401, msg);
    }

    static forbidden(msg = 'Forbidden') {
        return new CustomError(403, msg);
    }

    static notFound(msg = 'Not Found') {
        return new CustomError(404, msg);
    }
    
    static internalServer(msg = 'Something Went Wrong') {
        return new CustomError(500, msg);
    }
}

module.exports = CustomError;