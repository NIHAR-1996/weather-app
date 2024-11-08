import { createSlice,createAsyncThunk } from "@reduxjs/toolkit";
import { fetchCurrentWeather, fetchFiveDayForecast } from "./WeatherApi";

export const getCurrentWeather= createAsyncThunk(
    "weather/getCurrentWeather",
    async({city,unit},thunkApi)=>{
        try {
            const response = await fetchCurrentWeather(city, unit);
            return response;
          } catch (error) {
            return thunkApi.rejectWithValue(error.message);
          }
    }
);

export const getFiveDayForecast = createAsyncThunk(
    "weather/getFiveDayForecast",
    async ({ city, unit }, thunkApi) => {
      try {
        const response = await fetchFiveDayForecast(city, unit);
        return response;
      } catch (error) {
        return thunkApi.rejectWithValue(error.message);
      }
    }
  );

  const weatherSlice= createSlice({
    name:'weather',
    initialState:{
        currentWeather:null,
        fiveDayForecast:null,
        status:'idle',
        error:null,
    },

    reducers:{},
    extraReducers:(builder)=>{
        builder
        // Current Weather
          .addCase(getCurrentWeather.pending,(state)=>{
            state.status='loading';
          })
          .addCase(getCurrentWeather.fulfilled,(state,action)=>{
            state.status='succeeded';
            state.currentWeather=action.payload;
          })
          .addCase(getCurrentWeather.rejected,(state,action)=>{
            state.status="failed";
            state.error='Please enter a valid city name.';
          })
        //   5day Weather
        .addCase(getFiveDayForecast.pending, (state) => {
            state.status = "loading";
          })
          .addCase(getFiveDayForecast.fulfilled, (state, action) => {
            state.status = "succeeded";
            state.fiveDayForecast = action.payload;
          })
          .addCase(getFiveDayForecast.rejected, (state, action) => {
            state.status = "failed";
            state.error = 'Please enter a valid city name.';
          });
    }
  })

  export default weatherSlice.reducer