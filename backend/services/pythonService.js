const axios = require('axios');

class PythonService {
  constructor() {
    this.baseURL = process.env.PYTHON_SERVICE_URL || 'https://python-service-fxlm.onrender.com';
    this.apiKey = process.env.PYTHON_SERVICE_API_KEY;
  }

  async getSuggestions(userId) {
    try {
      console.log(`Calling Python service: ${this.baseURL}/analyze/${userId}`);
      
      const config = {
        headers: {}
      };
      
      // Add API key if it exists
      if (this.apiKey) {
        config.headers['X-API-Key'] = this.apiKey;
      }
      
      const response = await axios.get(`${this.baseURL}/analyze/${userId}`, config);
      console.log('Python service response:', response.data);
      
      // Ensure the response has the expected structure
      if (response.data && response.data.suggestions) {
        return {
          success: true,
          data: {
            suggestions: response.data.suggestions
          }
        };
      } else {
        // If Python service returns data but not in expected format
        return {
          success: false,
          message: 'Python service returned unexpected data format'
        };
      }
      
    } catch (error) {
      console.error('Error fetching suggestions from Python service:', error.message);
      
      if (error.response) {
        console.error('Python service response error:', error.response.status, error.response.data);
        return {
          success: false,
          message: `Python service error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`
        };
      } else if (error.request) {
        console.error('No response received from Python service');
        return {
          success: false,
          message: 'Python service is not responding. Please check if the service is running.'
        };
      } else {
        return {
          success: false,
          message: `Error setting up request: ${error.message}`
        };
      }
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