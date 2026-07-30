(function () {
  "use strict";
  var form = document.getElementById("calc-form");
  if (!form) return;

  var expensesInput = document.getElementById("monthlyExpenses");
  var monthsCoverageInput = document.getElementById("monthsCoverage");
  var currentInput = document.getElementById("currentSavings");
  var capacityInput = document.getElementById("monthlySavingsCapacity");

  var targetOut = document.getElementById("result-target");
  var currentOut = document.getElementById("result-current");
  var neededOut = document.getElementById("result-needed");
  var monthsOut = document.getElementById("result-months");

  var chartState = { chart: null };
  var ctx = document.getElementById("result-chart");

  function calculate() {
    var expenses = CalcTools.clamp(expensesInput.value, 0, 0);
    var monthsCoverage = CalcTools.clamp(monthsCoverageInput.value, 1, 6);
    var current = CalcTools.clamp(currentInput.value, 0, 0);
    var capacity = CalcTools.clamp(capacityInput.value, 0, 0);

    var target = expenses * monthsCoverage;
    var needed = Math.max(target - current, 0);

    targetOut.textContent = CalcTools.formatMoney(target);
    currentOut.textContent = CalcTools.formatMoney(current);
    neededOut.textContent = CalcTools.formatMoney(needed);
    monthsOut.textContent = capacity > 0 ? Math.ceil(needed / capacity) + " months" : "—";

    var savedForChart = Math.min(current, target);
    CalcTools.upsertChart(chartState, ctx, {
      type: "doughnut",
      data: {
        labels: ["Already saved", "Still needed"],
        datasets: [{
          data: [savedForChart, needed],
          backgroundColor: [CalcTools.PALETTE[1], CalcTools.PALETTE[4]]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "bottom", labels: { boxWidth: 12, font: { size: 11 } } } }
      }
    });
  }

  form.addEventListener("input", calculate);
  calculate();
})();
