// src/services/AuthService.js
import axios from 'axios';

export async function setRatingMiddle(ratingCredentials) {
  {
    console.log(ratingCredentials);
    return await axios
      .put('/api/offer/rating', ratingCredentials)
      .then(response => response.data);
  }
}

export async function getRating(id) {
  const response = await axios.get('/api/offer/rating', {
    params: {
      angebot_id: id
    }
  });
  return response.data;
}