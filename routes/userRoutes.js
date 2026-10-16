const express = require("express");
const multer = require("multer");
const router = express.Router();
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  getMe,
  uploadPicture,
  deletePicture,
  servePicture,
} = require("../controllers/userController");

// Multer errors handle wrapper
const handleUpload = (req, res, next) => {
  upload.single("picture")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res
          .status(413)
          .json({ success: false, message: "File too large. Maximum size is 2MB" });
      }
      return res.status(400).json({ success: false, message: err.message });
    }
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

router.get("/me", protect, getMe);
router.put("/me/picture", protect, handleUpload, uploadPicture);
router.delete("/me/picture", protect, deletePicture);
router.get("/:id/picture", servePicture); // public

module.exports = router;