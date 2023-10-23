import path from "path";
import express from "express";
import multer from "multer";
const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    // cb = callback
    cb(null, "uploads/"); // null = no error
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    ); // null = no error
  },
});

function checkFileType(file, cb) {
  // check file type
  const filetypes = /jpg|jpeg|png/;
  // check extension name
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // check mime type
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true); // null = no error
  } else {
    cb("Images only!");
  }
}

const upload = multer({
  storage,
});

router.post("/", upload.single("image"), (req, res) => {
  // upload.single("image") = single image upload
  res.send({
    message: "Image uploaded",
    image: `/${req.file.path}`,
  });
});

export default router;
