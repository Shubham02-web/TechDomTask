import mongoose from "mongoose";
import express from "express";
// Import Loan ModelFrom Models/Loan.js
import { LoanModel } from "../Models/Loan.js";

// Controller for Creating Loan
export const CreateLoan = async function (req, res, next) {
  try {
    const { amount, term, startDate } = req.body;
    if (!amount || !term || !startDate)
      return res.status(400).json({
        success: false,
        message: "please enter all fields amount , term ,and startDate",
      });
    //   generate repayment Schedule
    const user = req.user._id;
    const repayments = Array.from({ length: term }, (_, i) => ({
      dueDate: new Date(
        new Date(startDate).setDate(new Date(startDate).getDate() + (i + 1) * 7)
      ),
      amount: Math.round((amount / term) * 100) / 100,
    }));
    // const user = req.user._id;
    // Create new loan
    const newLoan = new LoanModel({
      amount,
      term,
      startDate,
      repayments,
      user,
    });
    await newLoan.save();

    // send response
    res.status(201).json({
      success: true,
      message: "New Loan request Successfully",
      newLoan,
    });
  } catch (error) {
    // send error message if got error
    console.log(`error in request/create Loan API ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// controller for Loan approve Route
export const approveLoan = async function (req, res, next) {
  try {
    const id = req.params.id;
    const loan = await LoanModel.findById(id);
    if (!loan)
      return res.status(500).json({
        success: false,
        message: "Loan is not found for these id Please enter valid id",
      });
    if (loan.state === "APPROVED")
      return res.status(500).json({
        success: false,
        message: "Your Loan has allready approved",
      });
    loan.state = "APPROVED";
    await loan.save();

    res.status(200).json({
      success: true,
      message: "Your Loan Approved Successfully",
      loan,
    });
  } catch (error) {
    console.log("Error in Loan Approved API");
    res.status(500).json({
      success: false,
      message: `error in Loan Approved API ${error.message}`,
    });
  }
};

// controller for view a single loan detail
export const viewSingleLoan = async function (req, res) {
  try {
    // id which is passed as parameter in request
    const id = req.user._id;
    // finding Loan using these ID
    const Loan = await LoanModel.find({ user: id });

    if (!Loan)
      return res.status(500).json({
        success: false,
        message: "can not find Loan for these ID please enter a valid ID",
      });

    res.status(200).json({
      success: true,
      Loan,
    });
  } catch (error) {
    console.log("Error in Find Loan Details Single");
    res.status(500).json({
      success: false,
      message: `Error in Find Single Loan data  ${error.message}`,
    });
  }
};
// controller for all view details of Loan

export const viewLoanDetails = async function (req, res, next) {
  try {
    // finding all Loan
    const Loans = await LoanModel.find({});
    if (!Loans)
      return res.status(500).json({
        success: false,
        message: "There in no Loan",
      });

    res.status(200).json({
      success: true,
      message: "list of all Loans",
      Loans,
    });
  } catch (error) {
    console.log("error in find all Loans API");
    res.status(500).json({
      success: false,
      message: `Error in find all Loans  ${error.message}`,
    });
  }
};

// Controller for repayment Route

export const RepaymentsRoute = async function (req, res, next) {
  try {
    const id = req.params.id;
    const { amount } = req.body;
    const Loan = await LoanModel.findById(id);
    if (!Loan)
      return res.status(500).json({
        success: false,
        message: "Not found an Loan for these Id Or Invalid ID",
      });

    // Checking amount of Loan Repayment

    //   Checking if allready paid
    if (Loan.state === "PAID") {
      return res.status(200).json({
        success: true,
        message: "You have allready paid your LOAN",
      });
    }
    //   finding and checking loan state and amount
    const repay = Loan.repayments.find(
      (r) => r.state === "PENDING" && r.amount <= amount
    );
    if (Loan.amount > amount) {
      return res.status(500).json({
        success: false,
        message: "installment  is grater than your amount",
      });
    }
    if (repay) {
      // make state PAID from PENDING
      repay.state = "PAID";

      //   CHECK EVERY INSTALLMENT STATE IF IT IS PAID THEN SET LOAN PAID FROM PENDING
      const every = Loan.repayments.every((r) => r.state === "PAID");
      if (every) Loan.state = "PAID";

      await Loan.save();
      res.status(200).json({
        success: true,
        message: "You have succesfully paid your Installment",
        Loan,
      });
    } else {
      res.status(400).json({
        success: true,
        message: "Invalid Amount For Repayment or Installment",
      });
    }
  } catch (error) {
    console.log("Error in Repayment API");
    res.status(500).json({
      success: false,
      message: `error in Repayment API ${error.message}`,
    });
  }
};
