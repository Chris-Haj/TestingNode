$(document).ready(() => {
    // Click handler to add a new course
    $('.addCourse').click(() => {
        window.location.href = '/addForum';
    });
    $('#goBack').click(() => {
        window.location.href = '/';
    });


    let form  = $('#course-form');
    // form.validate({
    //     rules: {
    //         id_field: {
    //             required: true,
    //             pattern: /^[a-zA-Z0-9]+$/
    //         }
    //     },
    //     // Specify validation error messages
    //     messages: {
    //         id_field: {
    //             required: "ID is required",
    //             pattern: "ID can only contain letters and numbers"
    //         }
    //     }
    // })

    // Handle form submission

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
                studentButtons.append($('<button>').text('View Students').addClass('viewStudents'));
                $('.viewStudents').click((event) => {
                    console.log('hello');

                    console.log(courseId);
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

