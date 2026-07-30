(function () {
  "use strict";
  var form = document.getElementById("calc-form");
  if (!form) return;

  var incomeInput = document.getElementById("income");
  var currencyInput = document.getElementById("currency");
  var expensesInput = document.getElementById("expenses");
  var weeksOffInput = document.getElementById("weeksOff");
  var daysPerWeekInput = document.getElementById("daysPerWeek");
  var utilizationInput = document.getElementById("utilization");
  var hoursPerDayInput = document.getElementById("hoursPerDay");

  var dayRateOut = document.getElementById("result-day-rate");
  var hourlyRateOut = document.getElementById("result-hourly-rate");
  var workingDaysOut = document.getElementById("result-working-days");
  var billableDaysOut = document.getElementById("result-billable-days");
  var revenueOut = document.getElementById("result-revenue");

  var chartState = { chart: null };
  var ctx = document.getElementById("result-chart");

  // Approximate exchange rates, pivoted through EUR (the base currency).
  var RATES_FROM_EUR = { EUR: 1, USD: 1.08, GBP: 0.86 };
  var RATES_TO_EUR = { EUR: 1, USD: 0.93, GBP: 1.16 };

  var currentCurrency = currencyInput.value;

  function convertAmount(amount, fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) return amount;
    var amountInEur = amount * RATES_TO_EUR[fromCurrency];
    return amountInEur * RATES_FROM_EUR[toCurrency];
  }

  function convertFieldValue(input, fromCurrency, toCurrency) {
    var value = parseFloat(input.value);
    if (isNaN(value)) return;
    input.value = Math.round(convertAmount(value, fromCurrency, toCurrency));
  }

  function calculate() {
    var income = CalcTools.clamp(incomeInput.value, 0, 0);
    var expenses = CalcTools.clamp(expensesInput.value, 0, 0);
    var weeksOff = Math.min(CalcTools.clamp(weeksOffInput.value, 0, 0), 52);
    var daysPerWeek = Math.min(CalcTools.clamp(daysPerWeekInput.value, 1, 5), 7);
    var utilization = Math.min(CalcTools.clamp(utilizationInput.value, 1, 100), 100);
    var hoursPerDay = CalcTools.clamp(hoursPerDayInput.value, 1, 8);
    var currency = currencyInput.value;

    var workingWeeks = Math.max(52 - weeksOff, 0);
    var workingDays = workingWeeks * daysPerWeek;
    var billableDays = workingDays * (utilization / 100);
    var nonBillableDays = Math.max(workingDays - billableDays, 0);
    var revenueNeeded = income + expenses;

    var dayRate = billableDays > 0 ? revenueNeeded / billableDays : 0;
    var hourlyRate = hoursPerDay > 0 ? dayRate / hoursPerDay : 0;

    dayRateOut.textContent = CalcTools.formatMoney(dayRate, currency);
    hourlyRateOut.textContent = CalcTools.formatMoney(hourlyRate, currency) + " / hr";
    workingDaysOut.textContent = Math.round(workingDays);
    billableDaysOut.textContent = Math.round(billableDays);
    revenueOut.textContent = CalcTools.formatMoney(revenueNeeded, currency);

    CalcTools.upsertChart(chartState, ctx, {
      type: "doughnut",
      data: {
        labels: ["Billable days", "Non-billable days"],
        datasets: [{
          data: [Math.round(billableDays), Math.round(nonBillableDays)],
          backgroundColor: [CalcTools.PALETTE[1], CalcTools.PALETTE[3]]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: "bottom", labels: { boxWidth: 12, font: { size: 11 } } } }
      }
    });
  }

  currencyInput.addEventListener("change", function () {
    var newCurrency = currencyInput.value;
    if (newCurrency !== currentCurrency) {
      convertFieldValue(incomeInput, currentCurrency, newCurrency);
      convertFieldValue(expensesInput, currentCurrency, newCurrency);
      currentCurrency = newCurrency;
    }
    calculate();
  });

  form.addEventListener("input", calculate);
  calculate();
})();
