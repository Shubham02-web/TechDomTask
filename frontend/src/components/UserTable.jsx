import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Button, Drawer, Table, Input, Modal, Form, Tag } from "rsuite";
import { AuthContext } from "../App";
import Column from "rsuite/esm/Table/TableColumn";
import { Cell, HeaderCell } from "rsuite-table";
import moment from "moment";

const UserTable = () => {
  const [loan, setLoan] = useState([]);
  const [repayments, setRepayments] = useState([]);
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [open, setOpen] = useState(false);
  const [repaymentOpen, setRepaymentOpen] = useState(false);
  const [repaymentDetails, setRepaymentDetails] = useState({
    amount: null,
    state: "PENDING",
  });
  const { newUser } = useContext(AuthContext);
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [loading, setLoading] = useState(false);
  const [totalLoanAmount, setTotalLoanAmount] = useState(0);
  const [totalPaidAmount, setTotalPaidAmount] = useState(0);
  const [totalRemainingAmount, setTotalRemainingAmount] = useState(0);
  const [repaymentsId, setRepaymentsId] = useState(null);

  axios.defaults.withCredentials = true;

  const fetchLoans = async () => {
    try {
      setLoading(true);
      let response = await axios.get(
        `${process.env.REACT_APP_HOST_URL}/api/loan/viewLoan`
      );
      setLoading(false);
      setLoan(response.data.Loan);

      const loans = response.data.Loan;
      console.log(response.data.Loan);
      const totalAmount = loans.reduce((acc, loan) => acc + loan.amount, 0);
      setTotalLoanAmount(totalAmount);

      const paidAmount = loans.reduce(
        (acc, loan) =>
          acc +
          loan.repayments.reduce(
            (acc, repayment) =>
              acc + (repayment.state === "PAID" ? repayment.amount : 0),
            0
          ),
        0
      );
      setTotalPaidAmount(paidAmount);

      const remainingAmount = totalAmount - paidAmount;
      setTotalRemainingAmount(remainingAmount);
    } catch (error) {
      setLoading(false);
      console.error(error.response.data.message);
      alert(`having problem to load data \nplease refresh the page`);
    }
  };

  const handleRepaymentSubmit = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_HOST_URL}/api/loan/repayment/${selectedLoanId}`,
        repaymentDetails
      );
      alert("Repayment successful");
      setRepaymentOpen(false);
      fetchLoans();
    } catch (error) {
      console.error(error);
      alert(`${error.response.data.message}`);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  const handleRowClick = (rowData) => {
    setSelectedLoanId(rowData._id);
    setRepayments(rowData.repayments);
    setOpen(true);
  };

  const getData = () => {
    if (sortColumn && sortType) {
      return loan.sort((a, b) => {
        let x = a[sortColumn];
        let y = b[sortColumn];
        if (typeof x === "string") {
          x = x.charCodeAt();
        }
        if (typeof y === "string") {
          y = y.charCodeAt();
        }
        if (sortType === "asc") {
          return x - y;
        } else {
          return y - x;
        }
      });
    }
    return loan;
  };

  const handleSortColumn = (sortColumn, sortType) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSortColumn(sortColumn);
      setSortType(sortType);
    }, 500);
  };

  return (
    <>
      <div className="m-8 mb-8 font-semibold flex gap-10 items-center">
        <h4>Total Amount: {totalLoanAmount}</h4>
        <h4>Paid Amount: {totalPaidAmount}</h4>
        <h4>Remaining Amount: {totalRemainingAmount}</h4>
      </div>
      <Table
        className="m-5 mt-3 cursor-pointer"
        bordered
        loading={loading}
        sortColumn={sortColumn}
        sortType={sortType}
        onSortColumn={handleSortColumn}
        virtualized
        height={300}
        data={getData()}
        onRowClick={handleRowClick}
      >
        <Column width={250} align="center" fixed>
          <HeaderCell>Loan ID</HeaderCell>
          <Cell dataKey="_id" />
        </Column>
        <Column width={150} sortable>
          <HeaderCell>Loan Amount</HeaderCell>
          <Cell>{(rowData) => `$${rowData.amount}`}</Cell>
        </Column>
        <Column width={150}>
          <HeaderCell>Term (In Week)</HeaderCell>
          <Cell dataKey="term" />
        </Column>
        <Column width={300} sortable>
          <HeaderCell>Loan Request Date</HeaderCell>
          <Cell>
            {(rowData) => `${moment(rowData.startDate).format("ll")}`}
          </Cell>
        </Column>
        <Column sortable>
          <HeaderCell>Loan Status</HeaderCell>
          <Cell>
            {(rowData) => (
              <Tag color={rowData.state === "APPROVED" ? "green" : "red"}>
                {rowData.state}
              </Tag>
            )}
          </Cell>
        </Column>
        <Column width={250}>
          <HeaderCell>Check dueDates</HeaderCell>
          <Cell>Click Me</Cell>
        </Column>
      </Table>
      {selectedLoanId && (
        <Drawer size="sm" open={open} onClose={() => setOpen(false)}>
          <Drawer.Header>
            <Drawer.Title>Loan Repayment Details</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <Table bordered data={repayments}>
              <Column align="center" fixed>
                <HeaderCell>Repayment ID</HeaderCell>
                <Cell dataKey="_id" />
              </Column>
              <Column>
                <HeaderCell>Due Date</HeaderCell>
                <Cell>
                  {(rowData) => `${moment(rowData.dueDate).format("ll")}`}
                </Cell>
              </Column>
              <Column>
                <HeaderCell>Installment Amount</HeaderCell>
                <Cell>{(rowData) => `$${rowData.amount}`}</Cell>
              </Column>
              <Column width={200}>
                <HeaderCell>Payment Status</HeaderCell>
                <Cell>
                  {(rowData) => (
                    <Tag color={rowData.state === "PENDING" ? "yellow" : "red"}>
                      {rowData.state}
                    </Tag>
                  )}
                </Cell>
              </Column>
            </Table>
            <Button appearance="primary" onClick={() => setRepaymentOpen(true)}>
              Add Repayment
            </Button>
          </Drawer.Body>
        </Drawer>
      )}
      <Modal open={repaymentOpen} onClose={() => setRepaymentOpen(false)}>
        <Modal.Header>
          <Modal.Title>Add Repayment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form fluid>
            <Form.Group controlId="amount">
              <Form.ControlLabel>Amount</Form.ControlLabel>
              <Input
                type="number"
                onChange={(value) =>
                  setRepaymentDetails({ ...repaymentDetails, amount: value })
                }
                block
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleRepaymentSubmit} appearance="primary">
            Submit
          </Button>
          <Button onClick={() => setRepaymentOpen(false)} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserTable;
