import mongoose from "mongoose";

const { Schema } = mongoose;

const notificationSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  seenAdmin: {
    type: Boolean,
    default: false,
  },
  email:{
    type: String,
    required: true,
  },
  action:{
    type: String,
  },
  message:{
    type: String,
  },
  userSeen:{
    type:Boolean
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const leaveNotification = mongoose.model("leaveNotification", notificationSchema);

export default leaveNotification;
