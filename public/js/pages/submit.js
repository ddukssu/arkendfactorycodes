import { API_URL, MATERIALS_DB, MODULES_DB } from '../config.js';
import { initAuth, getToken } from '../auth.js';

let selectedMaterials = [];
let selectedModules = [];

document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    initDatalists();

    window.addTag = addTag;
    window.removeTag = removeTag;
    window.checkAuthAndSubmit = checkAuthAndSubmit;
    window.submitData = submitData;
});

function initDatalists() {
    const matList = document.getElementById('materialsOptions');
    const modList = document.getElementById('modulesOptions');
    if(matList) matList.innerHTML = MATERIALS_DB.map(i => `<option value="${i}">`).join('');
    if(modList) modList.innerHTML = MODULES_DB.map(i => `<option value="${i}">`).join('');
}

function addTag(type) {
    const input = document.getElementById(type === 'material' ? 'materialInput' : 'moduleInput');
    const storage = type === 'material' ? selectedMaterials : selectedModules;
    const val = input.value.trim();

    if (!val || storage.includes(val)) {
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
            <i class="bi bi-x-lg cursor-pointer" onclick="removeTag('${type}', ${index})"></i>
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
    if (getToken()) submitData();
    else new bootstrap.Modal(document.getElementById('guestWarningModal')).show();
}

async function submitData() {
    if (selectedMaterials.length === 0 || selectedModules.length === 0) {
        alert('Select at least one Material and Module');
        return;
    }
    const payload = {
        title: document.getElementById('sTitle').value,
        energy: document.getElementById('sEnergy').value,
        width: document.getElementById('sWidth').value,
        height: document.getElementById('sHeight').value,
        imageUrl: document.getElementById('sImg').value,
        code: document.getElementById('sCode').value,
        materials: selectedMaterials.map(s => ({ name: s })),
        modules: selectedModules
    };

    const headers = { 'Content-Type': 'application/json' };
    const token = getToken();
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_URL}/submissions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
    });

    if (res.ok) {
        alert('Submitted!');
        window.location.href = 'index.html';
    } else {
        const err = await res.json();
        alert('Error: ' + err.error);
    }
}