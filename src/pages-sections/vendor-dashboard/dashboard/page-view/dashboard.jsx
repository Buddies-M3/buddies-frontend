"use client";
import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Line } from "react-chartjs-2";
import { ButtonGroup, Button, Typography } from "@mui/material";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const DashboardPageView = () => {
  const [filter, setFilter] = useState("all-time"); // 'day', 'week', 'month', 'all-time'
  const [transactions, setTransactions] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  // Fetch transactions data from API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`/api/dashboard`);
        if (!response.ok) throw new Error("Failed to fetch transactions");
        const data = await response.json();
        setTransactions(data);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    fetchTransactions();
  }, []);

  // Filter transactions based on selected range
  useEffect(() => {
    const now = new Date();
    let filtered = transactions;

    if (filter === "day") {
      filtered = transactions.filter(
        (t) => new Date(t.date).toDateString() === now.toDateString()
      );
    } else if (filter === "week") {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(now.getDate() - 7);
      filtered = transactions.filter((t) => new Date(t.date) >= oneWeekAgo);
    } else if (filter === "month") {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);
      filtered = transactions.filter((t) => new Date(t.date) >= oneMonthAgo);
    }

    setFilteredData(filtered);
  }, [filter, transactions]);

  // Prepare data for the graph
  const graphData = {
    labels: filteredData.map((t) => new Date(t.date).toLocaleDateString()),
    datasets: [
      {
        label: "Number of Transactions",
        data: filteredData.map((t) => t.transactions), // Use 'transactions' instead of index
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        backgroundColor: "rgba(75,192,192,0.4)",
        tension: 0.4,
      },
    ],
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Transaction History
      </Typography>
      <ButtonGroup variant="outlined" sx={{ mb: 2 }}>
        <Button onClick={() => setFilter("day")} variant={filter === "day" ? "contained" : "outlined"}>
          Day
        </Button>
        <Button onClick={() => setFilter("week")} variant={filter === "week" ? "contained" : "outlined"}>
          Week
        </Button>
        <Button onClick={() => setFilter("month")} variant={filter === "month" ? "contained" : "outlined"}>
          Month
        </Button>
        <Button onClick={() => setFilter("all-time")} variant={filter === "all-time" ? "contained" : "outlined"}>
          All Time
        </Button>
      </ButtonGroup>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Line data={graphData} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPageView;
