// Import express and creating express Router
import express from "express";
const router = express.Router();
// accessing Controllers
import {
  CreateLoan,
  RepaymentsRoute,
  approveLoan,
  viewLoanDetails,
} from "../controller/Loan.js";

// route for creating Loan /api/loan/create
router.post("/create", CreateLoan);

// route for approve loan
router.patch("/approve/:id", approveLoan);

// route for repayment
router.post("/repayment/:id", RepaymentsRoute);

// route for viewLoan Details
router.get("/viewLoan", viewLoanDetails);

// Exporting Route
module.exports = router;
