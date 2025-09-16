import { Todo } from "../models/todo.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

// add todo
const addTodo = asyncHandler(async (req, res) => {
  // getting data from req body
  const { title, description } = req.body;
  // validation - not empty
  if ([title, description].some((field) => field?.trim() === "")) {
    throw new ApiError(400, "All fields are required");
  }
  // check if task already exists or not:
  const isTodoExists = await Todo.findOne({ title: title });
  if (isTodoExists) {
    throw new ApiError(400, "Todo already exists.");
  }
  const imageLocalPath = req?.files?.todoImage[0]?.path;
  if (!imageLocalPath) {
    throw new ApiError(400, "Avatar Image is required");
  }
  // upload todo image to cloudinary
  const todoImageResponse = await uploadToCloudinary(imageLocalPath);
  console.log("🚀 ~ todoImageResponse:", todoImageResponse);

  // create a user object - creating entry to db
  const createdTodo = await Todo.create({
    title,
    description,
    todoImage: todoImageResponse?.url || "",
  });

  // check for todo creation
  if (!createdTodo) {
    throw new ApiError(500, "Something went wrong while todo creation.");
  }
  // return response
  return res
    .status(201)
    .json(new ApiResponse(200, createdTodo, "Todo created successfully"));
});

// export the functions
export { addTodo };
