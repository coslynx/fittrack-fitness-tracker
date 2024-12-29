const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 50,
        validate: {
            validator: function (v) {
                return /^[a-zA-Z0-9_]+$/.test(v);
            },
            message: 'Username must contain only letters, numbers, and underscores'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        validate: {
            validator: function (v) {
                return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
            },
            message: 'Password must contain at least 8 characters, including one uppercase letter, one lowercase letter, one number, and one special character.'
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});


userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

const goalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 100
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500
    },
    target: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 20
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
       type: Date
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

});

const progressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    goalId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Goal'
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    value: {
        type: Number,
        required: true,
        min: 0
    },
     notes: {
        type: String,
        trim: true,
        maxlength: 500
    },
     createdAt: {
        type: Date,
        default: Date.now
    }
});


const User = mongoose.model('User', userSchema);
const Goal = mongoose.model('Goal', goalSchema);
const Progress = mongoose.model('Progress', progressSchema);

module.exports = {
    User,
    Goal,
    Progress
};