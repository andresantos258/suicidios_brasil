import arquivo from 'suicidios_brasil.json';

// Função para carregar o JSON e fazer a previsão
function loadAndCalculate(selectedState) {
  
  fetch(data.map(arquivo))  // Ajuste o caminho para o seu arquivo JSON
      .then(response => response.json())
      .then(suicideData => {
        const stateData = suicideData.find(record => record.UF === selectedState);
  
        if (!stateData) {
          document.getElementById("result").innerHTML = "Estado não encontrado no dataset.";
          return;
        }
  
        // Extrair anos e valores de suicídios
        const years = Object.keys(stateData).filter(year => !isNaN(year));
        const suicides = years.map(year => parseFloat(stateData[year]));
        const inputYears = years.map(year => parseInt(year));
  
        // Cálculo de somas necessárias
        const n = inputYears.length;
        const sumX = inputYears.reduce((acc, x) => acc + x, 0);
        const sumY = suicides.reduce((acc, y) => acc + y, 0);
        const sumXY = inputYears.reduce((acc, x, i) => acc + x * suicides[i], 0);
        const sumX2 = inputYears.reduce((acc, x) => acc + x * x, 0);
  
        // Cálculo do coeficiente angular (m) e intercepto (b)
        const m = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
        const b = (sumY - m * sumX) / n;
  
        // Calcular o R²
        const yMean = sumY / n;
        const SSE = suicides.reduce((acc, y, i) => acc + Math.pow(y - (m * inputYears[i] + b), 2), 0);
        const SST = suicides.reduce((acc, y) => acc + Math.pow(y - yMean, 2), 0);
        const R2 = 1 - (SSE / SST);
  
        // Prever o valor para o próximo ano
        const nextYear = Math.max(...inputYears) + 1;
        const predictedSuicides = m * nextYear + b;
  
        // Exibir os resultados
        let resultHTML = `<h2>Resultados para ${selectedState}</h2>`;
        resultHTML += `<p>Coeficiente angular (m): ${m.toFixed(2)}</p>`;
        resultHTML += `<p>Intercepto (b): ${b.toFixed(2)}</p>`;
        resultHTML += `<p>R² do modelo: ${R2.toFixed(4)}</p>`;
        resultHTML += `<p>Previsão de suicídios para ${nextYear}: ${predictedSuicides.toFixed(2)}</p>`;
  
        resultHTML += "<h3>Quantidade de Suicídios por Ano:</h3><ul>";
        years.forEach((year, index) => {
          resultHTML += `<li>${year}: ${suicides[index]}</li>`;
        });
        resultHTML += "</ul>";
  
        document.getElementById("result").innerHTML = resultHTML;
      })
      .catch(error => console.error('Erro ao carregar o arquivo JSON:', error));
  }
  
  // Função para capturar o estado selecionado e chamar o cálculo
  function calcular() {
    const selectedState = document.getElementById("stateSelect").value;
    loadAndCalculate(selectedState);
  }
  