import React, { useState,useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentWeather,
  getFiveDayForecast,
} from "../Redux/Slices/WeatherSlice";
import { MdOutlineFavorite, MdFavoriteBorder } from "react-icons/md";
import toast from "react-hot-toast";
import {
  addCityToFavorites,
  removeCityFromFavorites,
  getFavoriteCities,
} from "./AddRemoveFav";

const SearchCity = () => {
  const [city, setCity] = useState("Bhubaneswar"); // Default to Bhubaneswar
  const [searchCity, setSearchCity] = useState("");
  const [unit, setUnit] = useState("metric");
  const [showCurrentWeather, setShowCurrentWeather] = useState(true);
  const [favCities, setFavCities] = useState([]);

  const dispatch = useDispatch();
  const { currentWeather, fiveDayForecast, status, error } = useSelector(
    (state) => state.weather
  );

  // Load favorite cities on component mount
  useEffect(() => {
    const fetchFavoriteCities = async () => {
      try {
        const cities = await getFavoriteCities();
        setFavCities(Array.isArray(cities) ? cities : []);
      } catch (error) {
        console.error("Error fetching favorite cities:", error);
        setFavCities([]);
      }
    };

    fetchFavoriteCities();
  }, []);

  
  const isFavorite = favCities.some((favCity) => favCity.city === city);

  const handleToggleFavorite = async () => {
    if (isFavorite) {
      await removeCityFromFavorites(city);
      toast("Removed from favorites.", { icon: "❌" });
    } else {
      await addCityToFavorites(city);
      toast("Added to favorites!", { icon: "❤️" });
    }
    // Fetch updated favorites list after toggling
    const updatedCities = await getFavoriteCities();
    setFavCities(Array.isArray(updatedCities) ? updatedCities : []);
  };

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === "metric" ? "imperial" : "metric"));
  };

  useEffect(() => {
    
    if (showCurrentWeather) {
      dispatch(getCurrentWeather({ city, unit }));
    } else {
      dispatch(getFiveDayForecast({ city, unit }));
    }
  
}, [dispatch, city, unit, showCurrentWeather]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setCity(searchCity); // Update city to display weather
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-8 bg-gradient-to-br from-blue-400 to-purple-700 text-white">
      {/* Search Form */}
      <form onSubmit={handleSubmit} className="flex space-x-2 mb-8">
        <input
          type="text"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          placeholder="Enter city name"
          className="p-2 rounded-md border border-gray-300 text-black"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {/* Weather Display Container */}
      <div className="w-full max-w-2xl">
        {/* weather display content start */}
      <div className="w-full lg:w-2/3 max-w-lg bg-white bg-opacity-20 rounded-xl shadow-lg p-6 space-y-4 mx-auto">
      {/* City Name, Toggle Switch for Temperature Units */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold">
          {city}, {currentWeather?.sys?.country}
        </h1>
        {isFavorite ? (
          <MdOutlineFavorite
            className="cursor-pointer text-red-500"
            onClick={handleToggleFavorite}
          />
        ) : (
          <MdFavoriteBorder
            className="cursor-pointer text-gray-400"
            onClick={handleToggleFavorite}
          />
        )}
        <label className="flex items-center space-x-2">
          <span>{unit === "metric" ? "°C" : "°F"}</span>
          <input
            type="checkbox"
            onChange={toggleUnit}
            checked={unit === "imperial"}
          />
        </label>
      </div>

      <button
        className="w-full py-2 mt-4 bg-blue-600 rounded-md text-white font-semibold hover:bg-blue-700"
        onClick={() => setShowCurrentWeather(!showCurrentWeather)}
      >
        {showCurrentWeather ? "Show 5-Day Forecast" : "Show Current Weather"}
      </button>

      {showCurrentWeather ? (
        <div className="flex flex-col items-center space-y-4 pb-4">
          <img
            src={`https://openweathermap.org/img/wn/${currentWeather?.weather[0]?.icon}@2x.png`}
            alt="weather icon"
            className="w-20 h-20"
          />
          <h2 className="text-5xl font-bold">
            {Math.round(currentWeather?.main?.temp)}° {unit === "metric" ? "C" : "F"}
          </h2>
          <p className="text-lg capitalize">
            {currentWeather?.weather[0]?.description}
          </p>
        </div>
      ) : (
        <div className="pb-8">
          <h2 className="text-2xl font-semibold text-center mb-4">
            5-Day Forecast
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {fiveDayForecast?.list?.slice(0, 5).map((day, index) => (
              <div
                key={index}
                className="flex justify-between bg-white bg-opacity-20 p-2 rounded-lg"
              >
                <p className="font-semibold">
                  {new Date(day.dt * 1000).toLocaleDateString()}
                </p>
                <p>{Math.round(day.main.temp)}°</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    //weather dispaly content ends
      </div>
    </div>
  );
};

export default SearchCity;
