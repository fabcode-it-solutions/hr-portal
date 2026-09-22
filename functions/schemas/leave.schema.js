import mongoose from "mongoose";

const schema = mongoose.Schema;

const leave = new schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  typeOfHoliday: {  
    type: String,
   required:true
  },
  type: {
    type: String,
    required: true,
  },
  fromDate: {
    type: Date
  },
  toDate: {
    type: Date,
  },
  reason: {
    type: String,
    required: true,
  },
  action: {
    type: String,
    enum: ["approve", "reject", "pending"],
    default: "pending",
  },
  rejectReason:{
    type:String
  },
 approveReason:{
    type:String
  },
  date:{
    type:Date,
  },
  toTime:{
    type:Date,
  },
  fromTime:{
type:Date,
  },
  sandwich:{
    type:Boolean,
    default:false
  },

  attachments: [
    {
      filename: String,
      data: Buffer,
    },
  ],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const employeeleave = mongoose.model("leavedata", leave);
export default employeeleave;
