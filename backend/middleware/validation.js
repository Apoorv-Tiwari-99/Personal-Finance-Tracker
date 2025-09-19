exports.validateExpense = (req, res, next) => {
    const { amount, category, date, paymentMethod } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid amount'
      });
    }
    
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a category'
      });
    }
    
    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a date'
      });
    }
    
    if (!paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a payment method'
      });
    }
    
    next();
  };
  
  exports.validateBudget = (req, res, next) => {
    const { category, monthlyLimit, month, year } = req.body;
    
    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a category'
      });
    }
    
    if (!monthlyLimit || monthlyLimit <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid monthly limit'
      });
    }
    
    if (!month || month < 1 || month > 12) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid month (1-12)'
      });
    }
    
    if (!year || year < 2000 || year > 2100) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid year'
      });
    }
    
    next();
  };