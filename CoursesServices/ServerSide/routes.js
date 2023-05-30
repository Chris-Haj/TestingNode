const express = require('express'),
    userRoutes = require('./CRUD.js');

let router = express.Router();

router.get('/courses', userRoutes.getCourses);
router.post('/courses', userRoutes.CreateCourse);
router.put('/courses/:id', userRoutes.updateCourse);
router.delete('/courses/:id', userRoutes.deleteCourse);

module.exports = router;
