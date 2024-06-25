import axios from "axios";
import { useEffect, useState } from "react";
import { Button, Drawer, Table, Tag } from "rsuite";
import Column from "rsuite/esm/Table/TableColumn";
import moment from "moment";
import { Cell, HeaderCell } from "rsuite-table";
const AdminTable = () => {
  const [loan, setLoan] = useState([]);
  const [terms, setTerms] = useState([]);
  const [selectedLoanId, setSelectedLoanId] = useState(null);
  const [open, setOpen] = useState(false);
  const [sortColumn, setSortColumn] = useState();
  const [sortType, setSortType] = useState();
  const [loading, setLoading] = useState(false);

  const [totalLoans, setTotalLoans] = useState(0);
  const [approvedLoans, setApprovedLoans] = useState(0);
  const [rejectedLoans, setRejectedLoans] = useState(0);
  const [pendingLoans, setPendingLoans] = useState(0);

  const fetchLoans = async () => {
    try {
      setLoading(true);
      let response = await axios.get(
        `${process.env.REACT_APP_HOST_URL}/api/loan/AllLoan`
      );
      setLoading(false);
      console.log(response);
      setLoan(response.data.Loan);

      const loans = response.data.Loan;
      setTotalLoans(loans.length);
      setApprovedLoans(
        loans.filter((loan) => loan.state === "APPROVED").length
      );
      setRejectedLoans(
        loans.filter((loan) => loan.state === "REJECTED").length
      );
      setPendingLoans(loans.filter((loan) => loan.state === "PENDING").length);
    } catch (error) {
      setLoading(false);
      alert(`loading Loan Details \n please refresh the page`);
    }
  };
  const updateStatus = async (id, status) => {
    try {
      await axios.patch(
        `${process.env.REACT_APP_HOST_URL}/api/loan/approve/${id}`,
        {
          state: status,
        }
      );
      alert(`Updated the loan status to ${status}`);
      fetchLoans(); // Refresh data
      setOpen(false); // Close the drawer
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
    }
  };
  useEffect(() => {
    fetchLoans();
  }, []);

  const handleRowClick = (rowData) => {
    setTerms(rowData.repayments);
    setSelectedLoanId(rowData._id);
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
      <div className=" m-8 mb-8 font-semibold flex  gap-10 items-center">
        <h4>Total Loans: {totalLoans}</h4>
        <h4>Approved Loans: {approvedLoans}</h4>
        <h4>Rejected Loans: {rejectedLoans}</h4>
        <h4>Pending Loans: {pendingLoans}</h4>
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
          <Cell dataKey="_id" className="hover:underline  text-blue-700" />
        </Column>
        <Column width={250}>
          <HeaderCell>User Name</HeaderCell>
          <Cell dataKey="user.name" />
        </Column>
        <Column width={250}>
          <HeaderCell>Mobile Number</HeaderCell>
          <Cell dataKey="user.mobile" />
        </Column>
        <Column width={150} sortable>
          <HeaderCell>Loan Amount</HeaderCell>
          <Cell dataKey="amount">{(rowData) => `$${rowData?.amount}`}</Cell>
        </Column>
        <Column width={150} sortable>
          <HeaderCell>Term (In Week)</HeaderCell>
          <Cell dataKey="term" />
        </Column>
        <Column width={300} sortable>
          <HeaderCell>Loan Request Date</HeaderCell>
          <Cell dataKey="startDate">
            {(rowData) => `${moment(rowData?.startDate).format("ll")}`}
          </Cell>
        </Column>
        <Column sortable>
          <HeaderCell>Loan Status</HeaderCell>
          <Cell dataKey="state">
            {(rowData) => (
              <Tag color={rowData.state === "APPROVED" ? "green" : "red"}>
                {rowData.state}
              </Tag>
            )}
          </Cell>
        </Column>
      </Table>
      {selectedLoanId && (
        <Drawer size="sm" open={open} onClose={() => setOpen(false)}>
          <Drawer.Header>
            <Drawer.Title>Loan Repayment Details</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body>
            <Table bordered data={terms} autoHeight virtualized>
              <Column align="center" fixed width={200}>
                <HeaderCell>Repayment ID</HeaderCell>
                <Cell dataKey="_id" />
              </Column>
              <Column width={100}>
                <HeaderCell>Due Date</HeaderCell>
                <Cell>
                  {(rowData) => `${moment(rowData?.dueDate).format("ll")}`}
                </Cell>
              </Column>
              <Column width={130}>
                <HeaderCell>Installment Amount</HeaderCell>
                <Cell>{(rowData) => `$${rowData?.amount}`}</Cell>
              </Column>
              <Column width={120}>
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
            <div className="w-100 mt-2 flex  gap-5 justify-end ">
              <Button
                color="green"
                appearance="primary"
                onClick={() => updateStatus(selectedLoanId, "APPROVED")}
              >
                Approve
              </Button>
              <Button
                color="red"
                appearance="primary"
                onClick={() => updateStatus(selectedLoanId, "REJECTED")}
              >
                Reject
              </Button>
            </div>
          </Drawer.Body>
        </Drawer>
      )}
    </>
  );
};

export default AdminTable;
