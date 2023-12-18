import express from "express";
import ImageController from "../controllers/imageconvert.controller";
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
let router = express.Router();

let initWebRoutes = (app) => {
  router.post("/", upload.array('images'), ImageController.ImageConverted);
  return app.use('/', router);
}

module.exports = initWebRoutes;