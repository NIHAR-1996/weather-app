import React, { useState, useEffect } from "react";
import {
  getCurrentWeather,
  getFiveDayForecast,
} from "../Redux/Slices/WeatherSlice";
import { MdOutlineFavorite, MdFavoriteBorder } from "react-icons/md";
import {
  addCityToFavorites,
  removeCityFromFavorites,
  getFavoriteCities,
} from "./AddRemoveFav";
import { useDispatch, useSelector } from "react-redux";
import { FaHeart } from "react-icons/fa";
import toast from "react-hot-toast";

const WeatherDashboard = () => {
  const dispatch = useDispatch();
  const { currentWeather, fiveDayForecast, status, error } = useSelector(
    (state) => state.weather
  );

  const [city, setCity] = useState("Cuttack");
  const [unit, setUnit] = useState("metric");
  const [showCurrentWeather, setShowCurrentWeather] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favCities, setFavCities] = useState([]); // Store favorite cities list

  // Load favorite cities on component mount
 
  console.log(favCities);
  // Fetch weather data when city, unit, or weather type toggles
  useEffect(() => {
    if (showCurrentWeather) {
      dispatch(getCurrentWeather({ city, unit }));
    } else {
      dispatch(getFiveDayForecast({ city, unit }));
    }
  }, [dispatch, city, unit, showCurrentWeather]);

  const handleToggleFavorite = async () => {
    if (isFavorite) {
     await removeCityFromFavorites(city);
      setIsFavorite(false);
      const updatedFavCities = await getFavoriteCities();
      setFavCities(updatedFavCities); // Update favorites list
      toast("Removed from favorites.", { icon: "❌" });
    } else {
     await addCityToFavorites(city);
      setIsFavorite(true);
      const updatedFavCities = await getFavoriteCities();
      setFavCities(updatedFavCities); // Update favorites list
      toast("Added to favorites!", { icon: "❤️" });
    }
  };

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

  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === "metric" ? "imperial" : "metric"));
  };

  // Display weather details for selected favorite city
  const handleShowCityWeather = (selectedCity) => {
    setCity(selectedCity);
    setShowCurrentWeather(true);
  };

  // Remove city from favorites
  const handleRemoveCity = async (cityToRemove) => {
   await removeCityFromFavorites(cityToRemove);
   const updatedCities = await getFavoriteCities();
   setFavCities(Array.isArray(updatedCities) ? updatedCities : []);
    toast(`${cityToRemove} removed from favorites`, { icon: "❌" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-700 text-white p-6">
      <div className="flex flex-wrap justify-around">
        {/* Favorite Cities Section */}
        <div className="w-full lg:w-1/4 bg-white bg-opacity-20 rounded-xl shadow-lg p-4 mb-4 overflow-hidden">
          <h2 className="text-xl font-semibold text-center mb-4">Favorite Cities</h2>
          <div className="space-y-2">
          {Array.isArray(favCities) && favCities.length > 0 ? (
              favCities.map((favCity) => (
                <div
                  key={favCity.id}
                  className="p-4 bg-white bg-opacity-20 rounded-lg shadow-md flex justify-between items-center overflow-hidden"
                  onClick={() => handleShowCityWeather(favCity.city)}
                >
                  <span>{favCity.city}</span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleRemoveCity(favCity.city)}
                      className="bg-red-500 px-2 py-1 rounded text-white flex gap-1 ml-1"
                    >
                      Remove <FaHeart />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No favorite cities available.</p>
            )}
          </div>
        </div>

        {/* Weather Details Section */}
        <div className="w-full lg:w-2/3 max-w-lg bg-white bg-opacity-20 rounded-xl shadow-lg p-4 space-y-4">
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
                {Math.round(currentWeather?.main?.temp)}°
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
      </div>
    </div>
  );
};

export default WeatherDashboard;
