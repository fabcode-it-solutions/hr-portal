import mongoose from "mongoose";
const schema = mongoose.Schema;

const user = new schema({
  userImg: {
    type: String,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  employeeType: {
    type: String,
    enum: ["trainee", "permanent"],
  },
  salary: {
    type: String,
  },
  address: {
    type: String,
  },

  emergencyNo: {
    type: Number,
  },
  ifsc: {
    type: String,
  },
  designation: {
    type: String,
  },
  department: {
    type: String,
  },
  joinDate: {
    type: Date,
  },
  phoneNumber: {
    type: Number,
  },
  gender: {
    type: String,
  },
  accountNo: {
    type: Number,
  },
  totalLeave: {
    type: Number,
    default: 12,
  },
  personalEmail: {
    type: String,
  },
  totalSandwich: {
    type: Number,
    default: 2,
  },
  userType: {
    type: Number,
    enum: [0, 1],
    default: 0,
  },
  otp: {
    type: String,
    default: null,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  otpExpiration: {
    type: Date,
  },
  status: {
    type: Boolean,
    default: true,
  },
  isPasswordSet: {
    type: Boolean,
  },
  endDate: {
    type: Date,
    default: null,
  },
  dob: {
    type: Date,
    default: null,
  },
  incrementDate: {
    type : Date,
    default: null
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

const userdata = mongoose.model("User", user);
export default userdata;
