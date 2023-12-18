import sharp from "sharp";

const fs = require('fs');
import path from 'path';
import upload_path from '../../uploads/_path';

require('dotenv').config();


let ImageConverted = async (req, res) => {
  try {
    const {body} = req
    const type = body.format;
    const resizedImages = [];
    for (const file of req.files) {
      const filePath = path.join(upload_path, file.filename)
      let resizedImage;
      if (body.fit !== 'undefined') {
        resizedImage = await sharp(filePath)
          .resize(parseInt(body.width), parseInt(body.height), {fit: body.fit})
          .toFormat(body.format)
          .toBuffer();
      } else {
        resizedImage = await sharp(filePath)
          .toFormat(body.format)
          .toBuffer();
      }
      resizedImages.push({value: resizedImage, fileName: file.filename});
    }
    req.files.forEach((file) => {
      console.log('file', file)
      fs.unlinkSync(path.join(upload_path, file.filename));
    });
    return res.json({images: resizedImages, type})
  } catch (error) {
    console.log(error)
    res.status(500).send('Đã xảy ra lỗi khi xử lý ảnh.');
  }
};

module.exports = {
  ImageConverted: ImageConverted,
}