import { API_URL } from '../config.js';
import { initAuth, getToken } from '../auth.js';

let currentSubmissions = [];
let currentReviewId = null;

document.addEventListener('DOMContentLoaded', () => {
    initAuth();
    loadSubmissions();

    window.openReviewModal = openReviewModal;
    window.approveAndPublish = approveAndPublish;
    window.rejectSubmission = rejectSubmission;
    window.copySourceCode = copySourceCode;

    const imgInput = document.getElementById('editImg');
    if (imgInput) imgInput.addEventListener('input', testImage);
});

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
    new bootstrap.Modal(document.getElementById('reviewModal')).show();
}

function testImage() {
    const url = document.getElementById('editImg').value;
    const box = document.getElementById('imgPreview');
    box.innerHTML = url
        ? `<img src="${url}" style="width:100%; height:100%; object-fit:cover;">`
        : 'NO IMAGE PREVIEW';
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
    if (!currentReviewId || !confirm('Are you sure you want to delete this submission?')) return;

    const res = await fetch(`${API_URL}/submissions/${currentReviewId}/reject`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${getToken()}` }
    });

    if (res.ok) window.location.reload();
}

function copySourceCode() {
    const code = document.getElementById('reviewCodeSource').value;
    navigator.clipboard.writeText(code);
    alert('Code copied!');
}