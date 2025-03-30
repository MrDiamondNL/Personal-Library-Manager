module.exports.errorHandler = (error, req, res, next) => {
    console.log(error);

    if (error instanceof CustomError) {
        return res.status(err.statusCode).json({
            success: err.success,
            message: err.message,
            errors: err.errors
        });
    }
};

