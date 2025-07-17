// Tab switching
function openTab(evt, tabName) {
  // Hide all tab contents
  const tabcontents = document.querySelectorAll('.tabcontent');
  tabcontents.forEach(tc => tc.classList.remove('active'));

  // Remove active class on all buttons
  const tablinks = document.querySelectorAll('.tablink');
  tablinks.forEach(tl => tl.classList.remove('active'));

  // Show current tab and mark button active
  document.getElementById(tabName).classList.add('active');
  evt.currentTarget.classList.add('active');
}

// Save single job entry
async function saveJob() {
  const job = {
    role: document.getElementById('role').value,
    company: document.getElementById('company').value.trim(),
    location: document.getElementById('location').value.trim(),
    skills: document.getElementById('skills').value.trim(),
    description: document.getElementById('description').value.trim()
  };

  // Basic validation
  if (!job.role || !job.company || !job.location || !job.skills || !job.description) {
    alert("Please fill all fields.");
    return;
  }

  try {
    const res = await fetch('http://127.0.0.1:5000/save_job', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "Failed to save job");
    }

    alert(data.message);
    document.getElementById('jobForm').reset();
  } catch (err) {
    alert("Error: " + err.message);
  }
}

// Save bulk companies
async function saveBulkCompanies() {
  const role = document.getElementById('bulkRole').value;
  const companyListText = document.getElementById('companyList').value.trim();

  if (!role) {
    alert("Please select a role.");
    return;
  }

  if (!companyListText) {
    alert("Please paste company names.");
    return;
  }

  const companies = companyListText
    .split('\n')
    .map(c => c.trim())
    .filter(c => c.length > 0);

  if (companies.length === 0) {
    alert("No valid companies found.");
    return;
  }

  // Create job entries with empty location/skills/description
  const jobs = companies.map(company => ({
    role,
    company,
    location: "",
    skills: "",
    description: ""
  }));

  try {
    for (const job of jobs) {
      const res = await fetch('http://127.0.0.1:5000/save_job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(job)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save company: " + job.company);
    }
    alert(`Successfully added ${jobs.length} companies to the ${role} sheet.`);
    document.getElementById('bulkForm').reset();
  } catch (err) {
    alert("Error saving companies: " + err.message);
  }
}
