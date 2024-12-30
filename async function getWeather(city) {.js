async function getWeather(city) {
  const citynameElement = document.getElementById("cityname");
  citynameElement.innerHTML = city.toUpperCase();

  const url = `https://air-quality-by-api-ninjas.p.rapidapi.com/v1/airquality?city=${city}`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'c69527ede6mshd15f697e354aa53p15e6d7jsn2f57281a41d5',
      'x-rapidapi-host': 'air-quality-by-api-ninjas.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    // Update main card values
    document.getElementById("CO").innerHTML = result.CO.concentration;
    document.getElementById("NO2").innerHTML = result.NO2.concentration;
    document.getElementById("O3").innerHTML = result.O3.concentration;
    document.getElementById("PM10").innerHTML = result.PM10.concentration;
    document.getElementById("SO2").innerHTML = result.SO2.concentration;
    document.getElementById("Overall_AQi").innerHTML = result.overall_aqi;

    // Update AQI values
    document.getElementById("COA").innerHTML = result.CO.aqi;
    document.getElementById("NO2A").innerHTML = result.NO2.aqi;
    document.getElementById("O3A").innerHTML = result.O3.aqi;
    document.getElementById("PM10A").innerHTML = result.PM10.aqi;
    document.getElementById("SO2A").innerHTML = result.SO2.aqi;

    console.log({ result });
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
}

async function populateTable() {
  const cities = ["Shanghai", "Boston", "Lucknow", "Kolkata", "Bangalore"];
  const tableBody = document.querySelector("tbody");

  for (const city of cities) {
    const url = `https://air-quality-by-api-ninjas.p.rapidapi.com/v1/airquality?city=${city}`;
    const options = {
      method: 'GET',
      headers: {
        'x-rapidapi-key': 'c69527ede6mshd15f697e354aa53p15e6d7jsn2f57281a41d5',
        'x-rapidapi-host': 'air-quality-by-api-ninjas.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options);
      const result = await response.json();

      // Create a new row for each city
      const row = document.createElement("tr");
      row.innerHTML = `
        <th class="text-start">${city}</th>
        <td>${result.CO.concentration}</td>
        <td>${result.NO2.concentration}</td>
        <td>${result.O3.concentration}</td>
        <td>${result.PM10.concentration}</td>
        <td>${result.SO2.concentration}</td>
        <td>${result.overall_aqi}</td>
      `;
      tableBody.appendChild(row);
    } catch (error) {
      console.error(`Error fetching data for ${city}:`, error);
    }
  }
}

// Event listener for search button
document.getElementById("submit").addEventListener("click", (e) => {
  e.preventDefault();
  const city = document.getElementById("city").value;
  getWeather(city);
});

// Initial load
getWeather("Delhi");
populateTable();