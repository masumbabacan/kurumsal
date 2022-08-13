const { StatusCodes } = require("http-status-codes")
const CustomAPIError = require("./custom-api");

class UnauthorizationError extends CustomAPIError {
    constructor(message){
        super(message);
        this.statusCode = StatusCodes.FORBIDDEN;
    }
}

module.exports = UnauthorizationError;