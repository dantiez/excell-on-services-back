import React, { useState, useEffect, useRef } from "react";
import TransactionService from "../Service/transactionService"; // Updated import
import Chart from "chart.js/auto";

const Dashboard = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const chartRef = useRef(null);
  const [periodType, setPeriodType] = useState("year");
  const [selectedMonth, setSelectedMonth] = useState("");

  useEffect(() => {
    fetchTransactions(); // Fetch transactions when periodType or selectedMonth changes
  }, [periodType, selectedMonth]);

  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.destroy();
    }
    const ctx = document.getElementById("revenueChart").getContext("2d");
    chartRef.current = new Chart(ctx, {
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
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [chartData]);

  const fetchTransactions = async () => {
    try {
      const today = new Date();
      let startDate, endDate;

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

      const response =
        periodType === "year" || (periodType === "month" && selectedMonth)
          ? await TransactionService.getTransactionsByDateRange(
              startDate,
              endDate
            )
          : await TransactionService.getTransactionsByDateRange(); // Default call if needed

      const successfulTransactions = response.filter(
        (transaction) => transaction.status === "Successful Transaction"
      );

      const labels = successfulTransactions.map((transaction) =>
        new Date(transaction.transactionDate).toLocaleDateString()
      );
      const data = successfulTransactions.map(
        (transaction) => transaction.totalAmount
      );

      setChartData({
        labels,
        datasets: [
          {
            label: "Revenue",
            data,
            backgroundColor: "rgba(75, 192, 192, 0.6)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            fill: false,
            tension: 0.1,
          },
        ],
      });
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
        <canvas id="revenueChart"></canvas>
      </div>
    </div>
  );
};

export default Dashboard;
