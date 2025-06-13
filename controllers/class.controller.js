const Class = require('../models/class.model');
const Student = require('../models/student.model');
const Joi = require('joi');

// Validation schema
const classValidationSchema = Joi.object({
  standard: Joi.string().required().trim().messages({
    'string.empty': 'Standard is required',
    'any.required': 'Standard is required'
  }),
  division: Joi.string().required().trim().messages({
    'string.empty': 'Division is required',
    'any.required': 'Division is required'
  })
});

// @desc    Create a new class
// @route   POST /api/classes
// @access  Public
const createClass = async (req, res, next) => {
  try {
    // Validate request body
    const { error, value } = classValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }

    const { standard, division } = value;

    // Check if class already exists
    const existingClass = await Class.findOne({ standard, division });
    if (existingClass) {
      return res.status(409).json({
        success: false,
        message: `Class ${standard}-${division} already exists`
      });
    }

    // Create new class
    const newClass = new Class({ standard, division });
    const savedClass = await newClass.save();

    res.status(201).json({
      success: true,
      message: 'Class created successfully',
      data: savedClass
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all classes
// @route   GET /api/classes
// @access  Public
const getAllClasses = async (req, res, next) => {
  try {
    const classes = await Class.find().sort({ standard: 1, division: 1 });
    
    res.status(200).json({
      success: true,
      count: classes.length,
      data: classes
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get class by ID
// @route   GET /api/classes/:id
// @access  Public
const getClassById = async (req, res, next) => {
  try {
    const classData = await Class.findById(req.params.id);
    
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    res.status(200).json({
      success: true,
      data: classData
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update class by ID
// @route   PUT /api/classes/:id
// @access  Public
const updateClass = async (req, res, next) => {
  try {
    // Validate request body
    const { error, value } = classValidationSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.details.map(detail => detail.message)
      });
    }

    const { standard, division } = value;

    // Check if class exists
    const existingClass = await Class.findById(req.params.id);
    if (!existingClass) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    // Check if updated class combination already exists
    const duplicateClass = await Class.findOne({ 
      standard, 
      division,
      _id: { $ne: req.params.id }
    });
    
    if (duplicateClass) {
      return res.status(409).json({
        success: false,
        message: `Class ${standard}-${division} already exists`
      });
    }

    // Update class
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      { standard, division },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Class updated successfully',
      data: updatedClass
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete class by ID
// @route   DELETE /api/classes/:id
// @access  Public
const deleteClass = async (req, res, next) => {
  try {
    // Check if class exists
    const classData = await Class.findById(req.params.id);
    if (!classData) {
      return res.status(404).json({
        success: false,
        message: 'Class not found'
      });
    }

    // Check if any students are assigned to this class
    const studentsInClass = await Student.countDocuments({ classId: req.params.id });
    if (studentsInClass > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete class. ${studentsInClass} student(s) are assigned to this class`
      });
    }

    // Delete class
    await Class.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Class deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass
};