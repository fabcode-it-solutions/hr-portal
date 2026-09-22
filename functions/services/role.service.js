import Role from "../schemas/role.schema.js";

async function addData(data) {
  try {
    const { roleName, roleValue } = data;
    if (!roleName || !roleValue) {
      return { message: "Please provide required fields" };
    }
    const roleCheck = await Role.findOne({ roleName });
    const valueCheck = await Role.findOne({ roleValue });
    if (roleCheck) {
      return { status: 409, message: "Role is already exist" };
    }

    if(valueCheck){
      return { status: 409, message: "Value is assign to other role" };
    }

    const roleData = new Role({
      roleName,
      roleValue,
    });

    const roles = await roleData.save();
    return { message: "Role Added sucessfully", roles };
  } catch (error) {
    return { message: "Error", error };
  }
}

async function updateData(_id, data) {
  try {
    const { roleName, roleValue } = data;
    const roleCheck = await Role.findOne({ roleName, _id: { $ne: _id } });
    const valueCheck = await Role.findOne({ roleValue, _id: { $ne: _id } });
    
    if (roleCheck) {
      return { status: 409, message: "Role already exists" };
    }
    
    if (valueCheck) {
      return { status: 409, message: "Value is assigned to another role" };
    }
    const update = await Role.findByIdAndUpdate(
      _id,
      {
        roleName,
        roleValue,
      },
      {
        new: true,
      }
    );
 
    
    if (!update) {
      return { message: "Data not found" };
    } 
    else {
      return { message: "Data Updated Sucessfully", update };
    }
  } catch (error) {
    return { message: "Error", error };
  }
}

async function deleteData(_id) {
  try {
    const deleted = await Role.findByIdAndDelete(_id);
    if (!deleted) {
      return { message: "Data not found" };
    } else {
      return { message: "Data Deleted Succesfully", deleted };
    }
  } catch (error) {
    return { message: "Error", error };
  }
}

async function getData() {
  try {
    const data = await Role.find();
    return { message: "Roles data", data };
  } catch (error) {
    return { message: "Error", error };
  }
}
export default { addData, updateData, deleteData, getData };
