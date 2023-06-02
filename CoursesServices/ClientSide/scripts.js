let ChosenCourse = null;
$(document).ready(() => {
    // Click handler to add a new course
    $('.addCourse').click(() => {
        window.location.href = '/addForum';
    });
    $('#goBack').click(() => {
        window.location.href = '/';
    });


    let form = $('#course-form');

    form.on('submit', (event) => {
        event.preventDefault();

        // Get form input values
        const courseId = $('#id').val();
        const courseName = $('#name').val();
        const courseLecturer = $('#lecturer').val();
        const startDate = $('#start-date').val();
        const endDate = $('#end-date').val();
        const prerequisiteCourses = $('#prerequisite-courses').val().split(',');

        // Create course object
        const course = {
            course_ID: {
                id: courseId,
                name: courseName,
                lecturer: courseLecturer,
                start_date: startDate,
                end_date: endDate,
                prerequisite_course: prerequisiteCourses,
                students: []
            }
        };
        console.log(course);

        // Send course data to the server
        $.ajax({
            url: '/courses',
            type: 'POST',
            data: JSON.stringify(course),
            contentType: 'application/json',
            success: (response) => {
                console.log('Course added successfully:', response);
                // Reset the form after successful submission
                form[0].reset();
                window.location.href = "/";
            },
            error: (xhr, status, error) => {
                console.error('Error adding course:', error);
            }
        });
    });

    $.ajax({
        url: '/courses',
        type: 'GET',
        dataType: 'json',
        success: (data) => {
            let counter = 1;
            const coursesList = $('#courses');
            //get the data from the server and append it to the list

            Object.values(data).forEach((course) => {
                const courseId = course['id'];
                const courseName = course['name'];
                const courseLecturer = course['lecturer'];
                const start = course['start_date'].split("-").reverse().join("-");
                const end = course['end_date'].split("-").reverse().join("-");

                // Create the course container element

                const courseItem = $('<li>').prop('id', `course${counter++}`);
                // Create the course buttons container element
                const courseButtons = $('<div>').addClass('CourseButtons ChangingButtons');
                courseButtons.append($('<button>').text('Update Course'));
                courseButtons.append($('<button>').text('Delete Course').addClass('deleteCourse'));

                // Create the course details container element
                const courseDetails = $('<div>').addClass('CourseDetails');
                courseDetails.append($('<span>').text(`Course ID: ${courseId}`));
                courseDetails.append($('<span>').text(`Course Name: ${courseName}`));
                courseDetails.append($('<span>').text(`Lecturer: ${courseLecturer}`));
                courseDetails.append($('<span>').text('Start Date - End Date'));
                courseDetails.append($('<span>').text(`${start} - ${end}`));

                // Create the student buttons container element
                const studentButtons = $('<div>').addClass('StudentButtons ChangingButtons');
                studentButtons.append($('<button>').text('Add Student').addClass('addStudent'));
                let studentViewButton = $('<button>').text('View Students').addClass('viewStudents')
                studentButtons.append(studentViewButton);
                studentViewButton.click((event) => {
                    ChosenCourse = $(event.currentTarget).closest('li').attr('id');

                    // Load the students of the chosen course
                    $.ajax({
                        url: `/courses/${ChosenCourse}`,
                        type: 'GET',
                        dataType: 'json',
                        success: (course) => {
                            // Store the students in the local storage to be accessed in the Students.html page
                            localStorage.setItem('students', JSON.stringify(course.students));
                            // Redirect to the students list page
                            window.location.href = '/studentsList';
                        },
                        error: (xhr, status, error) => {
                            console.error('Error loading course:', error);
                        }
                    });
                });
                // Append the elements to the course container
                courseItem.append(courseButtons);
                courseItem.append(courseDetails);
                courseItem.append(studentButtons);

                // Append the course container to the courses list
                coursesList.append(courseItem);
            });

            // Click handler for deleting a course
            $('.deleteCourse').click(function (event) {
                let courseItem = $(event.target).closest('li');
                let courseId = courseItem.find(".CourseDetails span:first-child").text().split(": ")[1]; // Extract courseId from the CourseDetails span

                // AJAX call to delete the course from the server
                $.ajax({
                    url: `/courses/${courseId}`,
                    type: 'DELETE',
                    success: (response) => {
                        console.log('Course deleted successfully:', response);
                        // Remove the course from the DOM
                        courseItem.remove();
                    },
                    error: (xhr, status, error) => {
                        console.error('Error deleting course:', error);
                    }
                });
            });

            // Click handler for adding a student
            $('.addStudent').click(function (event) {
                const courseItem = $(event.target).closest('li');
                const courseId = courseItem.find(".CourseDetails span:first-child").text().split(": ")[1]; // Extract courseId from the CourseDetails span

                // Store the courseId on the form for reference when submitting
                $('#student-form').data('courseId', courseId);

                // Show the modal
                $('#addStudentModal').show();
            });

            $('#student-form').submit(function (event) {
                event.preventDefault(); // Prevent the form from submitting normally
                const studentId = $('#student-id').val(); // Get the value from the student ID input field
                const firstName = $('#student-firstname').val(); // Get the value from the first name input field
                const lastName = $('#student-surname').val(); // Get the value from the last name input field
                const pictureUrl = $('#student-picture').val(); // Get the value from the picture URL input field
                const grade = $('#student-grade').val(); // Get the value from the grade input field
                const courseId = $('#student-form').data('courseId'); // Get the course ID from the form data

                // Clear the input fields for next time
                $('#student-id').val('');
                $('#student-firstname').val('');
                $('#student-surname').val('');
                $('#student-picture').val('');
                $('#student-grade').val('');

                // Get the current data of the course
                $.ajax({
                    type: 'GET',
                    url: `/courses/${courseId}`,
                    success: function (data) {

                        // Check if the student ID already exists in the students array
                        const existingStudent = data.students.find(student => Object.keys(student)[0] === studentId);
                        if (existingStudent) {
                            // Handle the case where the student ID already exists
                            const errorElement = $('#student-error');
                            errorElement.text('Student ID already exists in the course. Please choose a different ID.');
                            errorElement.show();
                            return; // Prevent form submission
                        }


                        // Initialize the students array if it doesn't exist
                        if (!data.students) {
                            data.students = [];
                        }


                            // Create the new student object
                            const student = {
                                [studentId]: {
                                    "id": studentId,
                                    "firstname": firstName,
                                    "surname": lastName,
                                    "picture": pictureUrl,
                                    "grade": grade
                                }
                            };

                        // Create an object with the studentId as the key and the student object as the value
                        let studentObj = {};
                        studentObj[studentId] = student;

                        // Add the new student object to the students array of the course
                        data.students.push(studentObj);

                        // Make a PUT request to update the course with the new student
                        $.ajax({
                            type: 'PUT',
                            url: `/courses/${courseId}`,
                            contentType: 'application/json',
                            data: JSON.stringify(data),
                            success: function (data) {
                                // After a successful request, hide the modal
                                $('#addStudentModal').hide();
                                $('#student-error').hide();
                            },
                            error: function (err) {
                                console.log('Error', err);
                            }
                        });
                    },
                    error: function (err) {
                        console.log('Error', err);
                    }
                });
                return false;
            });
            $('#cancelStudentModal').click(function() {
                $('#addStudentModal').hide();  // This will hide the modal
                $('#student-error').hide();
            });


        }
    });

});

