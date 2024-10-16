document.addEventListener('DOMContentLoaded', function() {
    const cellLinesSection = document.getElementById('cell-lines-section');
    const castHouseSection = document.getElementById('cast-house-section');
    const cellLinesBtn = document.getElementById('cell-lines-btn');
    const castHouseBtn = document.getElementById('cast-house-btn');
    const submitBtn = document.getElementById('submit-btn');
    const shiftButtons = document.querySelectorAll('.shift-btn');
    let selectedShift = "";

    // Navigation between Cell Lines and CastHouse pages
    cellLinesBtn.addEventListener('click', function() {
        cellLinesSection.style.display = 'block';
        castHouseSection.style.display = 'none';
    });

    castHouseBtn.addEventListener('click', function() {
        castHouseSection.style.display = 'block';
        cellLinesSection.style.display = 'none';
    });

    // Shift button interaction
    shiftButtons.forEach(button => {
        button.addEventListener('click', function() {
            shiftButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            selectedShift = this.textContent;
        });
    });

    // Submit button functionality
    submitBtn.addEventListener('click', function() {
        const badgeNo = document.getElementById('badge-no').value;
        const castNumber = document.getElementById('cast-number').value;
        const line = document.getElementById('line').value;
        const room = document.getElementById('room').value;
        const cruceNumber = document.getElementById('cruce-number').value;
        const potsTapped = `${document.getElementById('pot-1').value}, ${document.getElementById('pot-2').value}, ${document.getElementById('pot-3').value}, ${document.getElementById('pot-4').value}`;
        const alloyGrades = `${document.getElementById('alloy-al').value}, ${document.getElementById('alloy-si').value}, ${document.getElementById('alloy-fe').value}, ${document.getElementById('alloy-cu').value}`;
        const callWeight = document.getElementById('call-weight').value;
        const grossWeight = document.getElementById('gross-weight').value;
        const tareWeight = document.getElementById('tare-weight').value;

        // Insert data into the CastHouse table
        const tableBody = document.querySelector('#data-table tbody');
        const newRow = document.createElement('tr');

        newRow.innerHTML = `
            <td>${badgeNo}</td>
            <td>${castNumber}</td>
            <td>${line}</td>
            <td>${room}</td>
            <td>${cruceNumber}</td>
            <td>${selectedShift}</td>
            <td>${potsTapped}</td>
            <td>${alloyGrades}</td>
            <td>${callWeight}</td>
            <td>${grossWeight}</td>
            <td>${tareWeight}</td>
        `;

        tableBody.appendChild(newRow);

        // Switch to CastHouse page to view the data
        castHouseBtn.click();
    });
});
