$(document).ready(() => {
    // Get the students from the local storage
    const students = JSON.parse(localStorage.getItem('students'));

    // Get the students list container
    const studentsList = $('#students');

    // Append each student to the students list
    students.forEach((student, index) => {
        const studentItem = $('<li>').text(`Student ${index+1}: ${student.name}`);
        studentsList.append(studentItem);
    });
});
