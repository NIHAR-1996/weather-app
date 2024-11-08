import React, { useState, useEffect } from "react";
import {  useDispatch } from "react-redux";
import { getCurrentWeather } from "../Redux/Slices/WeatherSlice"; // Assuming you have a Redux slice to handle weather data
import { MdOutlineFavorite, MdFavoriteBorder } from "react-icons/md";
import { getFavoriteCities, removeCityFromFavorites } from "./AddRemoveFav"; // Assuming this function fetches the list of favorite cities.
import toast from "react-hot-toast";

const FavoriteCitiesPage = () => {
  const dispatch = useDispatch();
  const [favCities, setFavCities] = useState([]);
  const [unit, setUnit] = useState("metric");
  const [weatherData, setWeatherData] = useState({});
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch favorite cities on component mount
  useEffect(() => {
    const fetchFavoriteCities = async () => {
      try {
        const cities = await getFavoriteCities();
        setFavCities(cities); // Update state with favorite cities list
        // Fetch current weather for each city
      } catch (error) {
        console.error("Error fetching favorite cities:", error);
        setFavCities([]); // Default empty array in case of an error
      }
    };

    fetchFavoriteCities();
  }, []);

  // Fetch current weather for each city

  useEffect(()=>{

    const fetchWeatherForCities = async () => {
      setLoading(true);
    
      try {
        // Fetch weather data for each city in parallel
        const data = await Promise.all(
          favCities.map(city => getCurrentWeather(city.city))
        );

        // Set fetched data into state once all are loaded
        setWeatherData(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    if (favCities.length > 0) {
      fetchWeatherForCities();
    }
  },[favCities]);

  

  // Handle temperature unit toggle (°C to °F and vice versa)
  const toggleUnit = () => {
    setUnit((prevUnit) => (prevUnit === "metric" ? "imperial" : "metric"));
  };

  const handleToggleFavorite = async (city) => {
    try {
      await removeCityFromFavorites(city);
      toast("Removed from favorites.", { icon: "❌" });
      // Re-fetch the updated list of favorite cities
      const updatedCities = await getFavoriteCities();
      setFavCities(updatedCities);
      // Also update weather data for the updated favorites
     
    } catch (error) { 
      toast("Error removing from favorites.", { icon: "⚠️" });
    }
  };

 
  return (
    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 min-h-screen py-10 px-4">
      <h1 className="text-4xl font-extrabold text-center text-white mb-10">
        Your Favorite Cities
      </h1>
      <div className="flex flex-wrap justify-center gap-6">
        {favCities.length === 0 ? (
          <p className="text-white text-xl">No favorite cities added yet!</p>
        ) : (
          favCities.map((city, index) => {
            const currentCityWeather = weatherData[index];
            return (
              <div
                key={index}
                className="w-full sm:w-80 bg-white rounded-lg shadow-lg overflow-hidden"
              >
                {/* Card Header */}
                <div className="bg-blue-600 text-white p-4 flex flex-col justify-between items-center">
                  <h2 className="font-semibold text-xl">{city.city}</h2>
                  <MdOutlineFavorite
                    className="cursor-pointer text-red-500"
                    onClick={() => handleToggleFavorite(city.city)}
                  />
                </div>
                {/* Card Body */}
               
              </div>
            );
          })
        )}
      </div>

      {/* Temperature Unit Toggle */}
      
    </div>
  );
};

export default FavoriteCitiesPage;
