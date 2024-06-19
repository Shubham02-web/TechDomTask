// Import mongoose model from mongoose
import mongoose from "mongoose";

// Schema Defining for Loan
const LoanSchema = mongoose.Schema(
  {
    //   field Loan Amount
    amount: {
      type: Number,
      required: true,
    },
    // field term for Loan Term in weeks
    term: {
      type: Number,
      required: true,
    },
    //   Field for starting date of Loan
    startDate: {
      type: Date,
    },
    //   field for loan state by default Pending
    state: {
      type: String,
      default: "PENDING",
      enum: ["PENDING", "APPROVED", "REJECTED", "PAID"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "UserModel",
    },
    //   Creating an array of Repayment Objects field
    repayments: [
      {
        dueDate: {
          type: Date,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        state: {
          type: String,
          default: "PENDING",
          enum: ["PENDING", "PAID"],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// creating and exporting Loan Model
export const LoanModel = mongoose.model("LoanModel", LoanSchema);
