import mongoose from "mongoose";

// Todo Schema
const todoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    todoImage: {
        type: String,
        required: false
    },
    isCompleted: {
        type: Boolean,
        required: false,
        default: false
    }
}, { timestamps: true });

// Export the model
export const Todo = mongoose.model('Todo', todoSchema);