import sharp from "sharp";

const fs = require('fs');
import path from 'path';
import upload_path from '../../uploads/_path';

require('dotenv').config();


const ImageConverted = async (req, res) => {
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
    return res.json({images: resizedImages, type})
  } catch (error) {
    console.log(error)
    res.status(500).send('Đã xảy ra lỗi khi xử lý ảnh.');
  }
};

function removeFileInFolder(req, res) {
  try {
    fs.readdir(upload_path, (err, files) => {
        if (err) return;
        files.forEach((file) => {
          if (file !== '_path.js') {
            fs.unlink(path.join(upload_path, file), (err) => {
              if (err) console.log(err)
            })
          }
        });
      }
    )
    return res.json({success: true})
  } catch (error) {
    console.log(error)
    res.status(500).send('Đã xảy ra lỗi khi xóa bộ nhớ đệm.');
  }
}

module.exports = {
  ImageConverted: ImageConverted,
  removeFileInFolder: removeFileInFolder,
}