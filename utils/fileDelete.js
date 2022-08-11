const fs = require('fs');
const path = require('path');

const fileDelete = async (imagePath) => {
    //check and delete the desired file
    if (fs.existsSync(path.join(__dirname,'../public' + `${imagePath}`))) {
        fs.unlinkSync(path.join(__dirname,'../public' + `${imagePath}`));
    }
    return;
}

module.exports = fileDelete;