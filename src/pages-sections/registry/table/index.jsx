import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import styled from "@mui/material/styles/styled";
import TableCell from "@mui/material/TableCell";
import TableBody from "@mui/material/TableBody";
import Stack from '@mui/material/Stack';
import Box from "@mui/material/Box";
import TableContainer from "@mui/material/TableContainer";
import Link from "next/link";
import Scrollbar from "components/Scrollbar";
import { FlexBox } from "components/flex-box";
import TableHeader from "./table-head";
import { currency } from "lib";
import useMuiTable from "hooks/useMuiTable";
import Done from "@mui/icons-material/Done";
import { format } from 'date-fns';

import { TablePagination } from "components/data-table";

import { CategoryWrapper } from "pages-sections/vendor-dashboard/styles";
import { parseTokenBalance } from "utils/misc-utils";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
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

const StatusWrapper = styled(FlexBox)(({ theme, payment }) => ({
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

const DataListTable = ({ dataList, tableHeading, type }) => {
  const { order, orderBy, filteredList, rowsPerPage, handleRequestSort, handleChangePage } = useMuiTable({
    listData: dataList
  });

  let BODY_CONTENT = null;

  BODY_CONTENT = (
    <TableBody>
      {filteredList.map((row, index) => {
        const { token_id, project_id, project_name, start_date, amount, end_date, project_type, burned, issued_at } = row;
        return (type === 'REGISTRY' ?
          (
            <StyledTableRow key={index}>
              <StyledTableCell align="left"><Link href={`/registry/gcn/${token_id}`}>{`#${token_id}`}</Link></StyledTableCell>
              <StyledTableCell align="left"><Link href={`/registry/project/${project_id}`}>{project_name}</Link></StyledTableCell>
              <StyledTableCell align="left">{project_type}</StyledTableCell>
              <StyledTableCell align="left">
                {burned == 1 ? <StatusWrapper payment={true}>{"Retired"}</StatusWrapper> : <StatusWrapper payment={false}>{"Active"}</StatusWrapper>}
              </StyledTableCell>
              <StyledTableCell align="left"><CategoryWrapper>{format(new Date(issued_at), 'yyyy-MM-dd HH:mm:ss')}</CategoryWrapper></StyledTableCell>
            </StyledTableRow>
          )
          :
          (
            <StyledTableRow key={index}>
              <StyledTableCell align="left"><Link href={`/registry/gcn/${token_id}`}>{`#${token_id}`}</Link></StyledTableCell>
              <StyledTableCell align="left">{parseTokenBalance(amount)}</StyledTableCell>
              <StyledTableCell align="left"><CategoryWrapper>{format(new Date(start_date * 1000), 'yyyy-MM-dd HH:mm:ss')}</CategoryWrapper></StyledTableCell>
              <StyledTableCell align="left"><CategoryWrapper>{format(new Date(end_date * 1000), 'yyyy-MM-dd HH:mm:ss')}</CategoryWrapper></StyledTableCell>
              <StyledTableCell align="left">
                {burned == 1 ? <StatusWrapper payment={true}>{"Retired"}</StatusWrapper> : <StatusWrapper payment={false}>{"Active"}</StatusWrapper>}
              </StyledTableCell>
              <StyledTableCell align="left"><CategoryWrapper>{format(new Date(issued_at * 1000), 'yyyy-MM-dd HH:mm:ss')}</CategoryWrapper></StyledTableCell>
            </StyledTableRow>
          )
        );
      })}
    </TableBody>
  );

  return (
    <div>
      <Scrollbar>
        <TableContainer>
          <Table>
            <TableHeader
              order={order}
              orderBy={orderBy}
              heading={tableHeading}
              onRequestSort={handleRequestSort}
            />
            {filteredList.length > 0 ? (
              BODY_CONTENT
            ) : (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={tableHeading.length} style={{ padding: 0 }}>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      minHeight="160px"
                      width="100%"
                    >
                      No GCNs found
                    </Box>
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </Scrollbar>
    </div>
  );
};

export default DataListTable;