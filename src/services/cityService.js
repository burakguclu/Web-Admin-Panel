import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchCities = async () => {
  try {
    const response = await axios.get(`${API_URL}/cities`);
    return response.data;
  } catch (error) {
    console.error('Şehir verileri çekilirken hata oluştu:', error);
    throw error;
  }
};

export const updateCityRiskLevel = async (cityId, riskLevel) => {
  try {
    const response = await axios.put(`${API_URL}/cities/${cityId}/risk-level`, { riskLevel });
    return response.data;
  } catch (error) {
    console.error('Şehir risk seviyesi güncellenirken hata oluştu:', error);
    throw error;
  }
}; 