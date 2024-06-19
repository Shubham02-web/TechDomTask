// Import User ModelFrom Models/User.js
import { UserModel } from "../Models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();
// Controller for Creating new user
const createToken = (payload) => {
  return jwt.sign(payload, process.env.Secret_key, {
    expiresIn: "5h",
  });
};

export const CreateUser = async function (req, res, next) {
  try {
    const { name, mobile, password, role } = req.body;
    if (!name || !mobile || !password)
      return res.status(500).json({
        success: false,
        message: "please enter all fields name , mobile ,and password",
      });
    // Checking Mobile Number
    // Validate mobile number length
    // console.log(mobile);
    if (mobile.length !== 10) {
      return res.status(400).json({
        success: false,
        message: `Please enter a valid mobile number of 10 digits that is ${mobile.length} digit `,
      });
    }
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
    const payload = {
      name: newUser.name,
      mobile: newUser.mobile,
    };

    const token = jwt.sign(payload, process.env.Secret_key);
    // send response
    res.cookie("token", token, { httpOnly: true });
    res.status(201).json({
      success: true,
      message: "User  Created Successfully",
      newUser,
      token,
    });
  } catch (error) {
    // send error message if got error
    console.log(`error in create User API ${error}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// controller for all User route
export const allUser = async function (req, res, next) {
  try {
    const newUser = await UserModel.find({});
    if (!newUser)
      return res.status(500).json({
        success: false,
        message: "User is not founded",
      });

    res.status(200).json({
      success: true,
      message: "the list of users",
      newUser,
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
    const newUser = await UserModel.findById(id);

    if (!newUser)
      return res.status(500).json({
        success: false,
        message: "can not find User for these ID please enter a valid ID",
      });

    res.status(200).json({
      success: true,
      message: "details of user",
      newUser,
    });
  } catch (error) {
    console.log(`Error in Find User Details Single ${error.message}`);
    res.status(500).json({
      success: false,
      message: `Error in Find Single User data  ${error.message}`,
    });
  }
};
// controller for all view details of User

export const updateUser = async function (req, res, next) {
  try {
    const id = req.user.id;
    // finding all User
    const { name, mobile, password, role } = req.body;
    const newUser = await UserModel.findById(id);
    if (!newUser)
      return res.status(500).json({
        success: false,
        message: "There in no User found for these id",
      });

    if (name) newUser.name = name;
    if (mobile) newUser.mobile = mobile;
    if (password) {
      const hashedPass = bcrypt.hash(password);
      newUser.password = hashedPass;
    }
    if (role) user.role = role;
    await newUser.save();
    const payload = {
      name: newUser.name,
      mobile: newUser.mobile,
    };
    const token = await jwt.sign(payload, process.env.Secret_key);
    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({
      success: true,
      message: "user Updated Succesfully",
      newUser,
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

    if (mobile.length !== 10) {
      return res.status(400).json({
        success: false,
        message: `Please enter a valid mobile number of 10 digits that is ${mobile.length} digit `,
      });
    }
    const newUser = await UserModel.findOne({ mobile });
    if (!newUser)
      return res.status(500).json({
        success: false,
        message: "user not exisst",
      });
    const payload = {
      name,
      mobile,
    };
    const token = await jwt.sign(payload, process.env.Secret_key);
    console.log(token);
    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({
      success: true,
      message: "login succesfully",
      token,
      newUser,
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
    const dec = await jwt.verify(token, process.env.Secret_key);
    req.user = await UserModel.findOne({ mobile: dec.mobile });
    console.log(req.user);
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
    console.log(req.user.role);
    if (req.user.role === "admin") return next();
    else return res.status(403).json({ message: req.user.id });
  } catch (error) {
    console.log(error.message);
    {
      res.status(500).json({
        success: false,
        message: "Error in isAdmin API",
      });
    }
  }
};
