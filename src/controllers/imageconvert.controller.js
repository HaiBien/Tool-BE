import sharp from "sharp";
import path from 'path';
import upload_path from '../../uploads/_path';

require('dotenv').config();


let ImageConverted = async (req, res) => {
  try {
    const {body} = req
    console.log('body', body)
    const type = body.format;
    const resizedImages = [];
    for (const file of req.files) {
      const filePath = path.join(upload_path, file.filename)
      let resizedImage;
      if(body.fit !== 'undefined') {
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
    return res.json({images: resizedImages, type})
  } catch (error) {
    console.log(error)
    res.status(500).send('Đã xảy ra lỗi khi xử lý ảnh.');
  }
};

module.exports = {
  ImageConverted: ImageConverted,
}