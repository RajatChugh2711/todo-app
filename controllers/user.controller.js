import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const registerUser = asyncHandler(async (req, res) => {
    try {
        const {username, email, password} = req.body;
        // validate request
        if(!username || !email || !password) {
            return res.status(400).json(new ApiError(400, 'All fields are required'));
        }
        const isUserExists = await User.findOne({$or: [{email}, {username}]});
        // check if user already exists
        if(isUserExists) {
            return res.status(400).json(new ApiError(400, 'User already exists with this email or username'));
        }
        const user = await User.create({username, email, password});
        await user.save();
        // remove password and __v from the response
        const updatedResponse = await User.findById(user._id).select('-password -__v');
        // send response
        return res.status(201).json(new ApiResponse(201, 'User registered successfully', updatedResponse));
    } catch (error) {
        // handle unexpected errors
        return res.status(500).json(new ApiError(500, 'Internal Server Error', error?.message || ''));
    }
})

const loginUser = async (req, res) => {
    try {
    } catch (error) {
    }
}
export { registerUser, loginUser };