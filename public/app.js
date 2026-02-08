const MATERIALS_DB = [
    "Iron Ore", "Copper Ore", "Lime", "Water",
    "Iron Ingot", "Copper Ingot", "Steel Ingot",
    "Electronic Component", "AI Chip", "Originium Shard",
    "Concrete", "Reinforced Plate", "Energy Block"
];

const MODULES_DB = [
    "Smelter", "Assembler", "Sorter", "Splitter",
    "Fluid Pump", "Refinery", "Storage Container",
    "Power Pole", "Thermal Tower", "Conveyor Belt"
];

const API_URL = '/api';

let selectedMaterials = [];
let selectedModules = [];
let currentSubmissions = [];
let currentReviewId = null;

function getToken() {
    return localStorage.getItem('token');
}

function getRole() {
    return localStorage.getItem('role');
}

document.addEventListener('DOMContentLoaded', () => {
    updateSidebar();
    initDatalist('materialsOptions', MATERIALS_DB);
    initDatalist('modulesOptions', MODULES_DB);

    if(document.getElementById('templateGrid')) loadTemplates();

    const searchInput = document.getElementById('searchInput');
    const materialFilter = document.getElementById('materialFilter');
    if (searchInput) {
        searchInput.addEventListener('input', () => loadTemplates(searchInput.value, materialFilter.value));
        materialFilter.addEventListener('change', () => loadTemplates(searchInput.value, materialFilter.value));
    }
});

function updateSidebar() {
    const guestMenu = document.getElementById('guestMenu');
    const userMenu = document.getElementById('userMenu');
    const token = getToken();

    if (!guestMenu || !userMenu) return;

    if (token) {
        guestMenu.classList.add('d-none');
        userMenu.classList.remove('d-none');
        const username = localStorage.getItem('username') || 'Endministrator';
        document.getElementById('userEmailDisplay').innerText = username;
        if (getRole() === 'admin') {
            document.getElementById('adminLink').classList.remove('d-none');
        }
    } else {
        guestMenu.classList.remove('d-none');
        userMenu.classList.add('d-none');
    }
}

function initDatalist(id, items) {
    const dl = document.getElementById(id);
    if (!dl) return;
    dl.innerHTML = items.map(i => `<option value="${i}">`).join('');
}


async function loadTemplates(search = '', material = '') {
    const grid = document.getElementById('templateGrid');
    if (!grid) return;

    let url = `${API_URL}/templates?`;
    if (search) url += `search=${search}&`;
    if (material) url += `material=${material}`;

    try {
        const res = await fetch(url);
        const templates = await res.json();

        if (templates.length === 0) {
            grid.innerHTML = '<p class="text-muted text-center">No protocols found.</p>';
            return;
        }

        grid.innerHTML = templates.map(t => {
            const deleteBtn = getRole() === 'admin'
                ? `<button onclick="deletePublishedTemplate('${t._id}')" class="btn btn-sm btn-outline-danger rounded-0 ms-1" title="Delete Protocol">
             <i class="bi bi-trash3-fill"></i>
            </button>`
                : '';

            return `
            <div class="col-md-6 col-lg-4">
                <div class="card blueprint-card h-100">
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="badge bg-warning text-dark rounded-0">ENERGY: ${t.energy || 0}</span>
                            <small class="text-muted font-monospace">ID: ${t._id.slice(-4).toUpperCase()}</small>
                        </div>
                        
                        <h5 class="card-title text-white text-truncate">${t.title}</h5>
                        
                        <p class="card-text text-secondary small mb-2">
                            Output: <span class="text-light">${t.materials.map(m => m.name).join(', ')}</span>
                        </p>
        
                        <div class="mt-auto pt-3 border-top border-secondary-subtle d-flex justify-content-between align-items-center">
                            <small class="text-muted"><i class="bi bi-person"></i> ${t.authorName || 'Unknown'}</small>
                            
                            <div class="d-flex">
                                <a href="detail.html?id=${t._id}" class="btn btn-sm btn-outline-light rounded-0">VIEW</a>
                                ${deleteBtn}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            `;
        }).join('');
    } catch (err) {
        console.error(err);
    }
}

