import mongoose from "mongoose";
import express from "express";
import moment from "moment";
// Import Loan ModelFrom Models/Loan.js
import { LoanModel } from "../Models/Loan.js";

// Controller for Creating Loan
export const CreateLoan = async function (req, res, next) {
  try {
    const { amount, term, startDate } = req.body;
    if (!amount || !term || !startDate)
      return res.status(400).json({
        success: false,
        message: "please enter all fields amount , term & date",
      });
    // Validate startDate
    const today = moment().startOf("day");
    const selectedDate = moment(startDate);

    if (!selectedDate.isSameOrAfter(today)) {
      return res.status(400).json({
        success: false,
        message: "Start date must be today or a future date",
      });
    }

    //   generate repayment Schedule
    const user = req.user._id;
    const repayments = Array.from({ length: term }, (_, i) => ({
      dueDate: moment(startDate)
        .add(i * 7, "days")
        .toDate(),
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
      message: "New Loan requested Successfully",
      newLoan,
    });
  } catch (error) {
    // send error message if got error
    console.log(`error in request/create Loan API ${error.message}`);
    res.status(500).json({
      success: false,
      message: `Error in requesting for Loan ${error.message}`,
    });
  }
};

// controller for Loan approve Route
export const approveLoan = async function (req, res, next) {
  try {
    const { id } = req.params;
    const { state } = req.body;
    const loan = await LoanModel.findById(id);
    if (!loan)
      return res.status(500).json({
        success: false,
        message: "Loan is not found for these id Please enter valid id",
      });
    if (loan.state === "PAID")
      return res.status(400).json({
        success: false,
        message: "Loan has Allready Paid",
      });

    if (state == "APPROVED" && loan.state == "APPROVED")
      return res.status(500).json({
        success: false,
        message: "Your Loan has allready approved",
      });

    if (state == "REJECTED" && loan.state == "REJECTED")
      return res.status(500).json({
        success: false,
        message: "Your Loan has allready Rejected",
      });

    loan.state = state;
    await loan.save();

    res.status(200).json({
      success: true,
      message: `Your Loan ${state} Successfully`,
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
export const viewSingleUserLoan = async function (req, res) {
  try {
    // id which is passed as parameter in request
    console.log(req.user);
    const { _id } = req.user;
    console.log(_id);
    // finding Loan using these ID
    const Loan = await LoanModel.find({ user: _id });

    if (!Loan)
      return res.status(500).json({
        success: false,
        message: "can not find Loan for these ID please enter a valid ID",
      });

    res.status(200).json({
      success: true,
      message: `Loan Found Successfully`,
      Loan,
    });
  } catch (error) {
    console.log(`Error in Find Loan Details Single ${error.message}`);
    res.status(500).json({
      success: false,
      message: `Error in Find Single Loan data ${error.message}`,
    });
  }
};
// controller for all view details of Loan

export const viewLoanDetails = async function (req, res, next) {
  try {
    // finding all Loan
    const Loan = await LoanModel.find({}).populate("user");

    if (!Loan)
      return res.status(500).json({
        success: false,
        message: "There in no Loan",
      });

    res.status(200).json({
      success: true,
      message: "list of all Loans",
      Loan,
    });
  } catch (error) {
    console.log(`error in find all Loans API ${error.message}`);
    res.status(500).json({
      success: false,
      message: `Error in find all Loans ${error.message}`,
    });
  }
};

// Controller for repayment Route

export const RepaymentsRoute = async function (req, res, next) {
  try {
    const id = req.params.id;
    const { amount } = req.body;
    const Loan = await LoanModel.findById(id);
    if (!Loan) {
      return res.status(500).json({
        success: false,
        message: "Not found a Loan for this ID or Invalid ID",
      });
    }

    // Checking if the loan is already paid
    if (Loan.state === "PAID") {
      return res.status(200).json({
        success: true,
        message: "You have already paid your LOAN",
      });
    }

    // Checking if the loan is approved
    if (Loan.state !== "APPROVED") {
      return res.status(400).json({
        success: false,
        message:
          "The loan is not approved. You can only make repayments on approved loans.",
      });
    }

    // Find the next pending installment
    const nextInstallment = Loan.repayments.find((r) => r.state === "PENDING");
    if (!nextInstallment) {
      return res.status(500).json({
        success: false,
        message: "No pending installments found",
      });
    }

    // Total remaining amount of the loan
    const remainingAmount = Loan.repayments.reduce(
      (acc, repay) => acc + (repay.state === "PENDING" ? repay.amount : 0),
      0
    );

    // Check if the entered amount is less than the next installment amount
    if (amount < nextInstallment.amount) {
      return res.status(400).json({
        success: false,
        message: "The amount is less than the next installment due",
      });
    }

    // Check if the entered amount is greater than the remaining loan amount
    if (amount > remainingAmount) {
      return res.status(400).json({
        success: false,
        message: "The amount is greater than the total remaining loan amount",
      });
    }

    let remainingRepaymentAmount = amount;
    for (let repay of Loan.repayments) {
      if (repay.state === "PENDING") {
        if (remainingRepaymentAmount >= repay.amount) {
          remainingRepaymentAmount -= repay.amount;
          repay.state = "PAID";
          repay.amount = amount;
        } else {
          repay.amount -= remainingRepaymentAmount;
          remainingRepaymentAmount = 0;
          break; // Break the loop as the repayment amount is exhausted
        }
      }
    }

    // Check if all repayments are paid, then mark the loan as PAID
    const allPaid = Loan.repayments.every((r) => r.state === "PAID");
    if (allPaid) {
      Loan.state = "PAID";
    }

    await Loan.save();
    res.status(200).json({
      success: true,
      message: `Repayment Succesful of amount  ${amount}`,
      Loan,
    });
  } catch (error) {
    console.log("Error in Repayment API", error);
    res.status(500).json({
      success: false,
      message: `Error in Repayment API: ${error.message}`,
    });
  }
};
