// Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC_IIpwfpdoSKiNTtIeglpONUhcWD88YpA",
    authDomain: "goiper.firebaseapp.com",
    databaseURL: "https://goiper-default-rtdb.firebaseio.com",
    projectId: "goiper",
    storageBucket: "goiper.appspot.com",
    messagingSenderId: "1037467961454",
    appId: "1:1037467961454:web:cf9b174e7ffd0db5f83e7f",
    measurementId: "G-MD5S9TBHLC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

let selectedShift = ''; // Variable to hold the selected shift

// Function to save data to Firebase
// Function to save data to Firebase
function saveData() {
    const badgeNo = document.getElementById('badge-no').value;
    const castNumber = document.getElementById('cast-number').value;
    const line = document.getElementById('line').value;
    const room = document.getElementById('room').value;
    const cruceNumber = document.getElementById('cruce-number').value;
    const potsTapped = [
        document.getElementById('pot-1').value,
        document.getElementById('pot-2').value,
        document.getElementById('pot-3').value,
        document.getElementById('pot-4').value
    ];
    const alloyGrades = {
        Al: document.getElementById('alloy-al').value,
        Si: document.getElementById('alloy-si').value,
        Fe: document.getElementById('alloy-fe').value,
        Cu: document.getElementById('alloy-cu').value,
    };
    const callWeight = document.getElementById('call-weight').value;
    const grossWeight = document.getElementById('gross-weight').value;
    const tareWeight = document.getElementById('tare-weight').value;

   if (badgeNo) {
        // Use timestamp as a unique key
        const timestamp = Date.now();
        const newEntryRef = ref(database, `formData/${timestamp}`);
        set(newEntryRef,  {
            badgeNo: badgeNo, // Store the badge number for reference
            castNumber: castNumber,
            line: line,
            room: room,
            cruceNumber: cruceNumber,
            potsTapped: potsTapped,
            alloyGrades: alloyGrades,
            callWeight: callWeight,
            grossWeight: grossWeight,
            tareWeight: tareWeight,
            shift: selectedShift // Include the selected shift in the data saved
        })
        .then(() => {
            console.log("Data saved successfully.");
            clearForm();
            loadData(); // Reload data after saving
        })
        .catch((error) => {
            console.error("Error saving data: ", error);
        });
    } else {
        alert("Please fill in all fields.");
    }
}


// Function to load data from Firebase based on selected line
// Function to load data from Firebase based on selected line
function loadData(selectedLine) {
    const dbRef = ref(database, 'formData/');
    get(dbRef).then((snapshot) => {
        const line1TableBody = document.getElementById('line-1-table').querySelector('tbody');
        const line2TableBody = document.getElementById('line-2-table').querySelector('tbody');
        line1TableBody.innerHTML = '';
        line2TableBody.innerHTML = '';

        if (snapshot.exists()) {
            snapshot.forEach((childSnapshot) => {
                const data = childSnapshot.val();
                const row = `<tr>
                    <td>${childSnapshot.key}</td>
                    <td>${data.badgeNo}</td> <!-- Display badge number -->
                    <td>${data.castNumber}</td>
                    <td>${data.line}</td>
                    <td>${data.room}</td>
                    <td>${data.cruceNumber}</td>
                    <td>${data.shift || ''}</td>
                    <td>${data.potsTapped.join(', ')}</td>
                    <td>${JSON.stringify(data.alloyGrades)}</td>
                    <td>${data.callWeight}</td>
                    <td>${data.grossWeight}</td>
                    <td>${data.tareWeight}</td>
                </tr>`;

                // Load data based on the selected line
                if (selectedLine === "1" && data.line === "1") {
                    line1TableBody.innerHTML += row;
                } else if (selectedLine === "2" && data.line === "2") {
                    line2TableBody.innerHTML += row;
                }
            });
        } else {
            console.log("No data available.");
        }
    }).catch((error) => {
        console.error("Error loading data: ", error);
    });
}


// Print functionality
document.getElementById('print-btn').addEventListener('click', function() {
    window.print(); // Opens print dialog
});

// Save as Excel functionality
document.getElementById('save-excel-btn').addEventListener('click', function() {
    const table1 = document.getElementById('line-1-table');
    const table2 = document.getElementById('line-2-table');
    
    if (table1.style.display !== 'none') {
        exportTableToExcel('line-1-table', 'line1_data');
    } else if (table2.style.display !== 'none') {
        exportTableToExcel('line-2-table', 'line2_data');
    }
});

// Function to export the table to an Excel file
function exportTableToExcel(tableID, filename = '') {
    const table = document.getElementById(tableID);
    let downloadLink;
    const dataType = 'application/vnd.ms-excel';
    const tableHTML = table.outerHTML.replace(/ /g, '%20');
    
    // Create download link
    downloadLink = document.createElement('a');
    document.body.appendChild(downloadLink);
    
    // File name
    filename = filename ? filename + '.xls' : 'excel_data.xls';
    
    // Set the download link
    downloadLink.href = 'data:' + dataType + ', ' + tableHTML;
    
    // Set the file name
    downloadLink.download = filename;
    
    // Trigger the download
    downloadLink.click();
    document.body.removeChild(downloadLink);
}

// Function to clear the form after submission
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
}

// Event listeners for navigation buttons
document.getElementById('submit-btn').addEventListener('click', saveData);
document.getElementById('cell-lines-btn').addEventListener('click', () => {
    document.getElementById('cell-lines-section').style.display = 'block';
    document.getElementById('cast-house-section').style.display = 'none';
    setActiveButton('cell-lines-btn'); // Set the active button
});
document.getElementById('cast-house-btn').addEventListener('click', () => {
    document.getElementById('cell-lines-section').style.display = 'none';
    document.getElementById('cast-house-section').style.display = 'block';
    loadData("1"); // Load data for Line 1 initially
    setActiveButton('cast-house-btn'); // Set the active button
});
document.getElementById('line-1-btn').addEventListener('click', () => {
    document.getElementById('line-1-table').style.display = 'block';
    document.getElementById('line-2-table').style.display = 'none';
    loadData("1"); // Load data for Line 1
    setActiveButton('line-1-btn'); // Set the active button
});
document.getElementById('line-2-btn').addEventListener('click', () => {
    document.getElementById('line-1-table').style.display = 'none';
    document.getElementById('line-2-table').style.display = 'block';
    loadData("2"); // Load data for Line 2
    setActiveButton('line-2-btn'); // Set the active button
});

// Function to set the active button
function setActiveButton(activeButtonId) {
    const buttons = document.querySelectorAll('.navigation button');
    buttons.forEach(button => {
        if (button.id === activeButtonId) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Initial load
loadData("1"); // Load data for Line 1 by default
document.addEventListener('DOMContentLoaded', function() {
    const shiftButtons = document.querySelectorAll('.shift-btn');

    // Shift button interaction
    shiftButtons.forEach(button => {
        button.addEventListener('click', function() {
            shiftButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            selectedShift = this.textContent; // Update the selected shift
            console.log(`Selected shift: ${selectedShift}`); // Optional: Log the selected shift
        });
    });
});
