(function () {
  "use strict";
  var form = document.getElementById("calc-form");
  if (!form) return;

  var incomeInput = document.getElementById("desiredIncome");
  var overheadInput = document.getElementById("annualOverhead");
  var hoursPerWeekInput = document.getElementById("hoursPerWeek");
  var weeksPerYearInput = document.getElementById("weeksPerYear");

  var hourlyOut = document.getElementById("result-hourly");
  var totalHoursOut = document.getElementById("result-total-hours");
  var totalRevenueOut = document.getElementById("result-total-revenue");
  var weeklyOut = document.getElementById("result-weekly");

  var chartState = { chart: null };
  var ctx = document.getElementById("result-chart");

  function calculate() {
    var income = CalcTools.clamp(incomeInput.value, 0, 0);
    var overhead = CalcTools.clamp(overheadInput.value, 0, 0);
    var hoursPerWeek = CalcTools.clamp(hoursPerWeekInput.value, 1, 30);
    var weeksPerYear = Math.min(CalcTools.clamp(weeksPerYearInput.value, 1, 48), 52);

    var totalNeeded = income + overhead;
    var totalHours = hoursPerWeek * weeksPerYear;
    var hourlyRate = totalHours > 0 ? totalNeeded / totalHours : 0;
    var weeklyIncome = hourlyRate * hoursPerWeek;

    hourlyOut.textContent = CalcTools.formatMoney(hourlyRate);
    totalHoursOut.textContent = CalcTools.formatNumber(totalHours);
    totalRevenueOut.textContent = CalcTools.formatMoney(totalNeeded);
    weeklyOut.textContent = CalcTools.formatMoney(weeklyIncome);

    CalcTools.upsertChart(chartState, ctx, {
      type: "doughnut",
      data: {
        labels: ["Desired income", "Business overhead"],
        datasets: [{
          data: [income, overhead],
          backgroundColor: [CalcTools.PALETTE[0], CalcTools.PALETTE[2]]
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
