// Import User ModelFrom Models/User.js
import { UserModel } from "../Models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie-parser";
// Controller for Creating new user
export const CreateUser = async function (req, res, next) {
  try {
    const { name, mobile, password, role } = req.body;
    if (!name || !mobile || !password)
      return res.status(500).json({
        success: false,
        message: "please enter all fields name , mobile ,and password",
      });
    // Create new User
    // Checking Mobile Number Length
    // if (mobile.length <= 0 && mobile.length > 10)
    // return res.status(400).json({
    // success: false,
    // message:
    // "Please Enter Valid Mobile Number it is less than or greater than 10 digit",
    // });
    // Checking Mobile Number
    const check = await UserModel.findOne({ mobile });
    if (check)
      return res.status(400).json({
        success: false,
        message: "Mobile Number Allready Registerd",
      });
    const hashedPass = await bcrypt.hash(password, 12);
    const newUser = await UserModel.create({
      name,
      mobile,
      password: hashedPass,
      role,
    });
    await newUser.save();
    const payroll = {
      name,
      mobile,
      role,
    };

    const token = await jwt.sign(payroll, process.env.Secret_key);
    // send response
    res.cookie("token", token).status(201).json({
      success: true,
      message: "User  Created Successfully",
      newUser,
      token,
    });
  } catch (error) {
    // send error message if got error
    console.log("error in create User API");
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// controller for all User route
export const allUser = async function (req, res, next) {
  try {
    const Users = await UserModel.find({});
    if (!Users)
      return res.status(500).json({
        success: false,
        message: "User is not founded",
      });

    res.status(200).json({
      success: true,
      message: "the list of users",
      Users,
    });
  } catch (error) {
    console.log("Error in All User API");
    res.status(500).json({
      success: false,
      message: `error in All User API ${error.message}`,
    });
  }
};

// controller for view a single User detail
export const viewSingleUser = async function (req, res) {
  try {
    // id which is passed as parameter in request
    const id = req.user._id;
    // finding Loan using these ID
    const User = await UserModel.findById(id);

    if (!User)
      return res.status(500).json({
        success: false,
        message: "can not find User for these ID please enter a valid ID",
      });

    res.status(200).json({
      success: true,
      message: "details of user",
      User,
    });
  } catch (error) {
    console.log("Error in Find User Details Single");
    res.status(500).json({
      success: false,
      message: `Error in Find Single User data  ${error.message}`,
    });
  }
};
// controller for all view details of User

export const updateUser = async function (req, res, next) {
  try {
    const id = req.user._id;
    // finding all User
    const { name, mobile, password, role } = req.body;
    const user = await UserModel.findById(id);
    if (!user)
      return res.status(500).json({
        success: false,
        message: "There in no User found for these id",
      });

    if (name) user.name = name;
    if (mobile) user.mobile = mobile;
    if (password) {
      const hashedPass = bcrypt.hash(password);
      user.password = hashedPass;
    }
    if (role) user.role = role;
    await user.save();
    const payroll = {
      name,
      mobile,
      role,
    };
    const token = await jwt.sign(payroll, process.env.Secret_key);
    res.cookie("token", token).status(200).json({
      success: true,
      message: "user Updated Succesfully",
      user,
      token,
    });
  } catch (error) {
    console.log("error in find all Loans API");
    res.status(500).json({
      success: false,
      message: `Error in find all Loans  ${error.message}`,
    });
  }
};

export const LoginUser = async function (req, res, next) {
  try {
    const { name, mobile } = req.body;
    if (!name || !mobile)
      return res.status(500).json({
        success: true,
        message: "please enter all fields name and mobile",
      });

    const user = await UserModel.find({ name, mobile });
    if (!user)
      return res.status(500).json({
        success: false,
        message: "user not exisst",
      });
    const payroll = {
      name,
      password: user.password,
      mobile,
      role: user.role,
    };
    const token = jwt.sign(payroll, process.env.Secret_key);

    res.cookie("token", token).status(200).json({
      success: true,
      message: "login succesfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error in Login API",
    });
  }
};

export const isAuth = async function (req, res, next) {
  try {
    const token = req.cookies.token;
    if (!token)
      return res.status(400).json({
        success: false,
        message: "Token Not Found",
      });
    const isValid = await jwt.verify(token, process.env.Secret_key);
    if (!isValid)
      return res.status(500).json({
        success: false,
        message: "you are not authenticated user",
      });
    req.user = await UserModel.findOne({ mobile: isValid.mobile });
    next();
  } catch (error) {
    console.log(error);
    {
      res.status(500).json({
        success: false,
        message: "error in validating user api",
      });
    }
  }
};

export const isAdmin = async function (req, res, next) {
  try {
    console.log(req.user);
    if (req.user.role == "admin") return next();
    else return res.status(403).json({ message: user });
  } catch (error) {
    console.log(error);
    {
      res.status(500).json({
        success: false,
        message: "Error in isAdmin API",
      });
    }
  }
};
