const express = require("express");
const fs = require("fs");
const converter = require("json-2-csv");

const data = require("./data.json");

const categoryObject = [
  {
    BMICategory: "Underweight",
    HealthRisk: "Malnutrition risk",
  },
  {
    BMICategory: "Normal weight",
    HealthRisk: "Low risk",
  },
  {
    BMICategory: "Overweight",
    HealthRisk: "Enhanced risk",
  },
  {
    BMICategory: "Moderately obese",
    HealthRisk: "Medium risk",
  },
  {
    BMICategory: "Severel obese",
    HealthRisk: "High",
  },
  {
    BMICategory: "Very severely obese",
    HealthRisk: "Very high risk",
  },
];

function calcBMI(weight, height) {
  return (weight / Math.pow(height / 100, 2)).toFixed(2);
}

function categorize(bmi) {
  switch (true) {
    case bmi < 18.5:
      return 0;
    case bmi < 25:
      return 1;
    case bmi < 30:
      return 2;
    case bmi < 35:
      return 3;
    case bmi < 40:
      return 4;
    case bmi >= 40:
      return 5;
    default:
      return "Invalid BMI Value";
  }
}

let output = [];

const app = express();

data.forEach((record) => {
  const bmi = calcBMI(record.WeightKg, record.HeightCm);
  const category = categorize(bmi);
  if (!isNaN(category)) {
    record = { ...record, ...categoryObject[category], BMI: parseFloat(bmi) };
    output.push(record);
  } else {
    console.log("Invalid Input");
  }
});

converter.json2csv(output, (err, csv) => {
  if (err) console.log(err);
  fs.writeFile(__dirname + "/output.csv", csv, (err) => {
    if (err) console.log(err);
    else console.log("Output saved to output.csv");
  });
});

app.listen(3000, () => {
  console.log("Running on port 3000");
});
