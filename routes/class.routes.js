const express = require('express');
const {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass
} = require('../controllers/class.controller');

const router = express.Router();

// @route   POST /api/classes
router.post('/', createClass);

// @route   GET /api/classes
router.get('/', getAllClasses);

// @route   GET /api/classes/:id
router.get('/:id', getClassById);

// @route   PUT /api/classes/:id
router.put('/:id', updateClass);

// @route   DELETE /api/classes/:id
router.delete('/:id', deleteClass);

module.exports = router;