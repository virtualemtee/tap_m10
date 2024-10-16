// GitHub API Variables
const repo = 'virtualemtee/tap_m10'; // repo name
const filePath = 'data.json'; // The JSON file in your GitHub repository
const token = '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'; 

// Global Variables
let selectedShift = "";
let dataArray = [];

// Fetch data from GitHub when the page loads
document.addEventListener('DOMContentLoaded', async () => {
    dataArray = await getDataFromGitHub();
    loadTableData(); // Load the data into tables
});

// Event listeners for navigation
document.getElementById('cell-lines-btn').addEventListener('click', () => {
    document.getElementById('cell-lines-section').style.display = 'block';
    document.getElementById('cast-house-section').style.display = 'none';
});

document.getElementById('cast-house-btn').addEventListener('click', () => {
    document.getElementById('cell-lines-section').style.display = 'none';
    document.getElementById('cast-house-section').style.display = 'block';
    loadTableData(); // Load saved data into the table
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
    const pot1 = document.getElementById('pot-1').value.trim();
    const pot2 = document.getElementById('pot-2').value.trim();
    const callWeight = document.getElementById('call-weight').value.trim();
    const grossWeight = document.getElementById('gross-weight').value.trim();
    const tareWeight = document.getElementById('tare-weight').value.trim();
    
    const alloyAl = document.getElementById('alloy-al').value.trim();
    const alloySi = document.getElementById('alloy-si').value.trim();
    const alloyFe = document.getElementById('alloy-fe').value.trim();
    const alloyCu = document.getElementById('alloy-cu').value.trim();
    
    // Validation
    if (!badgeNo || !callWeight || !cruceNumber || (!pot1 && !pot2)) {
        alert("Please fill out all required fields.");
        return;
    }

    // Data object
    const formData = {
        badgeNo, castNumber, line, room, cruceNumber, selectedShift,
        potsTapped: `${pot1}, ${pot2}`,
        alloys: `${alloyAl}, ${alloySi}, ${alloyFe}, ${alloyCu}`,
        callWeight, grossWeight, tareWeight
    };

    // Add data to array
    dataArray.push(formData);

    // Save updated data to GitHub
    await saveDataToGitHub(dataArray);
    
    alert("Data Submitted!");

    // Clear form after submission
    document.getElementById('badge-no').value = '';
    document.getElementById('cast-number').value = '';
    document.getElementById('line').value = '';
    document.getElementById('room').value = '';
    document.getElementById('cruce-number').value = '';
    document.getElementById('pot-1').value = '';
    document.getElementById('pot-2').value = '';
    document.getElementById('call-weight').value = '';
    document.getElementById('gross-weight').value = '';
    document.getElementById('tare-weight').value = '';
    document.getElementById('alloy-al').value = '';
    document.getElementById('alloy-si').value = '';
    document.getElementById('alloy-fe').value = '';
    document.getElementById('alloy-cu').value = '';
    selectedShift = '';
    document.querySelectorAll('.shift-btn').forEach(btn => btn.classList.remove('active'));

    loadTableData(); // Reload table with updated data
});

// Load saved data into the CastHouse tables
function loadTableData() {
    const line1TableBody = document.querySelector('#line-1-table tbody');
    const line2TableBody = document.querySelector('#line-2-table tbody');
    
    // Clear the current table
    line1TableBody.innerHTML = '';
    line2TableBody.innerHTML = '';

    // Append rows based on the line
    dataArray.forEach(data => {
        const row = `<tr>
            <td>${data.badgeNo}</td>
            <td>${data.castNumber}</td>
            <td>${data.line}</td>
            <td>${data.room}</td>
            <td>${data.cruceNumber}</td>
            <td>${data.selectedShift}</td>
            <td>${data.potsTapped}</td>
            <td>${data.alloys}</td>
            <td>${data.callWeight}</td>
            <td>${data.grossWeight}</td>
            <td>${data.tareWeight}</td>
        </tr>`;
        
        if (data.line === '1' || data.line === 'one') {
            line1TableBody.innerHTML += row;
        } else if (data.line === '2' || data.line === 'two') {
            line2TableBody.innerHTML += row;
        }
    });

    // Show the appropriate table
    document.getElementById('line-1-btn').addEventListener('click', () => {
        document.getElementById('line-1-table').style.display = 'table';
        document.getElementById('line-2-table').style.display = 'none';
    });
    
    document.getElementById('line-2-btn').addEventListener('click', () => {
        document.getElementById('line-2-table').style.display = 'table';
        document.getElementById('line-1-table').style.display = 'none';
    });
}

// Save data as Excel
document.getElementById('save-btn').addEventListener('click', () => {
    const headers = ["Badge No.", "Cast Number", "Line", "Room", "Cruce Number", "Shift", "Pots Tapped", "Alloy Grades (Al, Si, Fe, Cu)", "Call Weight", "Gross Weight", "Tare Weight"];
    const csvContent = dataArray.map(data => [
        data.badgeNo, data.castNumber, data.line, data.room, data.cruceNumber, data.selectedShift, data.potsTapped, data.alloys, data.callWeight, data.grossWeight, data.tareWeight
    ]);

    // Convert to CSV format
    const csv = [headers, ...csvContent].map(row => row.join(",")).join("\n");
    
    // Create a downloadable file
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'castHouseData.csv';
    a.click();
    URL.revokeObjectURL(url);
});

// --- GitHub API Functions ---

// Fetch data from GitHub
async function getDataFromGitHub() {
    const response = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
        method: 'GET',
        headers: {
            'Authorization': `token ${token}`
        }
    });

    if (response.ok) {
        const file = await response.json();
        const content = atob(file.content); // Decode Base64 content
        return JSON.parse(content); // Return parsed JSON
    } else {
        console.error('Failed to retrieve data:', await response.json());
        return []; // Return an empty array if no data is found
    }
}

// Save data to GitHub
async function saveDataToGitHub(dataArray) {
    const content = btoa(JSON.stringify(dataArray, null, 2)); // Convert data to Base64-encoded string
    const sha = await getFileSha(); // Get file SHA if it exists

    const response = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: 'Updating form data',
            content: content,
            sha: sha // Pass the file SHA to overwrite the file
        })
    });

    if (!response.ok) {
        console.error('Failed to save data:', await response.json());
    }
}

// Get the file SHA (required for updating a file on GitHub)
async function getFileSha() {
    const response = await fetch(`https://api.github.com/repos/${repo}/contents/${filePath}`, {
        method: 'GET',
        headers: {
            'Authorization': `token ${token}`
        }
    });

    if (response.ok) {
        const file = await response.json();
        return file.sha; // Return file SHA
    } else {
        return null; // Return null if no file exists
    }
}
