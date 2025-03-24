import axios from 'axios';

const API_URL = '/api/messages';

export const getAllMessages = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

export const createMessage = async (message) => {
  const response = await axios.post(API_URL, message);
  return response.data;
};