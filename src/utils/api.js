import axios from 'axios';

export const fetchTickets = async () => {
  try {
    const response = await axios.get('https://api.quicksell.co/v1/internal/frontend-assignment');
    return response.data;
  } catch (error) {
    console.error('Error fetching tickets:', error);
    return { tickets: [] }; // Return an empty array in case of error
  }
};
