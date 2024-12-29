const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createUser, getUserByEmail, getUserById, updateUser, deleteUser } = require('../services/services');
const { createGoal, getGoalsByUserId, getGoalById, updateGoal, deleteGoal } = require('../services/services');
const { createProgress, getProgressByGoalId, getProgressById, updateProgress, deleteProgress } = require('../services/services');
const { secretKey, tokenExpiration } = require('../../config/config');

const userRegistration = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await createUser({ email, password: hashedPassword });
        const token = jwt.sign({ userId: newUser._id }, secretKey, { expiresIn: tokenExpiration });
        res.status(201).json({ message: "User registered successfully", token, userId: newUser._id });
    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Error registering user", error: error.message });
    }
};

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: tokenExpiration });
          res.status(200).json({ message: "User logged in successfully", token, userId: user._id });
    } catch (error) {
        console.error("Error logging in user:", error);
         res.status(500).json({ message: "Error logging in user", error: error.message });
    }
};

const getUser = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await getUserById(userId);
        if (!user) {
             return res.status(404).json({ message: "User not found" });
         }
        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
         res.status(500).json({ message: "Error fetching user", error: error.message });
    }
};

const updateUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const updateData = req.body;
         if (Object.keys(updateData).length === 0) {
             return res.status(400).json({ message: "No data provided for update" });
         }
        const updatedUser = await updateUser(userId, updateData);
        if(!updatedUser){
            return res.status(404).json({message: "User not found"});
        }
         res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error("Error updating user profile:", error);
         res.status(500).json({ message: "Error updating user profile", error: error.message });
    }
};

const deleteUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const deletedUser = await deleteUser(userId);
        if (!deletedUser) {
              return res.status(404).json({ message: "User not found" });
         }
         res.status(200).json({ message: "User deleted successfully", deletedUser });
    } catch (error) {
        console.error("Error deleting user:", error);
       res.status(500).json({ message: "Error deleting user", error: error.message });
    }
};

const createNewGoal = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, description, target } = req.body;
         if (!name || !description || !target) {
              return res.status(400).json({ message: "Name, description, and target are required" });
         }
        const newGoal = await createGoal({ userId, name, description, target });
        res.status(201).json({ message: "Goal created successfully", goal: newGoal });
    } catch (error) {
        console.error("Error creating goal:", error);
         res.status(500).json({ message: "Error creating goal", error: error.message });
    }
};

const getUserGoals = async (req, res) => {
     try {
         const userId = req.userId;
          const goals = await getGoalsByUserId(userId);
         res.status(200).json(goals);
     } catch (error) {
         console.error("Error fetching user goals:", error);
        res.status(500).json({ message: "Error fetching user goals", error: error.message });
     }
};

const getSingleGoal = async (req, res) => {
    try {
        const goalId = req.params.goalId;
        const goal = await getGoalById(goalId);
        if (!goal) {
            return res.status(404).json({ message: "Goal not found" });
        }
        res.status(200).json(goal);
    } catch (error) {
         console.error("Error fetching goal:", error);
        res.status(500).json({ message: "Error fetching goal", error: error.message });
    }
};

const updateExistingGoal = async (req, res) => {
    try {
        const goalId = req.params.goalId;
         const updateData = req.body;
          if (Object.keys(updateData).length === 0) {
             return res.status(400).json({ message: "No data provided for update" });
         }
        const updatedGoal = await updateGoal(goalId, updateData);
         if (!updatedGoal) {
             return res.status(404).json({ message: "Goal not found" });
          }
         res.status(200).json({ message: "Goal updated successfully", goal: updatedGoal });
    } catch (error) {
        console.error("Error updating goal:", error);
       res.status(500).json({ message: "Error updating goal", error: error.message });
    }
};

const deleteExistingGoal = async (req, res) => {
    try {
        const goalId = req.params.goalId;
         const deletedGoal = await deleteGoal(goalId);
         if(!deletedGoal){
             return res.status(404).json({message: "Goal not found"})
         }
         res.status(200).json({ message: "Goal deleted successfully", goal: deletedGoal });
    } catch (error) {
        console.error("Error deleting goal:", error);
        res.status(500).json({ message: "Error deleting goal", error: error.message });
    }
};

const createNewProgress = async (req, res) => {
    try {
        const goalId = req.params.goalId;
        const { date, value } = req.body;
        if (!date || !value) {
            return res.status(400).json({ message: "Date and value are required" });
        }
        const newProgress = await createProgress({ goalId, date, value });
        res.status(201).json({ message: "Progress created successfully", progress: newProgress });
    } catch (error) {
        console.error("Error creating progress:", error);
         res.status(500).json({ message: "Error creating progress", error: error.message });
    }
};


const getGoalProgress = async (req, res) => {
    try {
      const goalId = req.params.goalId;
        const progress = await getProgressByGoalId(goalId);
        res.status(200).json(progress);
    } catch (error) {
        console.error("Error fetching goal progress:", error);
         res.status(500).json({ message: "Error fetching goal progress", error: error.message });
    }
};


const getSingleProgress = async (req, res) => {
    try {
        const progressId = req.params.progressId;
        const progress = await getProgressById(progressId);
         if (!progress) {
             return res.status(404).json({ message: "Progress not found" });
        }
         res.status(200).json(progress);
    } catch (error) {
         console.error("Error fetching progress:", error);
         res.status(500).json({ message: "Error fetching progress", error: error.message });
    }
};


const updateExistingProgress = async (req, res) => {
    try {
        const progressId = req.params.progressId;
        const updateData = req.body;
         if (Object.keys(updateData).length === 0) {
             return res.status(400).json({ message: "No data provided for update" });
        }
        const updatedProgress = await updateProgress(progressId, updateData);
        if(!updatedProgress){
            return res.status(404).json({message: "Progress not found"})
        }
         res.status(200).json({ message: "Progress updated successfully", progress: updatedProgress });
    } catch (error) {
       console.error("Error updating progress:", error);
         res.status(500).json({ message: "Error updating progress", error: error.message });
    }
};


const deleteExistingProgress = async (req, res) => {
    try {
         const progressId = req.params.progressId;
         const deletedProgress = await deleteProgress(progressId);
         if(!deletedProgress){
            return res.status(404).json({message: "Progress not found"})
        }
         res.status(200).json({ message: "Progress deleted successfully", progress: deletedProgress });
    } catch (error) {
      console.error("Error deleting progress:", error);
       res.status(500).json({ message: "Error deleting progress", error: error.message });
    }
};

module.exports = {
    userRegistration,
    userLogin,
    getUser,
    updateUserProfile,
    deleteUserProfile,
    createNewGoal,
    getUserGoals,
    getSingleGoal,
    updateExistingGoal,
    deleteExistingGoal,
    createNewProgress,
    getGoalProgress,
    getSingleProgress,
    updateExistingProgress,
    deleteExistingProgress
};