const express = require('express');
const {
  createTask,
  getTasks,
  updateTask,
  getOverdueTasks
} = require('../controller/taskController');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', auth, createTask);
router.get('/get', auth, getTasks);
router.patch('/:id', auth, updateTask);
router.get('/overdue', auth, getOverdueTasks);

module.exports = router;
