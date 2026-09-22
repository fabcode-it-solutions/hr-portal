import mongoose from "mongoose";
const schema = mongoose.Schema;

const Notifications = new schema({
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
  },
  email: {
    type: String,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  seenAdmin: {
    type: Boolean,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const popupNotification = mongoose.model("PopupNotification", Notifications);
export default popupNotification;
