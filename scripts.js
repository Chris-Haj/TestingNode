$(document).ready(() => {

    $('.addCourse').click(()=>{
        $('.CourseEditor').css('display','flex').animate({ left: '5' }, 200);
    })

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
            console.error(error);
        }
    });
});
