export const groupTransactionsByPeriod = (
  transactions,
  periodType,
  selectedMonth
) => {
  const revenueMap = {};

  // Ensure transactions are passed correctly
  transactions.forEach((transaction) => {
    console.log("Transaction Date:", transaction.transactionDate);
    console.log("Transaction Amount Type:", typeof transaction.amount);
    console.log("Transaction Amount:", transaction.amount);
  });

  transactions.forEach((transaction) => {
    // Assuming all transactions should be considered
    const transactionDate = new Date(transaction.transactionDate);
    if (isNaN(transactionDate)) {
      console.error("Invalid Date:", transaction.transactionDate);
      return;
    }

    let periodKey;

    if (periodType === "year") {
      periodKey = `${transactionDate.getFullYear()}-${String(
        transactionDate.getMonth() + 1
      ).padStart(2, "0")}`;
    } else if (periodType === "month") {
      const month = selectedMonth || transactionDate.getMonth() + 1;
      if (transactionDate.getMonth() + 1 === parseInt(month)) {
        const week = Math.ceil(transactionDate.getDate() / 7);
        periodKey = `${transactionDate.getFullYear()}-${String(month).padStart(
          2,
          "0"
        )}-W${week}`;
      } else if (!selectedMonth) {
        periodKey = `${transactionDate.getFullYear()}-${String(
          transactionDate.getMonth() + 1
        ).padStart(2, "0")}`;
      }
    }

    console.log("Period Key: ", periodKey);

    if (periodKey) {
      if (!revenueMap[periodKey]) {
        revenueMap[periodKey] = 0;
      }
      revenueMap[periodKey] += transaction.amount;
    }
  });

  let labels = [];
  let data = [];

  if (periodType === "year") {
    for (let month = 1; month <= 12; month++) {
      const key = `${new Date().getFullYear()}-${String(month).padStart(
        2,
        "0"
      )}`;
      labels.push(`Month ${month}`);
      data.push(revenueMap[key] || 0);
    }
  } else if (periodType === "month") {
    if (selectedMonth) {
      const daysInMonth = new Date(
        new Date().getFullYear(),
        selectedMonth,
        0
      ).getDate();
      const weeks = Math.ceil(daysInMonth / 7);
      for (let week = 1; week <= weeks; week++) {
        const key = `${new Date().getFullYear()}-${String(
          selectedMonth
        ).padStart(2, "0")}-W${week}`;
        labels.push(`Week ${week}`);
        data.push(revenueMap[key] || 0);
      }
    } else {
      for (let month = 1; month <= 12; month++) {
        const key = `${new Date().getFullYear()}-${String(month).padStart(
          2,
          "0"
        )}`;
        labels.push(`Month ${month}`);
        data.push(revenueMap[key] || 0);
      }
    }
  }

  console.log("Selected Month:", selectedMonth);
  console.log("Updated Revenue Map: ", revenueMap);
  console.log("Labels: ", labels);
  console.log("Data: ", data);

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
