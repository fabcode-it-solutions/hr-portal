import mongoose from "mongoose";
const schema = mongoose.Schema;

const departmentData = new schema({
  department: {
    type: String,
    required: true,
    unique:true
  },
  departmentHead: {
    type: String,
    required: true,
  },
});

const department = mongoose.model("department", departmentData);
export default department;
