"use client";

import { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import Typography from "@mui/material/Typography";
import { TableHeader, TablePagination } from "components/data-table";
import Scrollbar from "components/Scrollbar";
import TransactionRow from "../transaction-row";
import useMuiTable from "hooks/useMuiTable";

const tableHeading = [
  { id: "id", label: "Transaction ID", align: "left" },
  { id: "time", label: "Time", align: "left" },
  { id: "owner", label: "ID Owner", align: "left" },
  { id: "number", label: "ID Number", align: "left" },
  { id: "expiry", label: "ID Expiry", align: "left" },
  { id: "nationality", label: "Nationality", align: "left" },
  { id: "status", label: "Status", align: "left" },
];

const useTransactions = (filter) => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`/api/transactions`);
        if (!response.ok) throw new Error("Failed to fetch transactions");
        const data = await response.json();
        console.log("Transactions data:", data);
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, [filter]);

  return transactions;
};

const TransactionsPageView = () => {
  const [filter, setFilter] = useState("");
  const transactions = useTransactions(filter);

  const {
    order,
    orderBy,
    selected,
    rowsPerPage,
    filteredList,
    handleChangePage,
    handleRequestSort,
  } = useMuiTable({ listData: transactions });

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this transaction?")) {
      try {
        const response = await fetch(`/api/transactions/${id}`, {
          method: "DELETE",
        });
        if (response.status === 200) {
          setTransactions(transactions.filter((transaction) => transaction.id !== id));
        } else {
          console.error("Error deleting transaction:", await response.json());
        }
      } catch (error) {
        console.error("Error deleting transaction:", error);
      }
    }
  };

  return (
    <Box py={4}>
      <Typography variant="h4" mb={2}>
        Transaction History
      </Typography>

      <Card>
        <Scrollbar autoHide={false}>
          <TableContainer>
            <Table>
              <TableHeader
                order={order}
                orderBy={orderBy}
                heading={tableHeading}
                rowCount={transactions.length}
                numSelected={selected.length}
                onRequestSort={handleRequestSort}
                hideSelectBtn={true}
              />
              <TableBody>
                {filteredList.map((transaction, index) => (
                  <TransactionRow
                    key={index}
                    transaction={transaction}
                    handleDelete={handleDelete}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          onChange={handleChangePage}
          count={Math.ceil(transactions.length / rowsPerPage)}
        />
      </Card>
    </Box>
  );
};

export default TransactionsPageView;