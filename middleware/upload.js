const multer = require("multer");
const path = require("path");

const storageCategory = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../images/category");
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const productName = req.body.name; // No fallback
    const ext = path.extname(file.originalname);
    cb(null, `${productName}${ext}`);
  },
});
const uploadCategory = multer({
  storage: storageCategory,
  limits: { fileSize: 1024 * 1024 * 20 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(
        new Error(
          "Error: File upload only supports the following filetypes - " +
            filetypes
        )
      );
    }
  },
});
const storageProduct = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../images/product");
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const productName = req.body.name; // No fallback
    const ext = path.extname(file.originalname);
    cb(null, `${productName}${ext}`);
  },
});

// Multer instance for product uploads
const uploadProduct = multer({
  storage: storageProduct,
  limits: { fileSize: 1024 * 1024 * 20 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(
        new Error(
          "Error: File upload only supports the following filetypes - " +
            filetypes
        )
      );
    }
  },
});
// const storageOffer = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = path.join(__dirname, "../images/offer");
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const timestamp = Date.now();
//     const ext = path.extname(file.originalname);
//     cb(null, `offer_${timestamp}${ext}`); // Use the timestamp in the filename
//   },
// });
const storageOffer = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "../images/offer");
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const offerName = req.body.name;
    const ext = path.extname(file.originalname);
    cb(null, `${offerName}${ext}`);
  },
});

const uploadOffer = multer({
  storage: storageOffer,
  limits: { fileSize: 1024 * 1024 * 20 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(
        new Error(
          "Error: File upload only supports the following filetypes - " +
            filetypes
        )
      );
    }
  },
});
module.exports = { uploadCategory, uploadProduct, uploadOffer };
