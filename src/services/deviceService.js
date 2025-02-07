import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const fetchDevices = async () => {
  try {
    const response = await axios.get(`${API_URL}/devices`);
    return response.data;
  } catch (error) {
    console.error('Cihaz verileri çekilirken hata oluştu:', error);
    throw error;
  }
};

export const updateDeviceStatus = async (deviceId, status) => {
  try {
    const response = await axios.put(`${API_URL}/devices/${deviceId}/status`, { status });
    return response.data;
  } catch (error) {
    console.error('Cihaz durumu güncellenirken hata oluştu:', error);
    throw error;
  }
};

export const updateDeviceMaintenance = async (deviceId) => {
  try {
    const response = await axios.put(`${API_URL}/devices/${deviceId}/maintenance`);
    return response.data;
  } catch (error) {
    console.error('Cihaz bakımı güncellenirken hata oluştu:', error);
    throw error;
  }
}; 