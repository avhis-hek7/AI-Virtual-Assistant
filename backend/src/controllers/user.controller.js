const userModel = require("../models/user.model");
const uploadOnCloudinary = require("../services/cloudinary");
async function getCurrentUserController(req, res) {
  try {
    const userId = req.userId;
    const user = await userModel.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({
        message: "User not found",
      });
    }
    return res.status(200).json({
      message: "User found",
      user,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Get current user Error",
    });
  }
}

async function updateAssistant(req, res) {
  try {
    const { assistantName, imageUrl } = req.body;
    let assistantImage;
    if (req.file) {
      assistantImage = await uploadOnCloudinary(req.file.path);
    } else {
      assistantImage = imageUrl;
    }

    const user = await userModel
      .findByIdAndUpdate(
        req.userId,
        {
          assistantName,
          assistantImage,
        },
        { returnDocument: "after" },
      )
      .select("-password");

    return res.status(200).json({ message: "Users", user });
  } catch (error) {
    return res.status(500).json({
      message: "update assistant Error",
    });
  }
}

module.exports = { getCurrentUserController, updateAssistant };
