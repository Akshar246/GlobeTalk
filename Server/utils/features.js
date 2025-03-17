import mongoose from "mongoose";
import jwt from "jsonwebtoken";
// import { v4 as uuid } from "uuid";
import { v2 as cloudinary } from "cloudinary";
// import { getBase64, getSockets } from "../lib/helper.js";

const cookieOptions = {
  maxAge: 15 * 24 * 60 * 60 * 1000,
  sameSite: "none",
  httpOnly: true,
  secure: true,
};

const connectDB = (uri) => {
  mongoose
    .connect(uri, { dbName: "GlobeTalk" })
    .then((data) => console.log(`Connected to DB: ${data.connection.host}`))
    .catch((err) => {
      throw err;
    });
};

const sendToken = (res, user, code, message) => {

;  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
  console.log(token);
  return res.status(code).cookie("Globe-token", token, cookieOptions).json({
    success: true,
    user,
    message,
  });
};


const emitEvent = (req, event, users, data) => {
  console.log("Emitting Event", event)
}

const deleteFilesFromCloudinary = async (public_ids) => {

};

export {
    connectDB,
    sendToken,
    cookieOptions,
    emitEvent,
    deleteFilesFromCloudinary,
  };