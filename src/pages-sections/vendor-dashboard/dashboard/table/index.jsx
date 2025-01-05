import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import styled from "@mui/material/styles/styled";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Done from "@mui/icons-material/Done"; // GLOBAL CUSTOM HOOK

import useMuiTable from "hooks/useMuiTable"; // CUSTOM ICON COMPONENT

import Reload from "icons/Reload"; // GLOBAL CUSTOM COMPONENTS

import Scrollbar from "components/Scrollbar";
import { FlexBox } from "components/flex-box"; // Local CUSTOM COMPONENT

import TableHeader from "./table-head"; // CUSTOM UTILS LIBRARY FUNCTION

import { currency, kWh } from "lib"; // STYLED COMPONENTS

const StyledTableCell = styled(TableCell)(({
  theme
}) => ({
  fontSize: 13,
  paddingTop: 16,
  fontWeight: 600,
  paddingBottom: 16,
  color: theme.palette.grey[600],
  borderBottom: `1px solid ${theme.palette.grey[300]}`,
  ":first-of-type": {
    paddingLeft: 24
  }
}));
const StatusWrapper = styled(FlexBox, {
  shouldForwardProp: prop => prop !== "payment"
})(({
  theme,
  payment
}) => ({
  borderRadius: "8px",
  padding: "3px 12px",
  display: "inline-flex",
  color: payment ? theme.palette.error.main : theme.palette.success.main,
  backgroundColor: payment ? theme.palette.error[100] : theme.palette.success[100]
}));
const StyledTableRow = styled(TableRow)({
  ":last-child .MuiTableCell-root": {
    border: 0
  }
});

const StyledTotalCell = styled(TableCell)(({
  theme
}) => ({
  fontWeight: 600,
  padding: "12px 16px",
  color: theme.palette.grey[900],
  ":first-of-type": {
    paddingLeft: 24
  }
}));

// =============================================================================

// =============================================================================
const DataListTable = ({
  dataList,
  tableHeading,
  type
}) => {
  const {
    order,
    orderBy,
    filteredList,
    handleRequestSort
  } = useMuiTable({
    listData: dataList
  });
  let BODY_CONTENT = null;
  /* FOR STOCK OUT TABLE */

  if (type === "STOCK_OUT") {
    BODY_CONTENT = <TableBody>
      {filteredList.map((row, index) => {
        const {
          amount,
          stock,
          product
        } = row;
        return <StyledTableRow key={index}>
          <StyledTableCell align="left">{product}</StyledTableCell>
          <StyledTableCell align="center" sx={{
            color: "error.main"
          }}>
            {stock}
          </StyledTableCell>

          <StyledTableCell align="center">
            {currency(amount)}
          </StyledTableCell>
        </StyledTableRow>;
      })}
    </TableBody>;
  }
  /* FOR RECENT PURCHASE TABLE */


  if (type === "RECENT_PURCHASE") {
    let totalAvg = 0;
    let totalSum = 0;
    BODY_CONTENT = <TableBody>
      {filteredList.map((row, index) => {
        const {
          site_id: id,
          total_energy: sum,
          avg_energy: average,
          site_name: site
        } = row;
        totalAvg += Number(average);
        totalSum += Number(sum);
        return <StyledTableRow key={index}>
          <StyledTableCell align="left">{`#${id.substring(0, 5)}`}</StyledTableCell>
          <StyledTableCell align="left">{site}</StyledTableCell>

          {/* <StyledTableCell align="left">
                <StatusWrapper gap={1} alignItems="center" payment={average === "Pending" ? 1 : 0}>
                  <div>{average}</div>
                  {average === "Pending" && <Reload sx={{
                fontSize: 13
              }} />}
                  {average !== "Pending" && <Done sx={{
                fontSize: 13
              }} />}
                </StatusWrapper>
              </StyledTableCell> */}

          {/* <StyledTableCell align="left">
            {kWh(average)}
          </StyledTableCell> */}

          <StyledTableCell align="center">
            {kWh(sum)}
          </StyledTableCell>
        </StyledTableRow>;
      })}
      <StyledTableRow>
            <StyledTotalCell colSpan={2} align="left">Total</StyledTotalCell>
            {/* <StyledTotalCell align="left">{kWh(totalAvg)}</StyledTotalCell> */}
            <StyledTotalCell align="center">{kWh(totalSum)}</StyledTotalCell>
          </StyledTableRow>
    </TableBody>;
  }

  return <Scrollbar>
    <TableContainer sx={{
      minWidth: type === "RECENT_PURCHASE" ? 600 : 0
    }}>
      <Table>
        <TableHeader order={order} orderBy={orderBy} heading={tableHeading} onRequestSort={handleRequestSort} />

        {BODY_CONTENT}
      </Table>
    </TableContainer>
  </Scrollbar>;
};

export default DataListTable;