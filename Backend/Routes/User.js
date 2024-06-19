// Import express and creating express Router
import express from "express";
import {
  CreateUser,
  LoginUser,
  allUser,
  isAdmin,
  isAuth,
  updateUser,
  viewSingleUser,
} from "../controller/User.js";
export const router = express.Router();
// accessing Controllers

// route for login user
router.post("/login", LoginUser);

// route for creating User /api/User/create
router.post("/create", CreateUser);

// route for updating user details
router.put("/updateuser", isAuth, updateUser);

// router.get("/auth", isAuth);
// route for view Users Details
router.get("/alluser", isAuth, isAdmin, allUser);

// route for single Loan Detailss
router.get("/viewuser", isAuth, viewSingleUser);

// Exporting Route
export default router;
