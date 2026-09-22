import bcrypt from "bcryptjs";
import User from "../schemas/user.schema.js";

//User login
async function userLogin(loginData) {
  try {
    const { email, password } = loginData;
    if (!email || !password) {
      return { message: "Please provide valid email and password" };
    }

    const user = await User.findOne({ email });
    if (!user) {
      return { message: "Email does not exist" };
    }
    if(!user.status) {
      return {message : "User no longer exists now."}
    }

    if (!user.isVerified && user.userType === 0 ) {
      return {
        status: 403,
        message:
          "Email not verified. Please complete the verification process.",
      };
    }
 

    const match = await bcrypt.compare(password, user.password);

    if(!user.isPasswordSet && match && user.userType===1 ) {
      return {
       user: user.email,
        status: 407,
        message:
          "Update your password first to continue.",
      };
    }

    if (match) {
      return { message: "Logged In Sucessfully", user };
    } else {
      return { message: "Wrong Password" };
    }

   
  } catch (e) {
    console.log("err", e);
    return { message: "Error", e };
  }
}

export default { userLogin };
