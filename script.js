// =====================
// Initialize localStorage
// =====================
const defaultScholarships = [
  { id: 1, name: "Merit Excellence Award", amount: "$5,000", deadline: "2025-10-30" },
  { id: 2, name: "STEM Innovation Grant", amount: "$3,000", deadline: "2025-11-15" },
  { id: 3, name: "Financial Need Bursary", amount: "$2,500", deadline: "2025-12-01" }
];

if (!localStorage.getItem('availableScholarships')) {
  localStorage.setItem('availableScholarships', JSON.stringify(defaultScholarships));
}
if (!localStorage.getItem('myApplications')) {
  localStorage.setItem('myApplications', JSON.stringify([]));
}

// =====================
// Student Dashboard
// =====================
let currentScholarshipId = null;

function loadScholarships() {
  const scholarships = JSON.parse(localStorage.getItem('availableScholarships')) || [];
  const applications = JSON.parse(localStorage.getItem('myApplications')) || [];
  const tbody = document.getElementById('available-scholarships')?.getElementsByTagName('tbody')[0];
  if (!tbody) return;
  tbody.innerHTML = '';

  scholarships.forEach(s => {
    const row = tbody.insertRow();
    row.setAttribute('data-id', s.id);
    row.insertCell(0).textContent = s.name;
    row.insertCell(1).textContent = s.amount;
    row.insertCell(2).textContent = s.deadline;

    const btnCell = row.insertCell(3);
    const btn = document.createElement('button');
    btn.textContent = applications.find(a => a.id === s.id) ? 'Submitted!' : 'Apply Now';
    btn.disabled = applications.find(a => a.id === s.id) ? true : false;
    btn.style.backgroundColor = applications.find(a => a.id === s.id) ? '#6c757d' : '#007bff';
    btn.onclick = () => showApplicationForm(s.id);
    btnCell.appendChild(btn);
  });
}

function loadApplications() {
  const applications = JSON.parse(localStorage.getItem('myApplications')) || [];
  const tbody = document.getElementById('my-applications')?.getElementsByTagName('tbody')[0];
  if (!tbody) return;
  tbody.innerHTML = '';

  applications.forEach(app => {
    const row = tbody.insertRow();
    row.insertCell(0).textContent = app.name;
    row.insertCell(1).textContent = app.applicantName;
    row.insertCell(2).textContent = app.studentId;
    row.insertCell(3).textContent = app.reason;
    row.insertCell(4).innerHTML = `<span class="status-badge status-submitted">${app.status}</span>`;
    row.insertCell(5).textContent = app.lastUpdated;
  });
}

// =====================
// Application Form
// =====================
function showApplicationForm(scholarshipId) {
  currentScholarshipId = scholarshipId;
  document.getElementById('application-form').style.display = 'block';
}

document.getElementById('cancel-application')?.addEventListener('click', () => {
  document.getElementById('application-form').style.display = 'none';
  currentScholarshipId = null;
});

document.getElementById('application-form')?.addEventListener('submit', function(e){
  e.preventDefault();
  const name = document.getElementById('applicant-name').value;
  const studentId = document.getElementById('student-id').value;
  const reason = document.getElementById('reason').value;

  const scholarships = JSON.parse(localStorage.getItem('availableScholarships')) || [];
  const applications = JSON.parse(localStorage.getItem('myApplications')) || [];
  const scholarship = scholarships.find(s => s.id === currentScholarshipId);
  if (!scholarship) return;

  if (applications.find(a => a.id === currentScholarshipId)) {
    alert(`You already applied for "${scholarship.name}"`);
    return;
  }

  const newApp = {
    id: scholarship.id,
    name: scholarship.name,
    applicantName: name,
    studentId: studentId,
    reason: reason,
    status: "Submitted",
    lastUpdated: new Date().toLocaleDateString()
  };

  applications.push(newApp);
  localStorage.setItem('myApplications', JSON.stringify(applications));

  document.getElementById('application-form').reset();
  document.getElementById('application-form').style.display = 'none';
  currentScholarshipId = null;

  loadScholarships();
  loadApplications();
  alert(`Your application for "${scholarship.name}" has been submitted!`);
});

// =====================
// Admin Dashboard
// =====================
function loadAdminScholarships() {
  const scholarships = JSON.parse(localStorage.getItem('availableScholarships')) || [];
  const tbody = document.getElementById('admin-scholarships')?.getElementsByTagName('tbody')[0];
  if (!tbody) return;
  tbody.innerHTML = '';

  scholarships.forEach(s => {
    const row = tbody.insertRow();
    row.setAttribute('data-id', s.id);
    row.insertCell(0).textContent = s.name;
    row.insertCell(1).textContent = s.amount;
    row.insertCell(2).textContent = s.deadline;

    const actionCell = row.insertCell(3);
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.onclick = () => deleteScholarship(s.id);
    actionCell.appendChild(delBtn);
  });
}

function deleteScholarship(id) {
  let scholarships = JSON.parse(localStorage.getItem('availableScholarships')) || [];
  scholarships = scholarships.filter(s => s.id !== id);
  localStorage.setItem('availableScholarships', JSON.stringify(scholarships));
  loadAdminScholarships();
}

document.getElementById('add-scholarship-form')?.addEventListener('submit', function(e){
  e.preventDefault();
  const name = document.getElementById('scholarship-name').value;
  const amount = document.getElementById('scholarship-amount').value;
  const deadline = document.getElementById('scholarship-deadline').value;

  const scholarships = JSON.parse(localStorage.getItem('availableScholarships')) || [];
  const id = scholarships.length ? scholarships[scholarships.length-1].id + 1 : 1;
  scholarships.push({ id, name, amount, deadline });
  localStorage.setItem('availableScholarships', JSON.stringify(scholarships));

  loadAdminScholarships();
  this.reset();
});

// =====================
// Initialize on page load
// =====================
window.onload = () => {
  loadScholarships();
  loadApplications();
  loadAdminScholarships();
};
