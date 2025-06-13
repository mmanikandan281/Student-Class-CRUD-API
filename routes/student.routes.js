const express = require('express');
const {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudentClass,
  deleteStudent,
  getStudentsByClass,
  getStudentsByStandard
} = require('../controllers/student.controller');

const router = express.Router();

// @route   POST /api/students
router.post('/', createStudent);

// @route   GET /api/students
router.get('/', getAllStudents);

// @route   GET /api/students/class/:standard/:division
router.get('/class/:standard/:division', getStudentsByClass);

// @route   GET /api/students/standard/:standard
router.get('/standard/:standard', getStudentsByStandard);

// @route   GET /api/students/:id
router.get('/:id', getStudentById);

// @route   PUT /api/students/:id/class
router.put('/:id/class', updateStudentClass);

// @route   DELETE /api/students/:id
router.delete('/:id', deleteStudent);

module.exports = router;