async function loadDetailView(id) {
    const res = await fetch(`${API_URL}/templates/${id}`);
    if(!res.ok) return alert('Template not found');

    const t = await res.json();

    document.getElementById('loading').classList.add('d-none');
    document.getElementById('content').classList.remove('d-none');

    document.getElementById('dTitle').innerText = t.title;
    document.getElementById('dImg').src = t.imageUrl || 'https://via.placeholder.com/600x400?text=No+Image';
    document.getElementById('dEnergy').innerText = t.energy;
    document.getElementById('dSpace').innerText = `${t.width || '?'} x ${t.height || '?'}`;
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


function addTag(type) {
    const input = document.getElementById(type === 'material' ? 'materialInput' : 'moduleInput');
    if (!input) return;

    const container = document.getElementById(type === 'material' ? 'matsTags' : 'modsTags');
    const storage = type === 'material' ? selectedMaterials : selectedModules;

    const val = input.value.trim();
    if (!val) return;

    if (storage.includes(val)) {
        input.value = '';
        return;
    }

    storage.push(val);
    renderTags(type);
    input.value = '';
    input.focus();
}

function renderTags(type) {
    const container = document.getElementById(type === 'material' ? 'matsTags' : 'modsTags');
    const storage = type === 'material' ? selectedMaterials : selectedModules;

    container.innerHTML = storage.map((item, index) => `
        <span class="badge bg-warning text-dark rounded-0 d-flex align-items-center gap-2">
            ${item}
            <i class="bi bi-x-lg cursor-pointer" onclick="removeTag('${type}', ${index})" style="cursor:pointer"></i>
        </span>
    `).join('');
}

function removeTag(type, index) {
    const storage = type === 'material' ? selectedMaterials : selectedModules;
    storage.splice(index, 1);
    renderTags(type);
}

function checkAuthAndSubmit() {
    const form = document.getElementById('submitPageForm');
    if(!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    if (getToken()) {
        submitData();
    } else {
        const modal = new bootstrap.Modal(document.getElementById('guestWarningModal'));
        modal.show();
    }
}

async function submitData() {
    if (selectedMaterials.length === 0 || selectedModules.length === 0) {
        alert('Please select at least one Material and one Module.');
        return;
    }

    const materialsPayload = selectedMaterials.map(s => ({ name: s }));
    const widthVal = document.getElementById('sWidth').value;
    const heightVal = document.getElementById('sHeight').value;

    const payload = {
        title: document.getElementById('sTitle').value,
        energy: document.getElementById('sEnergy').value,
        width: widthVal,
        height: heightVal,
        imageUrl: document.getElementById('sImg').value,
        code: document.getElementById('sCode').value,
        materials: materialsPayload,
        modules: selectedModules
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
        alert('Error: ' + (err.error || err.message));
    }
}


async function loadSubmissions() {
    const table = document.getElementById('submissionTable');
    if (!table) return;

    try {
        const res = await fetch(`${API_URL}/submissions`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });

        if (!res.ok) return;
        currentSubmissions = await res.json();

        table.innerHTML = currentSubmissions.map(s => `
            <tr>
                <td class="ps-4 font-monospace small text-muted">#${s._id.slice(-4)}</td>
                <td><span class="text-white">${s.authorName || 'Anonymous'}</span></td>
                <td class="text-warning">${s.title}</td>
                <td><span class="status-badge text-warning border-warning">PENDING</span></td>
                <td class="text-end pe-4">
                    <button onclick="openReviewModal('${s._id}')" class="btn btn-sm btn-cute rounded-0">
                        <i class="bi bi-eye-fill me-1"></i> INSPECT
                    </button>
                </td>
            </tr>
        `).join('');
    } catch (err) {
        console.error(err);
    }
}

function openReviewModal(id) {
    const s = currentSubmissions.find(sub => sub._id === id);
    if (!s) return;

    currentReviewId = id;

    document.getElementById('reviewUser').value = s.authorName || 'Anonymous';
    document.getElementById('reviewCodeSource').value = s.code;

    document.getElementById('editTitle').value = s.title;
    document.getElementById('editEnergy').value = s.energy;
    document.getElementById('editWidth').value = s.width || 32;
    document.getElementById('editHeight').value = s.height || 32;
    document.getElementById('editImg').value = s.imageUrl || '';

    const matsString = s.materials ? s.materials.map(m => m.name).join(', ') : '';
    document.getElementById('editMats').value = matsString;

    testImage();

    const modal = new bootstrap.Modal(document.getElementById('reviewModal'));
    modal.show();
}

async function approveAndPublish() {
    if (!currentReviewId) return;

    const payload = {
        title: document.getElementById('editTitle').value,
        energy: document.getElementById('editEnergy').value,
        width: document.getElementById('editWidth').value,
        height: document.getElementById('editHeight').value,
        imageUrl: document.getElementById('editImg').value,
        materials: document.getElementById('editMats').value.split(',').map(s => ({ name: s.trim() }))
    };

    try {
        const res = await fetch(`${API_URL}/submissions/${currentReviewId}/approve`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getToken()}`
            },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            alert('Protocol Verified & Published!');
            window.location.reload();
        } else {
            const err = await res.json();
            alert('Error: ' + err.error);
        }
    } catch (error) {
        console.error(error);
        alert('Failed to connect to server');
    }
}

async function rejectSubmission() {
    if (!currentReviewId) return;
    if(!confirm('Are you sure you want to delete this submission?')) return;

    const res = await fetch(`${API_URL}/submissions/${currentReviewId}/reject`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });

    if (res.ok) window.location.reload();
}

function copySourceCode() {
    const code = document.getElementById('reviewCodeSource').value;
    navigator.clipboard.writeText(code);
    alert('Code copied! Check in game.');
}

function testImage() {
    const url = document.getElementById('editImg').value;
    const box = document.getElementById('imgPreview');
    if(url) {
        box.innerHTML = `<img src="${url}" style="width:100%; height:100%; object-fit:cover;">`;
    } else {
        box.innerHTML = 'NO IMAGE PREVIEW';
    }
}

async function deletePublishedTemplate(id) {
    if (!confirm('WARNING: This will permanently delete this protocol from the public database. Proceed?')) return;

    try {
        const res = await fetch(`${API_URL}/templates/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });

        if (res.ok) {
            alert('Protocol deleted successfully.');
            loadTemplates();
        } else {
            const err = await res.json();
            alert('Error: ' + err.error);
        }
    } catch (error) {
        console.error(error);
        alert('Server error');
    }
}

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
                localStorage.setItem('username', data.username);
                alert('Login successful!');
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
        const username = document.getElementById('regUsername').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPass').value;

        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });

        if (res.ok) {
            alert('Registered! Please login.');
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