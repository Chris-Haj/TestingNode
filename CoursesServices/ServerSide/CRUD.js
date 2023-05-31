const fs = require('fs');

const dataPath = './ServerSide/courses.json';

const readFile = (callback, returnJson = false, filePath = dataPath, encoding = 'utf8') => {
    fs.readFile(filePath, encoding, (err, data) => {
        if (err) {
            console.log(err);
        }
        if (!data) data = "{}";
        callback(returnJson ? JSON.parse(data) : data);
    });
};

const writeFile = (fileData, callback, filePath = dataPath, encoding = 'utf8') => {
    fs.writeFile(filePath, fileData, encoding, (err) => {
        if (err) {
            console.log(err);
        }
        callback();
    });
};


module.exports = {

    CreateCourse: function (req, res) {
        readFile((data) => {
            const newCourse = req.body;
            if (data[newCourse.course_ID.id]) {
                return res.status(400).send('Course ID already exists');
            }
            data[newCourse.course_ID.id] = newCourse.course_ID;
            writeFile(JSON.stringify(data, null, 2), () => {
                res.status(201).send(newCourse.course_ID);
            });
        }, true);
    },

    updateCourse: function (req, res) {
        readFile((data) => {
            let courseId = req.params.id;
            let updatedCourse = req.body;
            if (!data[courseId]) {
                return res.status(404).send('Course not found');
            }
            data[courseId] = {...data[courseId], ...updatedCourse};
            writeFile(JSON.stringify(data), () => {
                res.send(data[courseId]);
            });
        }, true);
    },

    AddStudentToCourse: function (req, res) {
        readFile((data) => {
            const courseId = req.params.id;
            const student = req.body;
            const course = data[courseId];

            if (!course) {
                return res.status(404).send('Course not found');
            }

            if (!course.students) {
                course.students = {};
            }

            if (course.students[student.id]) {
                return res.status(400).send('Student already exists in the course');
            }
            course.students[student.id] = student;

            writeFile(JSON.stringify(data), ()=>{
                res.status(201).send(student);
            });
        }, true)
    },

    getCourse: function (req, res){
        readFile((data) => {
            const courseId = req.params.id;
            const course = data[courseId];

            if (!course) {
                return res.status(404).send('Course not found');
            }
            res.send(course);
        }, true)
    },

    getCourses: function (req, res) {
        readFile((data) => {
            res.send(data);
        }, true);
    },

    deleteStudentFromCourse: function (req, res) {
        readFile((data) => {
            const courseId = req.params.courseId;
            const studentId = req.params.studentId;
            const course = data[courseId];
            if (!course || !course.students || !course.students[studentId]) {
                return res.status(404).send('Student or course not found');
            }
            delete course.students[studentId];
            writeFile(JSON.stringify(data), () => {
                res.status(200).send(`Student ${studentId} removed from course ${courseId}`);
            });
        }, true);
    },

    deleteCourse: function (req, res) {
        readFile((data) => {
            const courseId = req.params.id;
            if (!data[courseId]) {
                return res.status(404).send('Course not found');
            }
            delete data[courseId];
            writeFile(JSON.stringify(data), () => {
                res.status(200).send(`Course ${courseId} deleted`);
            });
        }, true);
    }

};
