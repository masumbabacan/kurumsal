const {createJWT,isTokenValid,attachCookiesToResponse} = require("./jwt");
const createTokenUser = require("./createTokenUser");
const checkPermissions = require("./checkPermissions");
const sendVerificationEmail = require("./sendVerificationEmail");
const sendResetPasswordEmail = require("./sendResetPasswordEmail");
const createHash = require("./createHash");
const singleImageUpload = require("./fileUpload");
const multipleFileUpload = require("./multipleFileUpload");
const nullControl = require("./nullControl");
const fileDelete = require("./fileDelete");

module.exports = {
    createJWT,
    isTokenValid,
    attachCookiesToResponse,
    createTokenUser,
    checkPermissions,
    sendVerificationEmail,
    sendResetPasswordEmail,
    createHash,
    singleImageUpload,
    multipleFileUpload,
    nullControl,
    fileDelete,
}