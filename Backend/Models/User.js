import mongoose from "mongoose";

// Schema Defining for Loan
const UserSchema = new mongoose.Schema(
  {
    //   field Loan Amount
    name: {
      type: String,
    },
    // field term for Loan Term in weeks
    mobile: {
      type: Number,
      unique: true,
    },
    //   Field for starting date of Loan
    password: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
      enum: ["admin", "user"],
    },
  },
  { timestamps: true }
);
//   Creating an array of Repayment Objects field
// creating and exporting Loan Model
export const UserModel = mongoose.model("UserModel", UserSchema);
