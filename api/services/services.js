const mongoose = require('mongoose');
const User = require('../models/models').User;
const Goal = require('../models/models').Goal;
const Progress = require('../models/models').Progress;

const userService = {
  createUser: async (userData) => {
    try {
        const newUser = new User(userData);
        await newUser.save();
        return newUser;
    } catch (error) {
        console.error("Error creating user:", error);
        if (error.code === 11000) {
            throw new Error("User with this email already exists.");
          }
        throw new Error("Failed to create user.");
    }
  },

  getUserByEmail: async (email) => {
    try {
      const user = await User.findOne({ email: email });
      return user;
    } catch (error) {
      console.error("Error getting user by email:", error);
      throw new Error("Failed to get user by email.");
    }
  },

  getUserById: async (id) => {
    try {
      const user = await User.findById(id);
      return user;
    } catch (error) {
      console.error("Error getting user by id:", error);
      throw new Error("Failed to get user by id.");
    }
  },

  updateUser: async (id, updateData) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      if(error.code === 11000){
        throw new Error("Email already exists.");
      }
        throw new Error("Failed to update user.");
    }
  },

  deleteUser: async (id) => {
    try {
      await User.findByIdAndDelete(id);
      return { message: "User deleted successfully." };
    } catch (error) {
      console.error("Error deleting user:", error);
      throw new Error("Failed to delete user.");
    }
  },
};

const goalService = {
  createGoal: async (goalData) => {
    try {
      const newGoal = new Goal(goalData);
        await newGoal.save();
        return newGoal;
    } catch (error) {
        console.error("Error creating goal:", error);
      throw new Error("Failed to create goal.");
    }
  },

  getGoalById: async (id) => {
      try {
        const goal = await Goal.findById(id);
        return goal;
      } catch (error) {
          console.error("Error getting goal by id:", error);
        throw new Error("Failed to get goal by ID.");
      }
  },

    getGoalsByUserId: async (userId) => {
        try {
          const goals = await Goal.find({userId: userId});
          return goals;
        } catch (error) {
            console.error("Error getting goals by user id:", error);
          throw new Error("Failed to get goals by User ID.");
        }
    },


  updateGoal: async (id, updateData) => {
      try {
        const updatedGoal = await Goal.findByIdAndUpdate(id, updateData, {new: true, runValidators: true});
        return updatedGoal;
      } catch (error) {
          console.error("Error updating goal:", error);
        throw new Error("Failed to update goal.");
      }
  },

  deleteGoal: async (id) => {
    try {
      await Goal.findByIdAndDelete(id);
      return { message: "Goal deleted successfully." };
    } catch (error) {
      console.error("Error deleting goal:", error);
      throw new Error("Failed to delete goal.");
    }
  },
};

const progressService = {
    createProgress: async (progressData) => {
        try {
          const newProgress = new Progress(progressData);
          await newProgress.save();
          return newProgress;
        } catch (error) {
          console.error("Error creating progress:", error);
          throw new Error("Failed to create progress.");
        }
      },
    getProgressById: async (id) => {
        try {
          const progress = await Progress.findById(id);
          return progress;
        } catch (error) {
          console.error("Error getting progress by id:", error);
          throw new Error("Failed to get progress by id.");
        }
      },
      getProgressByGoalId: async (goalId) => {
        try {
          const progress = await Progress.find({ goalId: goalId });
          return progress;
        } catch (error) {
          console.error("Error getting progress by goal id:", error);
          throw new Error("Failed to get progress by goal id.");
        }
      },

    updateProgress: async (id, updateData) => {
        try {
          const updatedProgress = await Progress.findByIdAndUpdate(id, updateData, {new: true, runValidators: true});
          return updatedProgress;
        } catch (error) {
          console.error("Error updating progress:", error);
          throw new Error("Failed to update progress.");
        }
      },

    deleteProgress: async (id) => {
        try {
           await Progress.findByIdAndDelete(id);
          return { message: "Progress deleted successfully." };
        } catch (error) {
            console.error("Error deleting progress:", error);
          throw new Error("Failed to delete progress.");
        }
      },
}

module.exports = {
  userService,
  goalService,
  progressService
};