const Budget = require('../models/Budget');
const Expense = require('../models/Expense');

// @desc    Get all budgets for a user
// @route   GET /api/budgets
// @access  Private
exports.getBudgets = async (req, res, next) => {
  try {
    const { month, year } = req.query;
    const currentDate = new Date();
    const currentMonth = month || currentDate.getMonth() + 1;
    const currentYear = year || currentDate.getFullYear();
    
    let query = { userId: req.user.id };
    
    if (month && year) {
      query.month = parseInt(month);
      query.year = parseInt(year);
    }
    
    const budgets = await Budget.find(query);
    
    // Get spending for each budget category
    const budgetsWithSpending = await Promise.all(
      budgets.map(async (budget) => {
        // Calculate start and end of month
        const startDate = new Date(budget.year, budget.month - 1, 1);
        const endDate = new Date(budget.year, budget.month, 0, 23, 59, 59);
        
        // Get total spent for this category in the budget month
        const spending = await Expense.aggregate([
          {
            $match: {
              userId: req.user._id,
              category: budget.category,
              date: { $gte: startDate, $lte: endDate }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: '$amount' }
            }
          }
        ]);
        
        const spent = spending.length > 0 ? spending[0].total : 0;
        const percentage = (spent / budget.monthlyLimit) * 100;
        
        let status = 'under';
        if (percentage >= 100) {
          status = 'over';
        } else if (percentage >= 80) {
          status = 'warning';
        }
        
        return {
          ...budget.toObject(),
          spent,
          percentage,
          status
        };
      })
    );
    
    res.status(200).json({
      success: true,
      data: budgetsWithSpending
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get single budget
// @route   GET /api/budgets/:id
// @access  Private
exports.getBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      });
    }

    res.status(200).json({
      success: true,
      data: budget
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Create new budget
// @route   POST /api/budgets
// @access  Private
exports.createBudget = async (req, res, next) => {
  try {
    req.body.userId = req.user.id;
    
    // Check if budget already exists for this category and month
    const existingBudget = await Budget.findOne({
      userId: req.user.id,
      category: req.body.category,
      month: req.body.month,
      year: req.body.year
    });
    
    if (existingBudget) {
      return res.status(400).json({
        success: false,
        message: 'Budget already exists for this category and month'
      });
    }
    
    const budget = await Budget.create(req.body);

    res.status(201).json({
      success: true,
      data: budget
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Update budget
// @route   PUT /api/budgets/:id
// @access  Private
exports.updateBudget = async (req, res, next) => {
  try {
    let budget = await Budget.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      });
    }

    budget = await Budget.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: budget
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Delete budget
// @route   DELETE /api/budgets/:id
// @access  Private
exports.deleteBudget = async (req, res, next) => {
  try {
    const budget = await Budget.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      });
    }

    await Budget.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get budget alerts
// @route   GET /api/budgets/alerts
// @access  Private
exports.getBudgetAlerts = async (req, res, next) => {
  try {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    console.log(req.user._id);
    
    // Use req.user._id instead of req.user.id for consistency
    const budgets = await Budget.find({
      userId: req.user._id, // Changed from req.user.id to req.user._id
      month: currentMonth,
      year: currentYear
    });
    
    const alerts = [];
    
    for (const budget of budgets) {
      // Calculate start and end of month
      const startDate = new Date(budget.year, budget.month - 1, 1);
      const endDate = new Date(budget.year, budget.month, 0, 23, 59, 59);
      
      // Get total spent for this category in the budget month
      const spending = await Expense.aggregate([
        {
          $match: {
            userId: req.user._id,
            category: budget.category,
            date: { $gte: startDate, $lte: endDate }
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' }
          }
        }
      ]);
      
      const spent = spending.length > 0 ? spending[0].total : 0;
      const percentage = (spent / budget.monthlyLimit) * 100;
      
      if (percentage >= 100) {
        alerts.push({
          type: 'danger',
          message: `You've exceeded your ${budget.category} budget by ${(percentage - 100).toFixed(2)}% (₹${spent} spent vs ₹${budget.monthlyLimit} budgeted)`,
          category: budget.category,
          spent,
          budgeted: budget.monthlyLimit,
          percentage
        });
      } else if (percentage >= 80) {
        alerts.push({
          type: 'warning',
          message: `You've used ${percentage.toFixed(2)}% of your ${budget.category} budget (₹${spent} spent vs ₹${budget.monthlyLimit} budgeted)`,
          category: budget.category,
          spent,
          budgeted: budget.monthlyLimit,
          percentage
        });
      }
    }
    
    res.status(200).json({
      success: true,
      data: alerts
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};