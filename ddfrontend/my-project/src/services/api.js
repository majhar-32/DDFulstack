import axios from 'axios';


// আপনার ব্যাকএন্ড সার্ভারের বেস URL
const API_URL = 'http://localhost:8080/api/';
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
 * যখন ব্যবহারকারী লগইন করবে, আপনি ব্যাকএন্ড থেকে একটি টোকেন (JWT) পাবেন।
 * সেই টোকেনটি localStorage-এ সেভ করে রাখতে হবে।
 * নিচের কোডটি প্রতিটি API রিকোয়েস্টের সাথে স্বয়ংক্রিয়ভাবে সেই টোকেনটি হেডার-এ যোগ করে দেবে।
*/
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // লগইনের পর টোকেন এখানে সেভ থাকবে
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;