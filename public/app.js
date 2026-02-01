const API_URL = '/api';

function getToken() {
    return localStorage.getItem('token');
}

function getRole() {
    return localStorage.getItem('role');
}

document.addEventListener('DOMContentLoaded', () => {
    updateSidebar();

    // Index page logic
    const grid = document.getElementById('templateGrid');
    if (grid) loadTemplates();

    // Search listeners
    const searchInput = document.getElementById('searchInput');
    const materialFilter = document.getElementById('materialFilter');
    if (searchInput) {
        searchInput.addEventListener('input', () => loadTemplates(searchInput.value, materialFilter.value));
        materialFilter.addEventListener('change', () => loadTemplates(searchInput.value, materialFilter.value));
    }
});

// Update Sidebar based on Auth state
function updateSidebar() {
    const guestMenu = document.getElementById('guestMenu');
    const userMenu = document.getElementById('userMenu');
    const token = getToken();

    if (!guestMenu || !userMenu) return;

    if (token) {
        guestMenu.classList.add('d-none');
        userMenu.classList.remove('d-none');

        // Show Admin link if role is admin
        if (getRole() === 'admin') {
            document.getElementById('adminLink').classList.remove('d-none');
        }
    } else {
        guestMenu.classList.remove('d-none');
        userMenu.classList.add('d-none');
    }
}

// Fetch and display templates on Index
async function loadTemplates(search = '', material = '') {
    const grid = document.getElementById('templateGrid');
    if (!grid) return;

    let url = `${API_URL}/templates?`;
    if (search) url += `search=${search}&`;
    if (material) url += `material=${material}`;

    const res = await fetch(url);
    const data = await res.json();

    grid.innerHTML = data.map(t => `
        <div class="col-md-4">
            <div class="card h-100" onclick="window.location.href='detail.html?id=${t._id}'">
                <img src="${t.imageUrl || 'https://via.placeholder.com/400x200?text=No+Image'}" class="card-img-top" alt="${t.title}">
                <div class="card-body">
                    <h5 class="card-title fw-bold">${t.title}</h5>
                    <div class="mb-2">
                        ${t.materials.map(m => `<span class="badge-material">${m.name}</span>`).join('')}
                    </div>
                    <p class="text-muted small mb-0">⚡ ${t.energy} | 🏗️ ${t.space}m²</p>
                </div>
            </div>
        </div>
    `).join('');
}

// Load data for detail.html
async function loadDetailView(id) {
    const res = await fetch(`${API_URL}/templates/${id}`);
    if(!res.ok) return alert('Template not found');

    const t = await res.json();

    document.getElementById('loading').classList.add('d-none');
    document.getElementById('content').classList.remove('d-none');

    document.getElementById('dTitle').innerText = t.title;
    document.getElementById('dImg').src = t.imageUrl || 'https://via.placeholder.com/600x400?text=No+Image';
    document.getElementById('dEnergy').innerText = t.energy;
    document.getElementById('dSpace').innerText = t.space;
    document.getElementById('dCode').innerText = t.code;
    document.getElementById('dModules').innerText = t.modules.join(', ');

    document.getElementById('dMats').innerHTML = t.materials.map(m =>
        `<span class="badge bg-secondary me-1 p-2">${m.name}</span>`
    ).join('');
}

function copyDetailCode() {
    const code = document.getElementById('dCode').innerText;
    navigator.clipboard.writeText(code);
    alert('Copied to clipboard!');
}

// Auth Handlers
// В файле public/app.js
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPass').value;

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('role', data.role);
                alert('Login successful!'); // Добавим для проверки
                window.location.reload();
            } else {
                alert('Login failed: ' + (data.message || data.error || 'Unknown error'));
            }
        } catch (err) {
            console.error(err);
            alert('Server connection failed!');
        }
    });
}

const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPass').value;

        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (res.ok) {
            alert('Registered! Please login.');
            // Switch to login tab using Bootstrap API
            const triggerEl = document.querySelector('#authTab button[data-bs-target="#loginTab"]');
            bootstrap.Tab.getInstance(triggerEl).show();
        } else {
            const data = await res.json();
            alert(data.error);
        }
    });
}

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}

// Submission Logic (submit.html)
function checkAuthAndSubmit() {
    // Validate form first
    const form = document.getElementById('submitPageForm');
    if(!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    if (getToken()) {
        submitData(); // Logged in, submit directly
    } else {
        // Guest: Show warning modal
        const modal = new bootstrap.Modal(document.getElementById('guestWarningModal'));
        modal.show();
    }
}

async function submitData() {
    const materials = document.getElementById('sMats').value.split(',').map(s => ({ name: s.trim() }));
    const modules = document.getElementById('sModules').value.split(',').map(s => s.trim());

    const payload = {
        title: document.getElementById('sTitle').value,
        energy: document.getElementById('sEnergy').value,
        space: document.getElementById('sSpace').value,
        imageUrl: document.getElementById('sImg').value,
        code: document.getElementById('sCode').value,
        materials,
        modules
    };

    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_URL}/submissions`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(payload)
    });

    if (res.ok) {
        alert('Submitted successfully! Waiting for admin approval.');
        window.location.href = 'index.html';
    } else {
        const err = await res.json();
        alert('Error: ' + err.error);
    }
}

// Admin Logic
async function loadSubmissions() {
    const table = document.getElementById('submissionTable');
    if (!table) return;

    const res = await fetch(`${API_URL}/submissions`, {
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });

    if (!res.ok) return;
    const data = await res.json();

    table.innerHTML = data.map(s => `
        <tr>
            <td>${s.title}</td>
            <td>${s.userId ? s.userId.email : '<span class="badge bg-secondary">Anonymous</span>'}</td>
            <td>${s.materials.map(m => m.name).join(', ')}</td>
            <td><small class="text-muted">${s.code.substring(0, 20)}...</small></td>
            <td>
                <button onclick="adminAction('${s._id}', 'approve')" class="btn btn-sm btn-success rounded-pill">Approve</button>
                <button onclick="adminAction('${s._id}', 'reject')" class="btn btn-sm btn-outline-danger rounded-pill">Reject</button>
            </td>
        </tr>
    `).join('');
}

async function adminAction(id, action) {
    const res = await fetch(`${API_URL}/submissions/${id}/${action}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });

    if (res.ok) {
        loadSubmissions();
    }
}