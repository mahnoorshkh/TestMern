const mongoose = require('mongoose');
const taskModel = require('../model/taskModel');
const { paginate } = require('../helper');

exports.createTask = async (req, res) => {
  try {
    const task = await taskModel.create({ ...req.body, userId: req.userId });
    res.status(201).json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getTasks = async (req, res) => {
  try {
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;

    const { skip, pagination } = await paginate(taskModel, { userId: req.userId }, page, limit);

    const tasks = await taskModel.find({ userId: req.userId })
      .skip(skip)
      .limit(pagination.itemsPerPage);

    res.json({ data: tasks, pagination });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.updateTask = async (req, res) => {
  try {
    const task = await taskModel.findOne({ _id: req.params.id, userId: req.userId });
    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (req.body.status === 'completed' && task.dueDate > new Date()) {
      return res.status(400).json({ error: 'Cannot complete task before due date' });
    }

    Object.assign(task, req.body);
    await task.save();

    res.json(task);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getOverdueTasks = async (req, res) => {
  try {
    const tasks = await taskModel.find({
      userId: req.userId,
      status: { $ne: 'completed' },
      dueDate: { $lt: new Date() }
    });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
