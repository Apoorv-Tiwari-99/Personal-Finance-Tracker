const axios = require('axios');
class PythonService {
  constructor() {
    this.baseURL = process.env.PYTHON_SERVICE_URL || 'http://localhost:5001';
  }

  // In your pythonService.js
async getSuggestions(userId) {
  try {
    const response = await axios.get(`${this.baseURL}/analyze/${userId}`, {
      timeout: 10000, // 10 second timeout
    });
    
    console.log('Python service response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching suggestions from Python service:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('Python service is not running or not accessible');
    } else if (error.code === 'ETIMEDOUT') {
      console.error('Python service request timed out');
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
