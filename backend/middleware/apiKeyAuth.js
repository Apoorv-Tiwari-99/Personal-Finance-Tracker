// middleware/apiKeyAuth.js
const apiKeyAuth = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    
    if (!apiKey || apiKey !== process.env.INTERNAL_API_KEY) {
      return res.status(401).json({
        success: false,
        message: 'Invalid API key'
      });
    }
    
    next();
  };
  
  module.exports = apiKeyAuth;