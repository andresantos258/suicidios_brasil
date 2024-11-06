const csv = require('csvtojson');
const fs = require('fs');

const csvFilePath = 'suicidios_brasil.csv';
const jsonFilePath = 'suicidios_brasil.json';

csv({ delimiter: ';' })
  .fromFile(csvFilePath)
  .then((jsonObj) => {
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonObj, null, 2), 'utf-8');
    console.log('Conversão para JSON concluída!');
  });

fs.readFile(jsonFilePath, 'utf-8', (err, data) => {
  if (err) {
    console.error('Erro ao carregar o JSON:', err);
    return;
  }

const suicideData = JSON.parse(data);

// Selecionar um estado
const selectedState = "Parana";

const stateData = suicideData.find(record => record.UF === selectedState);

if (stateData) {
  const years = Object.keys(stateData).filter(year => !isNaN(year));
  const suicides = years.map(year => parseFloat(stateData[year]));

console.log(`Número de suicídios para ${selectedState}`);
const tabledata = years.map((year,index) => ({
Ano: year,
"Número de suicídios": suicides[index]
}));

console.table(tabledata);
  //console.log("Anos:", years);
  //console.log("Número de Suicídios:", suicides);

// Dados de entrada
const inputYears = years.map(year => parseInt(year));
const outputSuicides = suicides;

// Cálculo de somas necessárias
const n = inputYears.length;
const sumX = inputYears.reduce((acc, x) => acc + x, 0);
const sumY = outputSuicides.reduce((acc, y) => acc + y, 0);
const sumXY = inputYears.reduce((acc, x, i) => acc + x * outputSuicides[i], 0);
const sumX2 = inputYears.reduce((acc, x) => acc + x * x, 0);

// Cálculo do coeficiente angular (m) e intercepto (b)
const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
const b = (sumY - m * sumX) / n;

console.log(`Coeficiente angular (m): ${m.toFixed(2)}`);
console.log(`Intercepto (b): ${b.toFixed(2)}`);

// Calcular o R²
const yMean = sumY / n;
const SSE = outputSuicides.reduce((acc, y, i) => acc + Math.pow(y - (m * inputYears[i] + b), 2), 0);
const SST = outputSuicides.reduce((acc, y) => acc + Math.pow(y - yMean, 2), 0);
const R2 = 1 - (SSE / SST);

console.log(`R² do modelo: ${R2.toFixed(4)}`);

// Prever o valor para o ano de 2020
const predictionYear = 2020;
const predictedSuicides = m * predictionYear + b;

console.log(`Previsão de suicídios para ${predictionYear} em ${selectedState}: ${predictedSuicides.toFixed(2)}`);

} else {
  console.log("Estado não encontrado no dataset.");
};
});