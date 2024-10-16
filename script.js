// Firebase Initialization
const database = getDatabase(app);

// Global Variables
let selectedShift = "";
let dataArray = [];

// Fetch data from Firebase when the page loads
document.addEventListener('DOMContentLoaded', () => {
    loadTableData(); // Load saved data into tables
    onValue(ref(database, 'formData/'), (snapshot) => {
        if (snapshot.exists()) {
            dataArray = snapshot.val(); // Load data from Firebase
            loadTableData(); // Load data into tables
        }
    });
});

// Event listeners for navigation
document.getElementById('cell-lines-btn').addEventListener('click', () => {
    document.getElementById('cell-lines-section').style.display = 'block';
    document.getElementById('cast-house-section').style.display = 'none';
});

document.getElementById('cast-house-btn').addEventListener('click', () => {
    document.getElementById('cell-lines-section').style.display = 'none';
    document.getElementById('cast-house-section').style.display = 'block';
});

// Event listeners for shift selection
document.querySelectorAll('.shift-btn').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.shift-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        selectedShift = button.textContent;
    });
});

// Submit form data
document.getElementById('submit-btn').addEventListener('click', async () => {
    const badgeNo = document.getElementById('badge-no').value.trim();
    const castNumber = document.getElementById('cast-number').value.trim();
    const line = document.getElementById('line').value.trim().toLowerCase();
    const room = document.getElementById('room').value.trim();
    const cruceNumber = document.getElementById('cruce-number').value.trim();
    const potsTapped = [
        document.getElementById('pot-1').value.trim(),
        document.getElementById('pot-2').value.trim(),
        document.getElementById('pot-3').value.trim(),
        document.getElementById('pot-4').value.trim()
    ];
    const alloyGrades = {
        al: document.getElementById('alloy-al').value.trim(),
        si: document.getElementById('alloy-si').value.trim(),
        fe: document.getElementById('alloy-fe').value.trim(),
        cu: document.getElementById('alloy-cu').value.trim()
    };
    const callWeight = document.getElementById('call-weight').value.trim();
    const grossWeight = document.getElementById('gross-weight').value.trim();
    const tareWeight = document.getElementById('tare-weight').value.trim();

    if (badgeNo === "" || cruceNumber === "" || potsTapped.some(pot => pot === "") || callWeight === "") {
        alert("Please fill all required fields!");
        return;
    }

    const formData = {
        badgeNo,
        castNumber,
        line,
        room,
        cruceNumber,
        shift: selectedShift,
        potsTapped,
        alloyGrades,
        callWeight,
        grossWeight,
        tareWeight
    };

    // Save data to Firebase
    const newDataRef = ref(database, 'formData/' + Date.now()); // Unique ID
    await set(newDataRef, formData);

    // Clear form inputs
    clearForm();
});

// Function to clear form inputs
function clearForm() {
    document.getElementById('badge-no').value = '';
    document.getElementById('cast-number').value = '';
    document.getElementById('line').value = '';
    document.getElementById('room').value = '';
    document.getElementById('cruce-number').value = '';
    document.getElementById('pot-1').value = '';
    document.getElementById('pot-2').value = '';
    document.getElementById('pot-3').value = '';
    document.getElementById('pot-4').value = '';
    document.getElementById('alloy-al').value = '';
    document.getElementById('alloy-si').value = '';
    document.getElementById('alloy-fe').value = '';
    document.getElementById('alloy-cu').value = '';
    document.getElementById('call-weight').value = '';
    document.getElementById('gross-weight').value = '';
    document.getElementById('tare-weight').value = '';
    selectedShift = "";
    document.querySelectorAll('.shift-btn').forEach(btn => btn.classList.remove('active'));
}

// Load table data into the HTML tables
function loadTableData() {
    const line1TableBody = document.getElementById('line-1-table').querySelector('tbody');
    const line2TableBody = document.getElementById('line-2-table').querySelector('tbody');

    // Clear previous data
    line1TableBody.innerHTML = '';
    line2TableBody.innerHTML = '';

    dataArray.forEach(data => {
        const newRow = `
            <tr>
                <td>${data.badgeNo}</td>
                <td>${data.castNumber}</td>
                <td>${data.line}</td>
                <td>${data.room}</td>
                <td>${data.cruceNumber}</td>
                <td>${data.shift}</td>
                <td>${data.potsTapped.join(', ')}</td>
                <td>${data.alloyGrades.al}, ${data.alloyGrades.si}, ${data.alloyGrades.fe}, ${data.alloyGrades.cu}</td>
                <td>${data.callWeight}</td>
                <td>${data.grossWeight}</td>
                <td>${data.tareWeight}</td>
            </tr>
        `;

        // Add to the corresponding table based on line
        if (data.line === 'line1') {
            line1TableBody.insertAdjacentHTML('beforeend', newRow);
            document.getElementById('line-1-table').style.display = 'table'; // Show table
        } else if (data.line === 'line2') {
            line2TableBody.insertAdjacentHTML('beforeend', newRow);
            document.getElementById('line-2-table').style.display = 'table'; // Show table
        }
    });
}

// Save data to Excel functionality (optional)
document.getElementById('save-btn').addEventListener('click', () => {
    // Implement CSV download for Line 1 and Line 2 tables
});
