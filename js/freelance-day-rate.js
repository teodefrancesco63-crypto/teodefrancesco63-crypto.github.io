(function () {
  "use strict";

  var form = document.getElementById("day-rate-form");
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

  function formatMoney(value, currency) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: 0
    }).format(value);
  }

  function clampNumber(value, min, fallback) {
    var n = parseFloat(value);
    if (isNaN(n) || n < min) return fallback;
    return n;
  }

  function calculate() {
    var income = clampNumber(incomeInput.value, 0, 0);
    var expenses = clampNumber(expensesInput.value, 0, 0);
    var weeksOff = clampNumber(weeksOffInput.value, 0, 0);
    var daysPerWeek = clampNumber(daysPerWeekInput.value, 1, 5);
    var utilization = clampNumber(utilizationInput.value, 1, 100);
    var hoursPerDay = clampNumber(hoursPerDayInput.value, 1, 8);
    var currency = currencyInput.value;

    weeksOff = Math.min(weeksOff, 52);
    daysPerWeek = Math.min(daysPerWeek, 7);
    utilization = Math.min(utilization, 100);

    var workingWeeks = Math.max(52 - weeksOff, 0);
    var workingDays = workingWeeks * daysPerWeek;
    var billableDays = workingDays * (utilization / 100);
    var revenueNeeded = income + expenses;

    var dayRate = billableDays > 0 ? revenueNeeded / billableDays : 0;
    var hourlyRate = hoursPerDay > 0 ? dayRate / hoursPerDay : 0;

    dayRateOut.textContent = formatMoney(dayRate, currency);
    hourlyRateOut.textContent = formatMoney(hourlyRate, currency) + " / hr";
    workingDaysOut.textContent = Math.round(workingDays);
    billableDaysOut.textContent = Math.round(billableDays);
    revenueOut.textContent = formatMoney(revenueNeeded, currency);
  }

  form.addEventListener("input", calculate);
  calculate();
})();
