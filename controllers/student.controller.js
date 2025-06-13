const Student = require('../models/student.model');
const Class = require('../models/class.model');
const Joi = require('joi');

// Validation schemas
const studentValidationSchema = Joi.object({
  name: Joi.string().min(2).max(100).required().trim().messages({
    'string.min': 'Name must be at least 2 characters long',
    'string.max': 'Name cannot exceed 100 characters',
    'string.empty': 'Student name is required',
    'any.required': 'Student name is required'
  }),
  rollNo: Joi.string().required().trim().messages({
    'string.empty': 'Roll number is required',
    'any.required': 'Roll number is required'
  }),
  mobileNo: Joi.string().pattern(/^[6-9]\d{9}$/).required().messages({
    'string.pattern.base': 'Please enter a valid 10-digit mobile number',
    'string.empty': 'Mobile number is required',
    'any.required': 'Mobile number is required'
  }),
  classId: Joi.string().required().messages({
    'string.empty': 'Class ID is required',
    'any.required': 'Class ID is required'
  })
});

const updateClassValidationSchema = Joi.object({
  standard: Joi.string().required().trim().messages({
    'string.empty': 'Standard is required',
    'any.required': 'Standard is required'
  }),
  division: Joi.string().required().trim().messages({
    'string.empty': 'Division is required',
    'any.required': 'Division is required'
  })
});

// @desc    Create a new student
// @route   POST /api/students
// @access  Public
const createStudent = async (req, res, next) => {
  try {
    // Validate request body
    const { error, value } = studentValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }

    const { name, rollNo, mobileNo, classId } = value;

    // Check if class exists
    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    // Check if roll number already exists
    const existingStudent = await Student.findOne({ rollNo });
    if (existingStudent) {
      return res.status(409).json({
        success: false,
        message: 'Student with this roll number already exists'
      });
    }

    // Create new student
    const newStudent = new Student({ name, rollNo, mobileNo, classId });
    const savedStudent = await newStudent.save();
    
    // Populate class data
    await savedStudent.populate('classId');

    res.status(201).json({
      success: true,
      message: 'Student created successfully',
      data: savedStudent
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all students
// @route   GET /api/students
// @access  Public
const getAllStudents = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const students = await Student.find()
      .populate('classId')
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Student.countDocuments();

    res.status(200).json({
      success: true,
      count: students.length,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      data: students
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get student by ID
// @route   GET /api/students/:id
// @access  Public
const getStudentById = async (req, res, next) => {
  try {
    const student = await Student.findById(req.params.id).populate('classId');
    
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student's class
// @route   PUT /api/students/:id/class
// @access  Public
const updateStudentClass = async (req, res, next) => {
  try {
    // Validate request body
    const { error, value } = updateClassValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }

    const { standard, division } = value;

    // Check if student exists
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Find the class by standard and division
    const targetClass = await Class.findOne({ standard, division });
    if (!targetClass) {
      return res.status(404).json({
        success: false,
        message: `Class ${standard}-${division} not found`
      });
    }

    // Update student's class
    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      { classId: targetClass._id },
      { new: true, runValidators: true }
    ).populate('classId');

    res.status(200).json({
      success: true,
      message: 'Student class updated successfully',
      data: updatedStudent
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete student by ID
// @route   DELETE /api/students/:id
// @access  Public
const deleteStudent = async (req, res, next) => {
  try {
    // Check if student exists
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    // Delete student
    await Student.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all students in a specific class
// @route   GET /api/students/class/:standard/:division
// @access  Public
const getStudentsByClass = async (req, res, next) => {
  try {
    const { standard, division } = req.params;

    // Find the class
    const classData = await Class.findOne({ standard, division });
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: `Class ${standard}-${division} not found`
      });
    }

    // Get all students in this class
    const students = await Student.find({ classId: classData._id })
      .populate('classId')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: students.length,
      class: `${standard}-${division}`,
      data: students
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all students in a specific standard
// @route   GET /api/students/standard/:standard
// @access  Public
const getStudentsByStandard = async (req, res, next) => {
  try {
    const { standard } = req.params;

    // Find all classes with this standard
    const classes = await Class.find({ standard });
    if (classes.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No classes found for standard ${standard}`
      });
    }

    // Get all students in these classes
    const classIds = classes.map(cls => cls._id);
    const students = await Student.find({ classId: { $in: classIds } })
      .populate('classId')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: students.length,
      standard: standard,
      data: students
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createStudent,
  getAllStudents,
  getStudentById,
  updateStudentClass,
  deleteStudent,
  getStudentsByClass,
  getStudentsByStandard
};