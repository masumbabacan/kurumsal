const uuid = require("uuid").v4;
const path = require('path');
const CustomError = require("../errors");

const multiImageUpload = async (req) => {
    if (!req.files) return;
    const images = req.files.images;
    const maxSize = 1024 * 1024;
    let returnImageArray = [];
    images.forEach(image => {
        if (!image.mimetype.startsWith('image')) throw new CustomError.BadRequestError('Lütfen bir resim yükleyiniz');
        if (image.size > maxSize) throw new CustomError.BadRequestError('Resim boyutu 1MB boyutundan fazla olmamalıdır');
        image.name = uuid() +'-'+ image.name.trim().replace(' ', '-');
        const imagePath = path.join(__dirname,'../public/uploads/' + `${image.name}`);
        image.mv(imagePath);
        returnImageArray.push(`/uploads/${image.name}`)
    });
    return returnImageArray;
}

module.exports = multiImageUpload;