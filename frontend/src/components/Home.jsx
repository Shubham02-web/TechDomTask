import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";
import { Button, Table } from "rsuite";
import Column from "rsuite/esm/Table/TableColumn";
import { Cell, HeaderCell } from "rsuite-table";
import ViewTerms from "./ViewTerms";
import Navbar from "./Header";

const Home = () => {
  const [Loans, setLoans] = useState([]);
  const { newUser, setLoggedIn, setNewUser } = useContext(AuthContext);
  // eslint-disable-next-line no-unused-vars
  const [showDetails, updateShowDetails] = useState("-1");
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  const fetchLoans = async () => {
    try {
      const loanData = await axios.get(
        "http://localhost:5000/api/loan/AllLoan"
      );
      console.log(loanData);
      setLoans(loanData.data.Loans);
      console.log(loanData.data.Loans);
    } catch (err) {
      if (err.name === "AxiosError") {
        console.log(err.response.data.message);
        return alert(err.response.data.message);
      }

      console.error(err);
      alert(`Can't fetch the loans\nError: ${err}`);
    }
  };
  axios.defaults.withCredentials = true;

  axios.defaults.withCredentials = true;
  // eslint-disable-next-line no-unused-vars
  const updatePayment = async (loanId, repaymentId) => {
    try {
      await axios.post(`http://localhost:5000/api/loan/repayment/${loanId}`, {
        repaymentId,
      });
      alert("Paid the installment");
      window.location.reload(false); // Consider a better approach to update UI (state)
      navigate("/");
    } catch (error) {
      if (error.name === "AxiosError") {
        console.log(error.response.data.message);
        return alert(error.response.data.message);
      }
      console.error(error);
      alert(`Can't pay installment!\nError:${error}`);
    }
  };
  useEffect(() => {
    fetchLoans();
  }, []);

  //  view all terms drawer
  const [terms, setTerms] = useState([]);
  const [userIdCheck, setUserIdCheck] = useState([]);
  const [open, setOpen] = useState(false);

  return (
    <div>
      <Navbar />
      <Table
        className="m-5"
        bordered
        data={Loans || []}
        onRowClick={(rowData) => {
          setOpen(true);
          setTerms(rowData.repayments);
          setUserIdCheck(rowData._id);
        }}
      >
        <Column width={250} align="center" fixed>
          <HeaderCell>Loan ID</HeaderCell>
          <Cell dataKey="_id" />
        </Column>

        <Column width={300}>
          <HeaderCell>User ID</HeaderCell>
          <Cell dataKey="user._id" />
        </Column>

        <Column width={300}>
          <HeaderCell>User Name</HeaderCell>
          <Cell dataKey="user.name" />
        </Column>

        <Column width={250}>
          <HeaderCell>Mobile Number</HeaderCell>
          <Cell dataKey="user.mobile" />
        </Column>

        <Column width={150}>
          <HeaderCell>Loan Amount</HeaderCell>
          <Cell dataKey="amount" />
        </Column>

        <Column width={150}>
          <HeaderCell>Term (In Week)</HeaderCell>
          <Cell dataKey="term" />
        </Column>

        <Column width={300}>
          <HeaderCell>Loan Request Date</HeaderCell>
          <Cell dataKey="startDate" />
        </Column>

        <Column>
          <HeaderCell>Loan Status</HeaderCell>
          <Cell dataKey="state" />
        </Column>

        <Column width={100} fixed="right">
          <HeaderCell>Action</HeaderCell>
          <Cell style={{ padding: "6px" }}>
            {(rowData) => (
              <Button
                appearance="link"
                onClick={() => {
                  setOpen(true);
                  setTerms(rowData.repayments);
                }}
              >
                View Terms
              </Button>
            )}
          </Cell>
        </Column>
      </Table>
      <br />
      <a href="/CreateLoan" className="text-blue-500">
        Create New Loan +
      </a>{" "}
      <ViewTerms
        open={open}
        setOpen={setOpen}
        terms={terms}
        userIdCheck={setUserIdCheck}
      />
    </div>
  );
};

export default Home;
