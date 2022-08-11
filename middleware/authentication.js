const CustomError = require("../errors");
const Token = require("../models/Token");
const { isTokenValid } = require("../utils");
const { attachCookiesToResponse, createTokenUser, sendVerificationEmail } = require("../utils/index");
const authenticateUser = async (req,res,next) => {
    const {refreshToken, accessToken} = req.signedCookies;

    try {
        if (accessToken) {
            const payload = isTokenValid(accessToken);
            req.user = payload.user;
            return next();
        }
        const payload = isTokenValid(refreshToken);

        const existingToken = await Token.findOne({
            user: payload.user.userId,
            refreshToken : payload.refreshToken
        });

        if (!existingToken || !existingToken?.isValid) {
            throw new CustomError.UnauthenticatedError("Geçersiz kimlik");
        }
        req.user = payload.user;
        attachCookiesToResponse({
            res,user:payload.user,
            refreshToken:existingToken.refreshToken,
        });
        next();

    } catch (error) {
        throw new CustomError.UnauthenticatedError("Geçersiz kimlik");
    }
};

const authorizePermissions = (...roles) => {
    return (req,res,next) => {
        if (!roles.includes(req.user.role)) {
            throw new CustomError.UnAuthorizationError(
                "Kullanıcının bu rotaya erişim izni yok"
            );
        }
        next();
    }
}

module.exports = {
    authenticateUser,
    authorizePermissions,
}