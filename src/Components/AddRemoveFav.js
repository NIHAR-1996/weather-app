import axios from 'axios';

const BASE_URL = 'http://localhost:5000/favorites';

// Function to add a city to favorites
export const addCityToFavorites = async (city) => {
  try {
    const response = await axios.post(BASE_URL, { city });
    return response.data;
  } catch (error) {
    console.error('Error adding city to favorites:', error);
    throw error;
  }
};

// Function to remove a city from favorites
export const removeCityFromFavorites = async (city) => {
  try {
    // Fetch all favorites to find the city ID
    const { data: favorites } = await axios.get(BASE_URL);
    const favorite = favorites.find((f) => f.city === city);

    if (favorite) {
      await axios.delete(`${BASE_URL}/${favorite.id}`);
      return true;
    }
  } catch (error) {
    console.error('Error removing city from favorites:', error);
    throw error;
  }
};

// Function to get all favorite cities
export const getFavoriteCities = async () => {
  try {
    const response = await axios.get(BASE_URL);
    return response.data;
  } catch (error) {
    console.error('Error fetching favorite cities:', error);
    throw error;
  }
};
