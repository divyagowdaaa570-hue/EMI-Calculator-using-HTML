let mainChart = null;

document.addEventListener("DOMContentLoaded", () => {
  loadDefaultChart();
  renderHistory();
});

document.getElementById("calculate").addEventListener("click", calculateEMI);
document.getElementById("save").addEventListener("click", saveResult);
document.getElementById("clearHistory").addEventListener("click", clearHistory);

function loadDefaultChart() {
  const ctx = document.getElementById("emiChart").getContext("2d");
  mainChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Principal", "Interest"],
      datasets: [{
        data: [1, 1],
        backgroundColor: ["#4CAF50", "#FF5733"],
      }],
    },
  });
}

function calculateEMI() {
  let amount = parseFloat(document.getElementById("amount").value);
  let interest = parseFloat(document.getElementById("interest").value);
  let tenure = parseFloat(document.getElementById("loanTenure").value);

  if (document.getElementById("year").checked) {
    tenure = tenure * 12;
  }

  if (isNaN(amount) || isNaN(interest) || isNaN(tenure) || amount <= 0 || interest < 0 || tenure <= 0) {
    alert("Please enter valid positive numbers.");
    return;
  }

  let monthlyRate = interest / 12 / 100;

  let emi = amount * monthlyRate * Math.pow(1 + monthlyRate, tenure) /
    (Math.pow(1 + monthlyRate, tenure) - 1);

  let totalPayment = emi * tenure;
  let totalInterest = totalPayment - amount;

  document.getElementById("emi").innerText = "₹ " + emi.toFixed(2);
  document.getElementById("totalInterest").innerText = "₹ " + totalInterest.toFixed(2);
  document.getElementById("totalPayment").innerText = "₹ " + totalPayment.toFixed(2);

  updateMainChart(amount, totalInterest);
}

function updateMainChart(principal, interest) {
  let ctx = document.getElementById("emiChart").getContext("2d");

  if (mainChart) mainChart.destroy();

  mainChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Principal", "Interest"],
      datasets: [{
        data: [principal, interest],
        backgroundColor: ["#4CAF50", "#FF5733"]
      }]
    }
  });
}

function saveResult() {
  let emi = document.getElementById("emi").innerText;
  let totalInterest = document.getElementById("totalInterest").innerText;
  let totalPayment = document.getElementById("totalPayment").innerText;

  if (!emi || emi === "") {
    alert("Calculate EMI first!");
    return;
  }

  let entry = { emi, totalInterest, totalPayment };

  let history = JSON.parse(localStorage.getItem("history")) || [];
  history.push(entry);

  localStorage.setItem("history", JSON.stringify(history));

  renderHistory();
}

function renderHistory() {
  let history = JSON.parse(localStorage.getItem("history")) || [];
  let historyList = document.getElementById("historyList");

  historyList.innerHTML = "";

  history.forEach((item) => {
    let li = document.createElement("li");
    li.className = "history-item";

    li.innerHTML = `
      <strong>EMI:</strong> ${item.emi} <br>
      <strong>Total Interest:</strong> ${item.totalInterest} <br>
      <strong>Total Payment:</strong> ${item.totalPayment}
    `;

    historyList.appendChild(li);
  });
}

function clearHistory() {
  localStorage.removeItem("history");
  document.getElementById("historyList").innerHTML = "";
}
