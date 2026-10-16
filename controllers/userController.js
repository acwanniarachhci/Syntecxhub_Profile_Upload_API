const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const User = require("../models/User");


const removeFile = (filePath) => {
  if (!filePath) return;
  fs.unlink(path.resolve(filePath), () => {});
};

// GET my profile
exports.getMe = async (req, res) => {
  res.status(200).json({ success: true, data: req.user });
};

// UPLOAD / UPDATE picture
exports.uploadPicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded. Use field name 'picture'",
      });
    }

    const baseUrl =
      process.env.BASE_URL || `${req.protocol}://${req.get("host")}`;
    const user = req.user;

 
    const oldPath = user.profilePicture && user.profilePicture.path;

    user.profilePicture = {
      filename: req.file.filename,
      originalName: req.file.originalname,
      path: req.file.path,
      url: `${baseUrl}/api/users/${user._id}/picture`,
      mimetype: req.file.mimetype,
      size: req.file.size,
      uploadedAt: new Date(),
    };
    await user.save();

    removeFile(oldPath);

    res.status(200).json({
      success: true,
      message: "Profile picture saved successfully",
      data: user.profilePicture,
    });
  } catch (error) {
    if (req.file) removeFile(req.file.path);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE picture
exports.deletePicture = async (req, res) => {
  try {
    const user = req.user;

    if (!user.profilePicture || !user.profilePicture.filename) {
      return res
        .status(404)
        .json({ success: false, message: "No profile picture to delete" });
    }

    const oldPath = user.profilePicture.path;
    user.profilePicture = undefined;
    await user.save();
    removeFile(oldPath);

    res
      .status(200)
      .json({ success: true, message: "Profile picture deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// SERVE picture (public URL)
exports.servePicture = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid user ID" });
    }

    const user = await User.findById(id);
    if (!user || !user.profilePicture || !user.profilePicture.path) {
      return res
        .status(404)
        .json({ success: false, message: "Profile picture not found" });
    }

    const filePath = path.resolve(user.profilePicture.path);
    if (!fs.existsSync(filePath)) {
      return res
        .status(404)
        .json({ success: false, message: "File missing on server" });
    }

    res.type(user.profilePicture.mimetype);
    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};