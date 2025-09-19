const express = require('express');
const pythonService = require('../services/pythonService');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

// @desc    Get smart suggestions for user
// @route   GET /api/suggestions
// @access  Private
router.get('/', async (req, res) => {
  try {
    const suggestions = await pythonService.getSuggestions(req.user.id);
    
    res.status(200).json(suggestions);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Get budget recommendations for user
// @route   GET /api/suggestions/budget-recommendations
// @access  Private
router.get('/budget-recommendations', async (req, res) => {
  try {
    const recommendations = await pythonService.getBudgetRecommendations(req.user.id);
    
    res.status(200).json(recommendations);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

// @desc    Get full financial analysis for user
// @route   GET /api/suggestions/full-analysis
// @access  Private
router.get('/full-analysis', async (req, res) => {
  try {
    const analysis = await pythonService.getFullAnalysis(req.user.id);
    
    res.status(200).json(analysis);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
});

module.exports = router;