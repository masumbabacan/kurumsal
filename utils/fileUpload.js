const uuid = require("uuid").v4;
const path = require('path');
const CustomError = require("../errors");

const singleImageUpload = async (req) => {
    //If the request does not have a file, continue
    if (!req.files) return;
    const image = req.files.image;
    const maxSize = 1024 * 1024;
    //Is the file an image?
    if (!image.mimetype.startsWith('image')) throw new CustomError.BadRequestError('Lütfen bir resim yükleyiniz');
    //Is the file less than 1mb?
    if (image.size > maxSize) throw new CustomError.BadRequestError('Resim boyutu 1MB boyutundan fazla olmamalıdır');
    //make filename unique
    image.name = uuid() +'-'+ image.name.trim().replace(' ', '-');
    //set file path
    const imagePath = path.join(__dirname,'../public/uploads/' + `${image.name}`);
    //upload file
    await image.mv(imagePath);
    //return file path
    return `/uploads/${image.name}`
}

module.exports = singleImageUpload;