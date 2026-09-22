import bcrypt from "bcryptjs";
import User from "../schemas/user.schema.js";

//Employee Register
async function employeeRegister(userData) {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      employeeType,
      designation,
      department,
      salary,
      joinDate,
      isPasswordSet,
      gender,
      userType,
      personalEmail,
      incrementDate,
      dob,
    } = userData;

    if (
      !firstName ||
      !email ||
      !password ||
      !employeeType ||
      !designation ||
      !department ||
      !gender ||
      !isPasswordSet ||
      !joinDate
    ) {
      return { message: "Please provide required fields" };
    }

    const useremail = await User.findOne({ email });
    if (useremail) {
      return { message: "Email already exist" };
    }

    const hashedPassword = await bcrypt.hash(password, 3);
    const employeeData = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      employeeType,
      designation,
      department,
      joinDate,
      gender,
      salary,
      isPasswordSet,
      incrementDate,
      userType,
      dob,
      personalEmail: email,
    });

    const saveUser = await employeeData.save();
    return { message: "User Registered Sucessfully", saveUser };
  } catch (err) {
    console.log(err);
    return { message: "Error", err };
  }
}

//Edit Employee
async function employeeUpdate(_id, data) {
  const {
    firstName,
    lastName,
    email,
    employeeType,
    salary,
    address,
    designation,
    incrementDate,
    department,
    joinDate,
    phoneNumber,
    personalEmail,
    gender,
    accountNo,
    emergencyNo,
    password,
    ifsc,
    status,
    dob,
    totalSandwich,
    totalLeave
  } = data;

  let hashedPassword;

  if (password !== undefined) {
    hashedPassword = await bcrypt.hash(password, 2);
  }

  try {
    const updatedData = await User.findByIdAndUpdate(
      _id,
      {
        firstName,
        lastName,
        email,
        employeeType,
        salary,
        address,
        designation,
        department,
        joinDate,
        phoneNumber,
        gender,
        personalEmail,
        accountNo,
        status,
        incrementDate,
        emergencyNo,
        password: hashedPassword,
        ifsc,
        dob,
        totalSandwich,
        totalLeave
      },
      { new: true }
    );

    if (!updatedData) {
      return { message: "Data not found" };
    } else {
      return { message: "Data Updated Successfully", updatedData };
    }
  } catch (error) {
    console.error("Update Error:", error);
    return { message: "Error", error };
  }
}

// Update Employee Status with adding last working day

async function updateEmployeeEndDateAndStatus(_id, endDate) {
  try {
    const updatedData = await User.findByIdAndUpdate(
      { _id },
      {
        endDate,
        status: false,
      },
      { new: true }
    );

    if (!updatedData) {
      return { message: "Data not found" };
    } else {
      return {
        message: "Employee End Date and Status Updated Successfully",
        updatedData,
      };
    }
  } catch (error) {
    console.error("Update Error:", error);
    return { message: "Error", error };
  }
}

//Delete Employee
async function employeeDelete(id) {
  try {
    const Deleted = await User.findByIdAndDelete({ _id: id });
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

//User data
async function userInfo(data) {
  try {
    const { userType, email } = data;
    const query = {
      userType,
      email,
    };
    const userData = await User.find(query);
    return { message: "User Information", userData };
  } catch (err) {
    console.log("Error:", err);
    return { message: "Error", err };
  }
}

async function employeeNum(data) {
  try {
    let query;
    const { gender } = data;
    if (gender === "all") {
      query = {
        userType: 1,
      };
    } else {
      query = {
        userType: 1,
        gender,
      };
    }
    const userData = await User.find(query);
    const employeeValue = userData.length;
    return { employeeValue };
  } catch (err) {
    console.log("Error:", err);
    return { message: "Error", err };
  }
}

//Employee Information for admin
async function employeeInfo(data) {
  try {
    const { employeeType } = data;
  let query;
      if (employeeType === "all") {
        query = {
          userType: 1,
        };
      } else {
        query = {
          userType: 1,
          employeeType,
        };
      }
   
    const userData = await User.find(query).sort({ createdAt: -1 });
    return { message: "User Information", userData };
  } catch (err) {
    console.log("Error:", err);
    return { message: "Error", err };
  }
}

async function updatePassword(email, password) {
  try {
    const hashedPassword = await bcrypt.hash(password, 2);
    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword, isPasswordSet: true },
      { new: true }
    );
    return { message: "Password updated successfully" };
  } catch (error) {
    throw error;
  }
}

const updateUserImageByEmail = async (email, userImg) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { $set: { userImg } },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error("User not found");
    }

    return updatedUser;
  } catch (error) {
    throw new Error("Error updating user image");
  }
};

export default {
  employeeRegister,
  employeeUpdate,
  employeeDelete,
  userInfo,
  employeeInfo,
  updateEmployeeEndDateAndStatus,
  updatePassword,
  employeeNum,
  updateUserImageByEmail,
};
