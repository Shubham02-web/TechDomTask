// Import express and creating express Router
import express from "express";
export const router = express.Router();
// accessing Controllers
import {
  CreateLoan,
  RepaymentsRoute,
  approveLoan,
  viewLoanDetails,
  viewSingleLoan,
} from "../controller/Loan.js";
import { isAdmin, isAuth } from "../controller/User.js";

// route for repayment
router.post("/repayment/:id", isAuth, RepaymentsRoute);

// route for creating Loan /api/loan/create
router.post("/create", isAuth, CreateLoan);

// route for approve loan
router.patch("/approve/:id", isAuth, isAdmin, approveLoan);

// route for viewLoan Details
router.get("/AllLoan", isAuth, isAdmin, viewLoanDetails);

// route for single Loan Detailss
router.get("/viewLoan/:id", isAuth, viewSingleLoan);

// Exporting Route
export default router;
