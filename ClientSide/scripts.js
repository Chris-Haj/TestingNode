$(document).ready(() => {

    $('.addCourse').click(()=>{
        $('.CourseEditor').css('display','flex').animate({ left: '5' }, 200);
    })

    $('#course-form').submit((event) => {
        event.preventDefault(); // Prevent form submission

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
                prerequisite_course: prerequisiteCourses
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
                $('#course-form')[0].reset();
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
            const coursesList = $('#courses');

            data.forEach((course) => {
                const courseId = course.course_ID.id;
                const courseName = course.course_ID.name;
                const courseLecturer = course.course_ID.lecturer;
                const start = course.course_ID.start_date;
                const end = course.course_ID.end_date;

                const listItem = $('<li>').text(`Course ID: ${courseId}`);
                listItem.append((' - '));
                listItem.append($('<span>').text(`Course Name: ${courseName}`));
                listItem.append((' - '));
                listItem.append($('<span>').text(`Lecturer: ${courseLecturer}`));
                listItem.append($('<br>'));
                listItem.append($('<span>').text(`Start Date - End Date`));
                listItem.append(('<br>'));
                listItem.append($('<span>').text(`${start} - ${end}`));

                coursesList.append(listItem);
            });
        },
        error: (xhr, status, error) => {
            console.error(error + 'hello');
        }
    });
});
