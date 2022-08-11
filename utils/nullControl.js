const CustomError = require("../errors");

const nullControl = async (fields = array()) => {
    fields.forEach(element => {
        if (!element) throw new CustomError.BadRequestError('Lütfen alanları boş bırakmayın');
    });
    return;
}

module.exports = nullControl;