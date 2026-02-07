const MATERIALS_DB = [
    "Iron Ore", "Copper Ore", "Lime", "Water",
    "Iron Ingot", "Copper Ingot", "Steel Ingot",
    "Electronic Component", "AI Chip", "Originium Shard",
    "Concrete", "Reinforced Plate", "Energy Block"
];

let selectedMaterials = [];
let selectedModules = [];


const MODULES_DB = [
    "Smelter", "Assembler", "Sorter", "Splitter",
    "Fluid Pump", "Refinery", "Storage Container",
    "Power Pole", "Thermal Tower", "Conveyor Belt"
];
const API_URL = '/api';

function getToken() {
    return localStorage.getItem('token');
}

function getRole() {
    return localStorage.getItem('role');
}

document.addEventListener('DOMContentLoaded', () => {
    updateSidebar();

    initDatalist('materialsOptions', MATERIALS_DB);

    if(document.getElementById('templateGrid')) loadTemplates();

    const grid = document.getElementById('templateGrid');

    const searchInput = document.getElementById('searchInput');
    const materialFilter = document.getElementById('materialFilter');
    if (searchInput) {
        searchInput.addEventListener('input', () => loadTemplates(searchInput.value, materialFilter.value));
        materialFilter.addEventListener('change', () => loadTemplates(searchInput.value, materialFilter.value));
    }

    initDatalist('materialsOptions', MATERIALS_DB);
    initDatalist('modulesOptions', MODULES_DB);
});

function updateSidebar() {
    const guestMenu = document.getElementById('guestMenu');
    const userMenu = document.getElementById('userMenu');
    const token = getToken();

    if (!guestMenu || !userMenu) return;

    if (token) {
        guestMenu.classList.add('d-none');
        userMenu.classList.remove('d-none');

        if (getRole() === 'admin') {
            document.getElementById('adminLink').classList.remove('d-none');
        }
    } else {
        guestMenu.classList.remove('d-none');
        userMenu.classList.add('d-none');
    }
}

async function loadTemplates(search = '', material = '') {
    const grid = document.getElementById('templateGrid');
    if (!grid) return;

    let url = `${API_URL}/templates?`;
    if (search) url += `search=${search}&`;
    if (material) url += `material=${material}`;

    const res = await fetch(url);
    const data = await res.json();

    grid.innerHTML = `
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
                
                <a href="detail.html?id=${t._id}" class="btn btn-sm btn-outline-light rounded-0">
                    VIEW PROTOCOL
                </a>
            </div>
        </div>
    </div>
`;
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
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPass').value;

        const res = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
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
function initDatalist(id, items) {
    const dl = document.getElementById(id);
    if (!dl) return;
    dl.innerHTML = items.map(i => `<option value="${i}">`).join('');
}

function addTag(type) {
    const input = document.getElementById(type === 'material' ? 'materialInput' : 'moduleInput');
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

async function submitData() {
    // Валидация: пользователь должен выбрать хотя бы 1 материал и модуль
    if (selectedMaterials.length === 0 || selectedModules.length === 0) {
        alert('Please select at least one Material and one Module.');
        return;
    }

    // Преобразуем массив строк в формат, который ждет бэкенд: [{name: "Iron"}, ...]
    const materialsPayload = selectedMaterials.map(s => ({ name: s }));

    const payload = {
        title: document.getElementById('sTitle').value,
        energy: document.getElementById('sEnergy').value,

        // Тут берем данные из новых полей Width/Height (если ты их уже добавил в HTML)
        // Если еще нет, используй старое поле sSpace
        width: document.getElementById('sWidth')?.value || 0,
        height: document.getElementById('sHeight')?.value || 0,
        space: (document.getElementById('sWidth')?.value || 0) * (document.getElementById('sHeight')?.value || 0), // Временный костыль для совместимости

        imageUrl: document.getElementById('sImg').value,
        code: document.getElementById('sCode').value,
        materials: materialsPayload, // Отправляем массив из тегов
        modules: selectedModules     // Отправляем массив строк
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