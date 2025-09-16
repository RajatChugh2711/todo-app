import express from 'express';
import { addTodo } from '../controllers/todo.controller.js';
import { multerUpload } from '../middlewares/multer.middleware.js';
const router = express.Router();

// add todo
router.route('/add').post(
    multerUpload.fields([
    {
      name: "todoImage",
      maxCount: 1,
    },
  ]),
  addTodo);

export default router;