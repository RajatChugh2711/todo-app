import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';

// User Schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });

// Middleware to hash password before saving
userSchema.pre('save', function(next) {
    // Hash password before saving (pseudo-code, implement actual hashing)
    if (this.isModified('password')) {
        this.password = bcrypt.hashSync(this.password, 10);
    }
    next();
});

// Method to compare password for login
userSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compareSync(candidatePassword, this.password);
};

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
}
// Export the model
export const User = mongoose.model('User', userSchema);