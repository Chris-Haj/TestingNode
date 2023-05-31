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
                courseButtons.append($('<button>').text('Delete Course'));

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
        },
        error: (xhr, status, error) => {
            console.error(error + 'hello');
        }
    });
});

