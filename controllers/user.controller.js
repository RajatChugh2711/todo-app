import { User } from '../models/user.model.js';
const registerUser = async (req, res) => {
    try {
        const {username, email, password} = req.body;
        if(!username || !email || !password) {
            return res.status(400).json({message: 'All fields are required'});
        }
        const isUserExists = await User.findOne({$or: [{email}, {username}]});
        if(isUserExists) {
            return res.status(409).json({message: 'User already exists'});
        }
        const user = await User.create({username, email, password});
        await user.save();
        const updatedResponse = await User.findById(user._id).select('-password -__v');
        return res.status(201).json({message: 'User registered successfully', user: updatedResponse});
    } catch (error) {
        return res.status(500).json({message: 'Internal server error', error: error.message});
    }
}

const loginUser = async (req, res) => {
    try {
    } catch (error) {
    }
}
export { registerUser, loginUser };