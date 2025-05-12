const CustomError = require("../utils/customError");

module.exports.errorHandler = (error, req, res, next) => {
    console.log(error);

    if (error instanceof CustomError) {
        return res.status(error.statusCode).json({
            success: error.success,
            message: error.message,
            errors: error.errors
        });
    }

    return res.status(500).json({
        success: false,
        message: "Internal Server Error",
        errors: [error.message]
    });
};

