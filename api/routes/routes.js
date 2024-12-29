const express = require('express');
const router = express.Router();
const controllers = require('../controllers/controllers');
const authMiddleware = require('../middleware/authMiddleware');

// User authentication routes
router.post('/register', controllers.registerUser);
router.post('/login', controllers.loginUser);

// Protected routes - require authentication
router.use(authMiddleware.authenticateToken);

// Goal routes
router.post('/goals', controllers.createGoal);
router.get('/goals', controllers.getUserGoals);
router.put('/goals/:id', controllers.updateGoal);
router.delete('/goals/:id', controllers.deleteGoal);

// Progress routes
router.post('/progress/:goalId', controllers.addProgress);
router.get('/progress/:goalId', controllers.getGoalProgress);


module.exports = router;