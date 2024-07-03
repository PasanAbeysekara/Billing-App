let jobs = [];

document.addEventListener('DOMContentLoaded', () => {
  fetch('http://localhost:3000/api/departments')
    .then(response => response.json())
    .then(departments => {
      const departmentContainer = document.getElementById('departments');
      departments.forEach(department => {
        const label = document.createElement('label');
        label.innerText = department.name;
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'department';
        checkbox.id = department.name.toLowerCase().replace(/\s+/g, '');
        departmentContainer.appendChild(label);
        departmentContainer.appendChild(checkbox);
        departmentContainer.appendChild(document.createElement('br'));
      });

      document.querySelectorAll('.department').forEach(departmentCheckbox => {
        departmentCheckbox.addEventListener('change', updateAmountFields);
      });
    })
    .catch(error => console.error('Error fetching departments:', error));
});

document.querySelectorAll('.dsr').forEach(dsrCheckbox => {
  dsrCheckbox.addEventListener('change', updateAmountFields);
});

function updateAmountFields() {
  const selectedDSRs = [];
  for (let i = 1; i <= 30; i++) {
    if (document.getElementById(`dsr${i}`) && document.getElementById(`dsr${i}`).checked) {
      selectedDSRs.push(i);
    }
  }

  const amountField = document.getElementById('amount');
  amountField.disabled = selectedDSRs.length === 0;
  document.getElementById('enterButton').disabled = selectedDSRs.length === 0;

  if (selectedDSRs.length > 0) {
    amountField.placeholder = `Amount for DSRs: ${selectedDSRs.join(', ')}`;
  } else {
    amountField.placeholder = 'Amount';
  }
}

function addJob() {
  const selectedDepartments = [];
  document.querySelectorAll('.department').forEach(departmentCheckbox => {
    if (departmentCheckbox.checked) {
      selectedDepartments.push(departmentCheckbox.id.charAt(0).toUpperCase() + departmentCheckbox.id.slice(1));
    }
  });

  const selectedDSRs = [];
  for (let i = 1; i <= 30; i++) {
    if (document.getElementById(`dsr${i}`) && document.getElementById(`dsr${i}`).checked) {
      const amount = document.getElementById('amount').value;
      selectedDSRs.push({ dsrId: i, amount: parseInt(amount) });
    }
  }

  selectedDepartments.forEach(department => {
    selectedDSRs.forEach(dsr => {
      jobs.push({ department, dsrId: dsr.dsrId, amount: dsr.amount });
    });
  });

  updateBillSummary();
  clearAmountFields();
}

function clearAmountFields() {
  document.getElementById('amount').value = '';
  document.getElementById('amount').disabled = true;
  document.getElementById('enterButton').disabled = true;
  document.querySelectorAll('.dsr').forEach(dsrCheckbox => {
    dsrCheckbox.checked = false;
  });
}

function updateBillSummary() {
  const billSummary = document.getElementById('billSummary');
  billSummary.innerHTML = '';
  let totalAmount = 0;

  jobs.forEach(job => {
    const row = document.createElement('tr');

    const departmentCell = document.createElement('td');
    departmentCell.innerText = job.department;
    row.appendChild(departmentCell);

    const dsrCell = document.createElement('td');
    dsrCell.innerText = job.dsrId;
    row.appendChild(dsrCell);

    const amountCell = document.createElement('td');
    amountCell.innerText = job.amount;
    row.appendChild(amountCell);

    billSummary.appendChild(row);
    totalAmount += job.amount;
  });

  document.getElementById('totalAmount').innerText = totalAmount;
}

function generateBill() {
  const totalAmount = jobs.reduce((acc, job) => acc + job.amount, 0);
  const advancePayment = parseInt(document.getElementById('advancePayment').value);
  const remainingPayment = totalAmount - advancePayment;

  fetch('http://localhost:3000/api/bills', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ totalAmount, advancePayment, remainingPayment, jobs })
  })
  .then(response => response.json())
  .then(data => {
    alert('Bill generated with ID: ' + data.billId);
    jobs = [];
    updateBillSummary();
    document.getElementById('advancePayment').value = '0';
    document.getElementById('totalAmount').innerText = '0';
  })
  .catch(error => console.error('Error:', error));
}
