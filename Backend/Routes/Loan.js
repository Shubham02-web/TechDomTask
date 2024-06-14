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

// route for creating Loan /api/loan/create
router.post("/create", CreateLoan);

// route for approve loan
router.patch("/approve/:id", approveLoan);

// route for repayment
router.post("/repayment/:id", RepaymentsRoute);

// route for viewLoan Details
router.get("/AllLoan", viewLoanDetails);

// route for single Loan Detailss
router.get("/viewLoan/:id", viewSingleLoan);

// Exporting Route
