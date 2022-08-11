
const CustomError = require('../errors');

const checkPermissions = (requestUser, resourceUserId) => {
    if (requestUser.role === 'admin') return;
    if (requestUser.userId === resourceUserId.toString()) return;
    throw new CustomError.UnAuthorizationError('Kullanıcının bu rotaya erişim izni yok');
}

module.exports = checkPermissions;