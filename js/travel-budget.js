(function () {
  "use strict";
  var form = document.getElementById("calc-form");
  if (!form) return;

  var flightsInput = document.getElementById("flights");
  var nightsInput = document.getElementById("nights");
  var accomInput = document.getElementById("accommodationPerNight");
  var daysInput = document.getElementById("days");
  var foodInput = document.getElementById("foodPerDay");
  var transportInput = document.getElementById("transportPerDay");
  var activitiesInput = document.getElementById("activitiesPerDay");
  var bufferInput = document.getElementById("bufferPct");

  var totalOut = document.getElementById("result-total");
  var perDayOut = document.getElementById("result-per-day");
  var baseOut = document.getElementById("result-base");
  var bufferOut = document.getElementById("result-buffer");

  var chartState = { chart: null };
  var ctx = document.getElementById("result-chart");

  function calculate() {
    var flights = CalcTools.clamp(flightsInput.value, 0, 0);
    var nights = CalcTools.clamp(nightsInput.value, 0, 0);
    var accom = CalcTools.clamp(accomInput.value, 0, 0);
    var days = CalcTools.clamp(daysInput.value, 1, 1);
    var food = CalcTools.clamp(foodInput.value, 0, 0);
    var transport = CalcTools.clamp(transportInput.value, 0, 0);
    var activities = CalcTools.clamp(activitiesInput.value, 0, 0);
    var bufferPct = CalcTools.clamp(bufferInput.value, 0, 0);

    var accomTotal = accom * nights;
    var foodTotal = food * days;
    var transportTotal = transport * days;
    var activitiesTotal = activities * days;

    var base = flights + accomTotal + foodTotal + transportTotal + activitiesTotal;
    var bufferAmount = base * (bufferPct / 100);
    var total = base + bufferAmount;
    var perDay = total / days;

    totalOut.textContent = CalcTools.formatMoney(total);
    perDayOut.textContent = CalcTools.formatMoney(perDay) + " / day";
    baseOut.textContent = CalcTools.formatMoney(base);
    bufferOut.textContent = CalcTools.formatMoney(bufferAmount);

    CalcTools.upsertChart(chartState, ctx, {
      type: "doughnut",
      data: {
        labels: ["Flights", "Accommodation", "Food", "Transport", "Activities", "Buffer"],
        datasets: [{
          data: [flights, accomTotal, foodTotal, transportTotal, activitiesTotal, bufferAmount],
          backgroundColor: [
            CalcTools.PALETTE[0], CalcTools.PALETTE[1], CalcTools.PALETTE[2],
            CalcTools.PALETTE[3], CalcTools.PALETTE[4], CalcTools.PALETTE[5]
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
