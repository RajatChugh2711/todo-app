import { User } from '../models/user.model.js';
import { ApiError } from './ApiError.js';

export const generateAccessAndRefreshToken = async (userId) => {
    try {
        // find user by id
        const user = await User.findById(userId);
        if (!user) {
            // if user not found, throw error
            throw new ApiError(404, 'User not found');
        }
        // generate access and refresh token
        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        // storing value in user model
        user.accessToken = accessToken;
        // store hashed version of refresh token in db
        await user.save({ validateBeforeSave: false })

        // return response
        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, 'Something went wrong while generating access and refresh token.')
    }
}