import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchEarthquakes = async () => {
  try {
    const response = await axios.get(`${API_URL}/earthquakes`);
    return response.data;
  } catch (error) {
    console.error('Deprem verileri çekilirken hata oluştu:', error);
    throw error;
  }
};

export const fetchDashboardStats = async () => {
  try {
    const response = await axios.get(`${API_URL}/earthquakes/stats/dashboard`);
    return response.data;
  } catch (error) {
    console.error('Dashboard istatistikleri çekilirken hata oluştu:', error);
    throw error;
  }
};