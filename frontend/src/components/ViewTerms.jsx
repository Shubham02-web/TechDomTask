import { Drawer, Table } from "rsuite";
import { Cell, HeaderCell } from "rsuite-table";
import Column from "rsuite/esm/Table/TableColumn";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, ButtonToolbar, ButtonGroup } from "rsuite";

const ViewTerms = ({ open, setOpen, terms, userIdCheck }) => {
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const updateStatus = async (id, state) => {
    try {
      await axios.patch(`http://localhost:5000/api/loan/approve`, {
        id,
        state,
      });
      alert(`Updated the loan status from pending to ${state}`);
      window.location.reload(false); // Consider a better approach to update UI (state)
      navigate("/");
    } catch (error) {
      if (error.name === "AxiosError") {
        console.log(error.response.data.message);
        return alert(error.response.data.message);
      }
      console.error(error);
      alert(`Can't update status!\nError:${error}`);
    }
  };

  return (
    <Drawer
      size={500}
      open={open}
      onClose={() => setOpen(false)}
      userIdCheck={userIdCheck}
    >
      <Drawer.Header>Loan Repayment Details</Drawer.Header>
      <Drawer.Body className="p-3">
        <Table bordered data={terms} className="text-xs">
          <Column align="center" fixed fullText>
            <HeaderCell className="text-sm">Repayment Id</HeaderCell>
            <Cell dataKey="_id" />
          </Column>

          <Column fullText>
            <HeaderCell>dueDate</HeaderCell>
            <Cell dataKey="dueDate" />
          </Column>

          <Column>
            <HeaderCell>Installment Amount</HeaderCell>
            <Cell dataKey="amount" />
          </Column>

          <Column width={200}>
            <HeaderCell>Payment Status</HeaderCell>
            <Cell dataKey="state" />
          </Column>
        </Table>
      </Drawer.Body>
      <ButtonToolbar>
        <ButtonGroup>
          <Button
            className="m-50"
            color="green"
            appearance={"primary"}
            onClickCapture={updateStatus(userIdCheck, "APPROVED")}
          >
            Approve
          </Button>
          <Button color="red" appearance={"primary"}>
            Reject
          </Button>
        </ButtonGroup>
      </ButtonToolbar>
    </Drawer>
  );
};

export default ViewTerms;
