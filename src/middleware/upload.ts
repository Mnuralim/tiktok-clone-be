import multer from "multer";

const storage = multer.diskStorage({});

export const upload = multer({
  storage: storage,
  fileFilter(req, file, callback) {
    if (file.fieldname === "video") {
      file.mimetype === "video/mp4" || file.mimetype == "video/mov" ? callback(null, true) : callback(null, false);
    } else if (file.fieldname === "thumbnail") {
      file.mimetype === "image/jpeg" || file.mimetype == "image/png" || file.mimetype === "image/jpg" ? callback(null, true) : callback(null, false);
    }
  },
  limits: {
    fileSize: 11000000,
  },
}).fields([
  {
    name: "video",
    maxCount: 1,
  },
  {
    name: "thumbnail",
    maxCount: 1,
  },
]);
