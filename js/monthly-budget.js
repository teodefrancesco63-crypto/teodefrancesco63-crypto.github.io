(function () {
  "use strict";
  var form = document.getElementById("calc-form");
  if (!form) return;

  var incomeInput = document.getElementById("income");
  var categoryIds = ["housing", "transportation", "food", "utilities", "insurance", "debtPayments", "savings", "entertainment"];
  var categoryLabels = ["Housing", "Transportation", "Food", "Utilities", "Insurance", "Debt payments", "Savings", "Entertainment & other"];
  var inputs = {};
  categoryIds.forEach(function (id) { inputs[id] = document.getElementById(id); });

  var leftoverOut = document.getElementById("result-leftover");
  var totalAllocatedOut = document.getElementById("result-total-allocated");
  var savingsRateOut = document.getElementById("result-savings-rate");

  var chartState = { chart: null };
  var ctx = document.getElementById("result-chart");

  function calculate() {
    var income = CalcTools.clamp(incomeInput.value, 0, 0);
    var values = categoryIds.map(function (id) { return CalcTools.clamp(inputs[id].value, 0, 0); });
    var total = values.reduce(function (a, b) { return a + b; }, 0);
    var leftover = income - total;
    var savings = values[categoryIds.indexOf("savings")];
    var savingsRate = income > 0 ? (savings / income) * 100 : 0;

    leftoverOut.textContent = CalcTools.formatMoney(leftover);
    totalAllocatedOut.textContent = CalcTools.formatMoney(total);
    savingsRateOut.textContent = CalcTools.formatNumber(savingsRate, 1) + "%";

    CalcTools.upsertChart(chartState, ctx, {
      type: "doughnut",
      data: {
        labels: categoryLabels,
        datasets: [{
          data: values,
          backgroundColor: [
            CalcTools.PALETTE[0], CalcTools.PALETTE[1], CalcTools.PALETTE[2], CalcTools.PALETTE[3],
            CalcTools.PALETTE[4], CalcTools.PALETTE[5], "#8aa6c1", "#c7ced6"
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "bottom", labels: { boxWidth: 10, font: { size: 10 } } } }
      }
    });
  }

  form.addEventListener("input", calculate);
  calculate();
})();
