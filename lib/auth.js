// lib/auth.js
import axios from 'axios';

export const loginUser = async (email, password) => {
  const response = await axios.post('/api/login', {
    email,
    password
  });

  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error('Failed to log in');
  }
};

export const logoutUser = async () => {
  const response = await axios.post('/api/logout');

  if (response.status === 200) {
    return response.data;
  } else {
    throw new Error('Failed to log out');
  }
};
