const form = document.getElementById('studentForm');
const table = document.getElementById('studentTable');

let editId = null;

// ==========================
// LOAD STUDENTS
// ==========================
async function loadStudents() {
    try {
        const res = await fetch('/students');
        const students = await res.json();

        let rows = '';

        students.forEach(student => {
            rows += `
            <tr>
                <td>${student.id}</td>
                <td>${student.student_id}</td>
                <td>${student.full_name}</td>
                <td>${student.course}</td>
                <td>${student.year_level}</td>
                <td>${student.email}</td>
                <td>
                    <button onclick="editStudent(
                        ${student.id},
                        \`${student.student_id}\`,
                        \`${student.full_name}\`,
                        \`${student.course}\`,
                        \`${student.year_level}\`,
                        \`${student.email}\`
                    )">
                        Edit
                    </button>

                    <button onclick="deleteStudent(${student.id})">
                        Delete
                    </button>
                </td>
            </tr>
            `;
        });

        table.innerHTML = rows;

    } catch (error) {
        console.error('Error loading students:', error);
    }
}

// ==========================
// ADD / UPDATE STUDENT
// ==========================
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const student = {
        student_id: student_id.value,
        full_name: full_name.value,
        course: course.value,
        year_level: year_level.value,
        email: email.value
    };

    try {
        if (editId) {
            // UPDATE
            await fetch(`/students/${editId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(student)
            });

            editId = null;

        } else {
            // CREATE
            await fetch('/students', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(student)
            });
        }

        form.reset();
        loadStudents(); // 🔥 refresh table

    } catch (error) {
        console.error('Error saving student:', error);
    }
});

// ==========================
// EDIT STUDENT
// ==========================
function editStudent(id, sid, name, courseData, year, emailData) {
    editId = id;

    student_id.value = sid;
    full_name.value = name;
    course.value = courseData;
    year_level.value = year;
    email.value = emailData;
}

// ==========================
// DELETE STUDENT
// ==========================
async function deleteStudent(id) {
    try {
        await fetch(`/students/${id}`, {
            method: 'DELETE'
        });

        loadStudents(); // refresh table
    } catch (error) {
        console.error('Error deleting student:', error);
    }
}

// ==========================
// INITIAL LOAD
// ==========================
loadStudents();