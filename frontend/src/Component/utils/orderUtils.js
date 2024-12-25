export const groupOrdersByPeriod = (orders, periodType, selectedMonth) => {
  const revenueMap = {};

  orders.forEach((order) => {
    if (order.status === "Successful Order") {
      const orderDate = new Date(order.orderDate);
      let periodKey;

      if (periodType === "year") {
        periodKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, "0")}`;
      } else if (periodType === "month") {
        const month = selectedMonth || orderDate.getMonth() + 1;
        if (orderDate.getMonth() + 1 === parseInt(month)) {
          const week = Math.ceil(orderDate.getDate() / 7);
          periodKey = `${orderDate.getFullYear()}-${String(month).padStart(2, "0")}-W${week}`;
        } else if (!selectedMonth) {
          periodKey = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, "0")}`;
        }
      }

      if (periodKey) {
        if (!revenueMap[periodKey]) {
          revenueMap[periodKey] = 0;
        }
        revenueMap[periodKey] += order.totalAmount;
      }
    }
  });

  let labels = [];
  let data = [];

  if (periodType === "year") {
    for (let month = 1; month <= 12; month++) {
      const key = `${new Date().getFullYear()}-${String(month).padStart(2, "0")}`;
      labels.push(`Month ${month}`);
      data.push(revenueMap[key] || 0);
    }
  } else if (periodType === "month") {
    if (selectedMonth) {
      const daysInMonth = new Date(new Date().getFullYear(), selectedMonth, 0).getDate();
      const weeks = Math.ceil(daysInMonth / 7);
      for (let week = 1; week <= weeks; week++) {
        const key = `${new Date().getFullYear()}-${String(selectedMonth).padStart(2, "0")}-W${week}`;
        labels.push(`Week ${week}`);
        data.push(revenueMap[key] || 0);
      }
    } else {
      for (let month = 1; month <= 12; month++) {
        const key = `${new Date().getFullYear()}-${String(month).padStart(2, "0")}`;
        labels.push(`Month ${month}`);
        data.push(revenueMap[key] || 0);
      }
    }
  }

  return {
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
  };
};
