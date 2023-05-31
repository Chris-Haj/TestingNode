const express = require('express');
const userRoutes = require('./CRUD.js');

let router = express.Router();

router.get('/courses', userRoutes.getCourses);
router.post('/courses', userRoutes.CreateCourse);
router.put('/courses/:id', userRoutes.updateCourse);
router.delete('/courses/:id', userRoutes.deleteCourse);

// Add routes for handling students
router.post('/courses/:id/students', userRoutes.AddStudentToCourse);
router.get('/courses/:id', userRoutes.getCourse);
router.delete('/courses/:courseId/students/:studentId', userRoutes.deleteStudentFromCourse);

module.exports = router;
