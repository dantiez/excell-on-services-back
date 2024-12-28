import React, { useState, useEffect, useRef } from "react";
import TransactionService from "../Service/transactionService"; // Updated import
import Chart from "chart.js/auto";
import { groupTransactionsByPeriod } from "../utils/orderUtils";

const Dashboard = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [periodType, setPeriodType] = useState("year");
  const [selectedMonth, setSelectedMonth] = useState("");
  const chartRef = useRef(null); // Ref to hold the canvas
  const chartInstanceRef = useRef(null); // Ref to hold the chart instance

  useEffect(() => {
    fetchTransactions(); // Fetch transactions when periodType or selectedMonth changes
  }, [periodType, selectedMonth]);

  useEffect(() => {
    if (chartRef.current) {
      // Clean up the previous chart instance before creating a new one
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");

      // Create the new chart instance
      chartInstanceRef.current = new Chart(ctx, {
        type: "line",
        data: chartData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  return `Revenue: $${tooltipItem.raw.toFixed(2)}`;
                },
              },
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Period",
              },
            },
            y: {
              title: {
                display: true,
                text: "Revenue",
              },
              beginAtZero: true,
              ticks: {
                callback: function (value) {
                  return `$${value}`;
                },
              },
            },
          },
        },
      });
    }

    // Cleanup chart instance when the component unmounts or when chartData changes
    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
    };
  }, [chartData]); // Depend on chartData to recreate the chart when data changes

  const fetchTransactions = async () => {
    try {
      const today = new Date();
      let startDate, endDate;

      // Set startDate and endDate based on periodType and selectedMonth
      if (periodType === "year") {
        startDate = new Date(today.getFullYear(), 0, 1)
          .toISOString()
          .split("T")[0];
        endDate = new Date(today.getFullYear() + 1, 0, 1)
          .toISOString()
          .split("T")[0];
      } else if (periodType === "month" && selectedMonth) {
        startDate = new Date(today.getFullYear(), selectedMonth - 1, 1)
          .toISOString()
          .split("T")[0];
        endDate = new Date(today.getFullYear(), selectedMonth, 1)
          .toISOString()
          .split("T")[0];
      }

      // Ensure that both startDate and endDate are set
      if (!startDate || !endDate) {
        console.error("Both start and end dates are required.");
        return; // Prevent API call if dates are not valid
      }

      const response = await TransactionService.getTransactionsByDateRange(
        startDate,
        endDate
      );
      const transactions = response.$values || [];

      console.log("Transactions received: ", transactions); // Log received transactions

      // Ensure transactions are passed correctly
      const groupedData = groupTransactionsByPeriod(
        transactions,
        periodType,
        selectedMonth
      );

      console.log("Grouped Data: ", groupedData); // Log grouped data

      setChartData(groupedData); // Only set data after fetching
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handlePeriodChange = (e) => {
    setPeriodType(e.target.value);
    setSelectedMonth(""); // Reset selected month when period type changes
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  return (
    <div className="container mt-4">
      <h2>Revenue Overview</h2>
      <label>
        Select Period:
        <select value={periodType} onChange={handlePeriodChange}>
          <option value="year">Year</option>
          <option value="month">Month</option>
        </select>
      </label>
      {periodType === "month" && (
        <label>
          Select Month:
          <select value={selectedMonth} onChange={handleMonthChange}>
            <option value="">--Select Month--</option>
            {[...Array(12).keys()].map((month) => (
              <option key={month + 1} value={month + 1}>
                {new Date(0, month).toLocaleString("default", {
                  month: "long",
                })}
              </option>
            ))}
          </select>
        </label>
      )}
      <div style={{ height: "300px" }}>
        <canvas ref={chartRef} id="revenueChart"></canvas>
      </div>
    </div>
  );
};

export default Dashboard;
