const MonthlyReport = require('../models/MonthlyReport');
const Expense = require('../models/Expense');
const Budget = require('../models/Budget');

// @desc    Generate monthly report
// @route   POST /api/reports/generate
// @access  Private
exports.generateMonthlyReport = async (req, res, next) => {
  try {
    const { month, year } = req.body;
    const currentDate = new Date();
    const reportMonth = month || currentDate.getMonth();
    const reportYear = year || currentDate.getFullYear();
    
    // Calculate start and end of month
    const startDate = new Date(reportYear, reportMonth - 1, 1);
    const endDate = new Date(reportYear, reportMonth, 0, 23, 59, 59);
    
    // Check if report already exists
    const existingReport = await MonthlyReport.findOne({
      userId: req.user.id,
      month: reportMonth,
      year: reportYear
    });
    
    if (existingReport) {
      return res.status(400).json({
        success: false,
        message: 'Report already exists for this month'
      });
    }
    
    // Get total spent this month
    const totalSpentResult = await Expense.aggregate([
      {
        $match: {
          userId: req.user._id,
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
    
    const totalSpent = totalSpentResult.length > 0 ? totalSpentResult[0].total : 0;
    
    // Get category-wise spending
    const categorySpending = await Expense.aggregate([
      {
        $match: {
          userId: req.user._id,
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' }
        }
      },
      {
        $sort: { total: -1 }
      }
    ]);
    
    const topCategory = categorySpending.length > 0 ? {
      category: categorySpending[0]._id,
      amount: categorySpending[0].total
    } : null;
    
    // Get overbudget categories
    const budgets = await Budget.find({
      userId: req.user.id,
      month: reportMonth,
      year: reportYear
    });
    
    const overbudgetCategories = [];
    
    for (const budget of budgets) {
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
      
      if (spent > budget.monthlyLimit) {
        overbudgetCategories.push({
          category: budget.category,
          budgeted: budget.monthlyLimit,
          spent: spent
        });
      }
    }
    
    // Create report
    const report = await MonthlyReport.create({
      userId: req.user.id,
      month: reportMonth,
      year: reportYear,
      totalSpent,
      topCategory,
      overbudgetCategories
    });
    
    res.status(201).json({
      success: true,
      data: report
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get monthly reports
// @route   GET /api/reports
// @access  Private
exports.getMonthlyReports = async (req, res, next) => {
  try {
    const { limit = 3 } = req.query;
    
    const reports = await MonthlyReport.find({ userId: req.user.id })
      .sort({ year: -1, month: -1 })
      .limit(parseInt(limit));
    
    res.status(200).json({
      success: true,
      data: reports
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};

// @desc    Get single monthly report
// @route   GET /api/reports/:id
// @access  Private
exports.getMonthlyReport = async (req, res, next) => {
  try {
    const report = await MonthlyReport.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.status(200).json({
      success: true,
      data: report
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message
    });
  }
};