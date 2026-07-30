(function () {
  "use strict";
  var form = document.getElementById("calc-form");
  if (!form) return;

  var currentAgeInput = document.getElementById("currentAge");
  var retirementAgeInput = document.getElementById("retirementAge");
  var currentSavingsInput = document.getElementById("currentSavings");
  var contribInput = document.getElementById("monthlyContribution");
  var returnInput = document.getElementById("annualReturn");
  var desiredIncomeInput = document.getElementById("desiredIncome");

  var balanceOut = document.getElementById("result-balance");
  var sustainableOut = document.getElementById("result-sustainable");
  var contribOut = document.getElementById("result-contrib");
  var gapOut = document.getElementById("result-gap");

  var chartState = { chart: null };
  var ctx = document.getElementById("result-chart");

  function calculate() {
    var currentAge = CalcTools.clamp(currentAgeInput.value, 16, 30);
    var retirementAge = CalcTools.clamp(retirementAgeInput.value, currentAge + 1, currentAge + 1);
    var currentSavings = CalcTools.clamp(currentSavingsInput.value, 0, 0);
    var contrib = CalcTools.clamp(contribInput.value, 0, 0);
    var annualReturn = CalcTools.clamp(returnInput.value, 0, 0);
    var desiredIncome = CalcTools.clamp(desiredIncomeInput.value, 0, 0);

    var years = Math.max(retirementAge - currentAge, 1);
    var monthlyRate = annualReturn / 100 / 12;

    var balance = currentSavings;
    var totalContrib = currentSavings;
    var yearly = [balance];

    for (var m = 1; m <= years * 12; m++) {
      balance = balance * (1 + monthlyRate) + contrib;
      totalContrib += contrib;
      if (m % 12 === 0) yearly.push(balance);
    }

    var sustainableIncome = balance * 0.04;
    var gap = sustainableIncome - desiredIncome;

    balanceOut.textContent = CalcTools.formatMoney(balance);
    sustainableOut.textContent = CalcTools.formatMoney(sustainableIncome) + " / yr";
    contribOut.textContent = CalcTools.formatMoney(totalContrib);
    gapOut.textContent = (gap >= 0 ? "+" : "") + CalcTools.formatMoney(gap) + " / yr";

    var labels = yearly.map(function (_, i) { return "Age " + (currentAge + i); });
    CalcTools.upsertChart(chartState, ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [{
          label: "Balance",
          data: yearly,
          borderColor: CalcTools.PALETTE[0],
          backgroundColor: "rgba(30, 58, 95, 0.1)",
          fill: true,
          tension: 0.3,
          pointRadius: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { ticks: { callback: function (v) { return CalcTools.formatMoney(v); } } } }
      }
    });
  }

  form.addEventListener("input", calculate);
  calculate();
})();
