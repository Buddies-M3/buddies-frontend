"use client";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer"; // GLOBAL CUSTOM COMPONENTS

import { H3 } from "components/Typography";
import Scrollbar from "components/Scrollbar";
import { TableHeader, TablePagination } from "components/data-table"; // Local CUSTOM COMPONENT

import ReviewRow from "../review-row"; // GLOBAL CUSTOM HOOK

import useMuiTable from "hooks/useMuiTable"; // CUSTOM DATA MODEL

// TABLE HEADING DATA LIST
const tableHeading = [{
  id: "system",
  label: "System",
  align: "left"
}, {
  id: "customer",
  label: "Customer",
  align: "left"
}, {
  id: "comment",
  label: "Comment",
  align: "left"
}, {
  id: "published",
  label: "Published",
  align: "left"
}, {
  id: "action",
  label: "Action",
  align: "center"
}]; // =============================================================================

// =============================================================================
const SystemReviewsPageView = ({
  reviews
}) => {
  // RESHAPE THE REVIEW LIST BASED TABLE HEAD CELL ID
  const filteredReviews = reviews.map(item => ({
    id: item.id,
    published: true,
    comment: item.comment,
    systemId: item.system.id,
    system: item.system.title,
    systemImage: item.system.thumbnail,
    customer: `${item.customer.name.firstName} ${item.customer.name.lastName}`
  }));
  const {
    order,
    orderBy,
    selected,
    rowsPerPage,
    filteredList,
    handleChangePage,
    handleRequestSort
  } = useMuiTable({
    listData: filteredReviews,
    defaultSort: "system"
  });
  return <Box py={4}>
      <H3 mb={2}>System Reviews</H3>

      <Card>
        <Scrollbar>
          <TableContainer sx={{
          minWidth: 1000
        }}>
            <Table>
              <TableHeader order={order} hideSelectBtn orderBy={orderBy} heading={tableHeading} numSelected={selected.length} rowCount={filteredList.length} onRequestSort={handleRequestSort} />

              <TableBody>
                {filteredList.map(review => <ReviewRow review={review} key={review.id} />)}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <Stack alignItems="center" my={4}>
          <TablePagination onChange={handleChangePage} count={Math.ceil(filteredList.length / rowsPerPage)} />
        </Stack>
      </Card>
    </Box>;
};

export default SystemReviewsPageView;