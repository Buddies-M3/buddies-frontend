import Pagination from "@mui/material/Pagination";
import styled from "@mui/material/styles/styled"; // STYLED COMPONENT

const StyledPagination = styled(Pagination)(({
  theme
}) => ({
  "& .MuiPaginationItem-root": {
    fontSize: 14,
    fontWeight: 500,
    color: theme.palette.grey[900],
    border: `1px solid transparent`
  },
  "& .MuiPaginationItem-page:hover": {
    borderRadius: 20,
    backgroundColor: "transparent",
    color: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`
  },
  "& .MuiPaginationItem-page.Mui-selected": {
    borderRadius: 20,
    backgroundColor: "transparent",
    color: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`,
    ":hover": {
      backgroundColor: "transparent"
    }
  },
  "& .MuiPaginationItem-previousNext": {
    margin: 10,
    borderRadius: 20,
    color: theme.palette.primary.main,
    border: `1px solid ${theme.palette.primary.main}`,
    "&:hover": {
      backgroundColor: "transparent"
    }
  }
}));

const TablePagination = props => <StyledPagination {...props} />;

export default TablePagination;