import { API_URL } from '../config.js';
import { initAuth } from '../auth.js';

document.addEventListener('DOMContentLoaded', () => {
    initAuth();

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');

    if (id) {
        loadDetailView(id);
    } else {
        alert('No ID provided');
        window.location.href = 'index.html';
    }

    const copyBtn = document.querySelector('.btn-copy-code');
    if(copyBtn) copyBtn.addEventListener('click', copyDetailCode);

    window.copyDetailCode = copyDetailCode;
});

async function loadDetailView(id) {
    try {
        const res = await fetch(`${API_URL}/templates/${id}`);
        if(!res.ok) throw new Error('Template not found');

        const t = await res.json();

        document.getElementById('loading').classList.add('d-none');
        document.getElementById('content').classList.remove('d-none');

        document.getElementById('dTitle').innerText = t.title;
        const img = document.getElementById('dImg');
        img.src = t.imageUrl || 'https://via.placeholder.com/600x400?text=No+Image';
        img.onerror = () => { img.src = 'https://via.placeholder.com/600x400?text=Error'; };

        document.getElementById('dEnergy').innerText = t.energy;
        document.getElementById('dSpace').innerText = `${t.width || '?'} x ${t.height || '?'}`;
        document.getElementById('dCode').innerText = t.code;
        document.getElementById('dModules').innerText = t.modules.join(', ');

        document.getElementById('dMats').innerHTML = t.materials.map(m =>
            `<span class="badge bg-secondary me-1 p-2">${m.name}</span>`
        ).join('');
    } catch(err) {
        alert(err.message);
        window.location.href = 'index.html';
    }
}

function copyDetailCode() {
    const code = document.getElementById('dCode').innerText;
    navigator.clipboard.writeText(code);
    alert('Copied to clipboard!');
}