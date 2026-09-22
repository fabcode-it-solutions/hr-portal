import Department from "../schemas/department.schema.js";
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

async function departmentDetail(data) {
  try {
    const { department, departmentHead } = data;

    if (!department || !departmentHead) {
      return { message: "Please provide Department Name and Head Name" };
    }
    const departments = await Department.findOne({ department });
    if (departments) {
      return {status: 409, message: "Department already added" };
    }

    const departmentData = new Department({
      department,
      departmentHead,
    });

    const savedData = await departmentData.save();
    return { message: "Department Added Successfully", savedData };
  } catch (error) {
    console.log(error);
    return { message: "error", error };
  }
}

async function allData() {
  try {
    
    const userData = await Department.aggregate([
      {
        $lookup: {
          from: "users",
          localField:"department",
          foreignField:"department",
          as: "Data",
        }
      }
    
    ]);
    return { message: "User Information", userData };
  } catch (err) {
    console.log("Error:", err);
    return { message: "Error", err };
  }
}

//Update Department
async function departmentUpdate(_id, data) {
  const {department,departmentHead} = data;
  const departments = await Department.findOne({ department, _id: { $ne: _id } });
  if (departments) {
    return {status: 409, message: "Department already added" };
  }
  try {
    const updatedData = await Department.findByIdAndUpdate(
      { _id },
      {department,departmentHead },
      { new: true }
    );

    if (!updatedData) {
      return { message: "Data not found" };
    } 
      return { message: "Data Updated Succesfully", updatedData };
    
  } catch (error) {
    console.error("Update Error:", error);
    return { message: "Error", error };
  }
}

//Delete Department
async function departmentDelete(id) {
  try {
    const Deleted = await Department.findByIdAndDelete({ _id: id });
    if (!Deleted) {
      return { message: "Data not found" };
    } else {
      return { message: "Data Deleted Succesfully", Deleted };
    }
  } catch (error) {
    console.error("Error:", error);
    return { message: "Error", error };
  }
}


export default { departmentDetail, allData ,departmentUpdate,departmentDelete};
