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
  seen: {
    type: Boolean,
    default: false,
  },
  email: [{
    type: String,
    required: true,
  }],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
