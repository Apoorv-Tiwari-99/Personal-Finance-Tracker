const axios = require('axios');

class PythonService {
  constructor() {
    this.baseURL = process.env.PYTHON_SERVICE_URL || 'http://localhost:5001';
    // Get the API key from an environment variable
    this.apiKey = process.env.PYTHON_SERVICE_API_KEY;
  }

  async getSuggestions(userId) {
    try {
      const response = await axios.get(`${this.baseURL}/analyze/${userId}`, {
        headers: {
          // Add the API key to the request header
          'X-API-Key': this.apiKey,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching suggestions from Python service:', error.message);
      // It's useful to log the full error for debugging
      if (error.response) {
        console.error('Python service response error:', error.response.status, error.response.data);
      }
      return {
        success: false,
        message: 'Unable to fetch suggestions at this time'
      };
    }
  }

  async getBudgetRecommendations(userId) {
    try {
      const response = await axios.get(`${this.baseURL}/budget-recommendations/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching budget recommendations from Python service:', error.message);
      return {
        success: false,
        message: 'Unable to fetch budget recommendations at this time'
      };
    }
  }

  async getFullAnalysis(userId) {
    try {
      const response = await axios.get(`${this.baseURL}/full-analysis/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching full analysis from Python service:', error.message);
      return {
        success: false,
        message: 'Unable to fetch financial analysis at this time'
      };
    }
  }
}

module.exports = new PythonService();