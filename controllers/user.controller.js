import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { generateAccessAndRefreshToken } from '../utils/generateAccessRefreshToken.js';

const registerUser = asyncHandler(async (req, res) => {
    const {username, email, password, fullName } = req.body;
    // validate request
    if(!username) {
        throw new ApiError(400, 'Username is required');
    }
    if(!email) {
        throw new ApiError(400, 'Email is required');
    }
    if(!password) {
        throw new ApiError(400, 'Password is required');
    }
    if(!fullName) {
        throw new ApiError(400, 'Full name is required');
    }
    const isUserExists = await User.findOne({$or: [{email}, {username}]});
    // check if user already exists
    if(isUserExists) {
        throw new ApiError(400, 'User already exists with this email or username');
    }
    const user = await User.create({username, email, password, fullName});
    await user.save();
    // remove password and __v from the response
    const updatedResponse = await User.findById(user._id).select('-password -__v');
    // send response
    return res.status(201).json(new ApiResponse(201, 'User registered successfully', updatedResponse));
})

const loginUser = asyncHandler(async (req, res) => {
    // Implement login logic here
    const { email, password } = req.body;
    
    // Validate request
    if (!email) {
        throw new ApiError(400, 'Email is required');
    }
    if (!password) {
        throw new ApiError(400, 'Password is required');
    }
    // Check if user exists
    const isUserExists = await User.findOne({ email });
    // If user does not exist, return error
    if (!isUserExists) {
        throw new ApiError(404, 'User not found');
    }
    // Compare password
    const isPasswordValid = await isUserExists.comparePassword(password);
    // If password is invalid, return error
    if (!isPasswordValid) {
        throw new ApiError(401, 'Invalid password');
    }
    // Generate access and refresh tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(isUserExists?._id);
    // Remove password and __v from the response
    const loggedInUser = await User.findById(isUserExists?._id).select('-password -__v');
    // Send response
    return res.status(200).json(new ApiResponse(200, 'User logged in successfully', { user: loggedInUser, accessToken, refreshToken }));
})
export { registerUser, loginUser };