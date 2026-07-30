(function () {
  "use strict";
  var form = document.getElementById("calc-form");
  if (!form) return;

  var totalInput = document.getElementById("totalBudget");
  var daysInput = document.getElementById("days");
  var spentInput = document.getElementById("alreadySpent");
  var elapsedInput = document.getElementById("daysElapsed");

  var perDayOut = document.getElementById("result-per-day");
  var remainingBudgetOut = document.getElementById("result-remaining-budget");
  var daysRemainingOut = document.getElementById("result-days-remaining");
  var remainingPerDayOut = document.getElementById("result-remaining-per-day");

  var chartState = { chart: null };
  var ctx = document.getElementById("result-chart");

  function calculate() {
    var total = CalcTools.clamp(totalInput.value, 0, 0);
    var days = CalcTools.clamp(daysInput.value, 1, 1);
    var spent = Math.min(CalcTools.clamp(spentInput.value, 0, 0), total);
    var elapsed = Math.min(CalcTools.clamp(elapsedInput.value, 0, 0), days);

    var perDay = total / days;
    var remainingBudget = total - spent;
    var daysRemaining = Math.max(days - elapsed, 0);
    var remainingPerDay = daysRemaining > 0 ? remainingBudget / daysRemaining : remainingBudget;

    perDayOut.textContent = CalcTools.formatMoney(perDay);
    remainingBudgetOut.textContent = CalcTools.formatMoney(remainingBudget);
    daysRemainingOut.textContent = daysRemaining;
    remainingPerDayOut.textContent = CalcTools.formatMoney(remainingPerDay);

    CalcTools.upsertChart(chartState, ctx, {
      type: "bar",
      data: {
        labels: ["Planned / day", "Remaining budget / day"],
        datasets: [{
          data: [perDay, remainingPerDay],
          backgroundColor: [CalcTools.PALETTE[0], CalcTools.PALETTE[1]]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
      }
    });
  }

  form.addEventListener("input", calculate);
  calculate();
})();
