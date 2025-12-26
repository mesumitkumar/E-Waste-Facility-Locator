// Simple validation middleware
const validate = {
  register: (req, res, next) => {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    next();
  },

  login: (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    next();
  },

  booking: (req, res, next) => {
    const { deviceType, weight, pickupAddress, pickupDate, pickupTimeSlot } = req.body;
    
    if (!deviceType || !weight || !pickupAddress || !pickupDate || !pickupTimeSlot) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be filled'
      });
    }

    if (weight <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Weight must be greater than 0'
      });
    }

    next();
  }
};

module.exports = validate;