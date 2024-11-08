const ApiKey=process.env.REACT_APP_OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5";

export const fetchCurrentWeather= async(city,unit)=>{
 const response= await fetch (`${BASE_URL}/weather?q=${city}&units=${unit}&appid=${ApiKey}`);
 if(!response.ok) throw new Error("failed to fetch Current Weather Data");
 return response.json();
};

export const fetchFiveDayForecast = async (city, unit) => {
    const response = await fetch(`${BASE_URL}/forecast?q=${city}&units=${unit}&appid=${ApiKey}`);
    if (!response.ok) throw new Error("Failed to fetch 5-day forecast data");
    return response.json();
  };