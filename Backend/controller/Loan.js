import mongoose from "mongoose";
import express from "express";
// Import Loan ModelFrom Models/Loan.js
import { LoanModel } from "../Models/Loan.js";

// Controller for Creating Loan
export const CreateLoan = async function (req, res, next) {
  try {
    const { amount, term, startDate } = req.body;
    if (!amount || !term || !startDate)
      return res.status(500).json({
        success: false,
        message: "please enter all fields amount , term ,and startDate",
      });
    //   generate repayment Schedule

    const repayments = Array.from({ length: term }, (_, i) => ({
      dueDate: new Date(
        new Date(startDate).setDate(new Date(startDate).getDate() + (i + 1) * 7)
      ),
      amount: Math.round((amount / term) * 100) / 100,
    }));

    // Create new loan
    const newLoan = new LoanModel({ amount, term, startDate, repayments });
    await newLoan.save();

    // send response
    res.status(201).json({
      success: true,
      newLoan,
    });
  } catch (error) {
    // send error message if got error
    console.log("error in create Loan API");
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// controller for Loan approve Route
export const approveLoan = async function (req, res, next) {};

// controller for view details of Loan

export const viewLoanDetails = async function (req, res, next) {};

// Controller for repayment Route

export const RepaymentsRoute = async function (req, res, next) {};
