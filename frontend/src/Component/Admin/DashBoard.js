import React, { useState, useEffect, useRef } from "react";
import TransactionService from "../Service/transactionService"; // Updated import
import Chart from "chart.js/auto";
import { groupTransactionsByPeriod } from "../utils/orderUtils";
import AdminHeader from "../Layouts/HeaderAdmin/AdminHeader";
import TransactionPage from "./Transaction"; // Importing the TransactionPage component

const Dashboard = () => {
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [periodType, setPeriodType] = useState("year");
  const [selectedMonth, setSelectedMonth] = useState("");
  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  useEffect(() => {
    fetchTransactions();
  }, [periodType, selectedMonth]);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");

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

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
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

      if (!startDate || !endDate) {
        console.error("Both start and end dates are required.");
        return;
      }

      const response = await TransactionService.getTransactionsByDateRange(
        startDate,
        endDate
      );
      const transactions = response.$values || [];

      const groupedData = groupTransactionsByPeriod(
        transactions,
        periodType,
        selectedMonth
      );

      setChartData(groupedData);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handlePeriodChange = (e) => {
    setPeriodType(e.target.value);
    setSelectedMonth("");
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  return (
    <>
      <AdminHeader />
      <div className="main-content">
        <div className="container mt-4">
          <h2 className="text-center">Revenue Overview</h2>
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
          <div>
            <TransactionPage />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
