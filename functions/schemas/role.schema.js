import mongoose, { Schema } from "mongoose";
const schema = mongoose.Schema;

const role = new schema({
  roleName: {
    type: String,
    required: true,
  },
  roleValue: {
    type: Number,
    required: true,
  },
});

const Roles = mongoose.model("Role", role);
export default Roles;
