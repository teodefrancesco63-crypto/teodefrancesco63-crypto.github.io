(function () {
  "use strict";
  var form = document.getElementById("calc-form");
  if (!form) return;

  var goalInput = document.getElementById("goalAmount");
  var currentInput = document.getElementById("currentSavings");
  var rateInput = document.getElementById("annualRate");
  var monthsInput = document.getElementById("months");

  var monthlyOut = document.getElementById("result-monthly");
  var fvCurrentOut = document.getElementById("result-fv-current");
  var totalContribOut = document.getElementById("result-total-contrib");
  var interestOut = document.getElementById("result-interest");

  var chartState = { chart: null };
  var ctx = document.getElementById("result-chart");

  function calculate() {
    var goal = CalcTools.clamp(goalInput.value, 0, 0);
    var current = CalcTools.clamp(currentInput.value, 0, 0);
    var rate = CalcTools.clamp(rateInput.value, 0, 0);
    var months = Math.min(CalcTools.clamp(monthsInput.value, 1, 1), 600);

    var r = rate / 100 / 12;
    var fvCurrent = current * Math.pow(1 + r, months);
    var remaining = Math.max(goal - fvCurrent, 0);

    var monthlyPmt;
    if (r === 0) {
      monthlyPmt = remaining / months;
    } else {
      monthlyPmt = remaining * r / (Math.pow(1 + r, months) - 1);
    }

    var totalNominalContrib = monthlyPmt * months;
    var interestPortion = Math.max(goal - fvCurrent - totalNominalContrib, 0);

    monthlyOut.textContent = CalcTools.formatMoney(monthlyPmt);
    fvCurrentOut.textContent = CalcTools.formatMoney(fvCurrent);
    totalContribOut.textContent = CalcTools.formatMoney(totalNominalContrib);
    interestOut.textContent = CalcTools.formatMoney(interestPortion);

    CalcTools.upsertChart(chartState, ctx, {
      type: "doughnut",
      data: {
        labels: ["Current savings (grown)", "Your contributions", "Interest earned"],
        datasets: [{
          data: [fvCurrent, totalNominalContrib, interestPortion],
          backgroundColor: [CalcTools.PALETTE[0], CalcTools.PALETTE[1], CalcTools.PALETTE[2]]
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
