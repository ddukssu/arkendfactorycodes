import { API_URL, MATERIALS_DB } from "../config.js";
import { getRole, getToken, initAuth } from "../auth.js";

document.addEventListener("DOMContentLoaded", () => {
    initAuth();
    initDatalist();
    loadTemplates();

    const searchInput = document.getElementById("searchInput");
    const materialInput = document.getElementById("materialFilter");
    const energyFilter = document.getElementById('energyFilter');

    if (searchInput) {
        searchInput.addEventListener("input", () => loadTemplates(searchInput.value, materialInput.value));
    }
    if (materialInput) {
        materialInput.addEventListener("input", () => loadTemplates(searchInput.value, materialInput.value));
    }
    if (energyFilter) {
        energyFilter.addEventListener('input', () => loadTemplates());
    }
});

function initDatalist() {
    const dl = document.getElementById("materialsOptions");
    if (dl) dl.innerHTML = MATERIALS_DB.map(i => `<option value="${i}">`).join("");
}

async function loadTemplates() {
    const grid = document.getElementById("templateGrid");
    if (!grid) return;

    const search = document.getElementById('searchInput')?.value || '';
    const material = document.getElementById('materialFilter')?.value || '';
    const maxEnergy = document.getElementById('energyFilter')?.value || '';

    let url = `${API_URL}/templates?`;
    if (search) url += `search=${search}`
    if (material) url += `material=${material}`;
    if (maxEnergy) url += `maxEnergy=${maxEnergy}`;

    try {
        const res = await fetch(url);
        const templates = await res.json();

        if (templates.length === 0) {
            grid.innerHTML = '<p class="text-muted text-center">No templates found.</p>';
            return;
        }

        grid.innerHTML = templates.map(t => {
            const deleteBtn = getRole() === "admin" ? `<button class="btn btn-sm btn-outline-danger rounded-0 ms-1 delete-btn" data-id="{$t._id}"><i class="bi bi-trash3-fill"></i></button>` : '';

            return `
            <div class="col-md-6 col-lg-4">
                <div class="card blueprint-card h-100">
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between mb-2">
                            <span class="badge bg-warning text-dark rounded-0">ENERGY: ${t.energy}</span>
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
            </div>`;
        }).join('');

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => deletePublishedTemplate(e.currentTarget.dataset.id));
        });

    } catch (err) {
        console.error(err);
    }
}

async function deletePublishedTemplate(id) {
    if (!confirm('Permanently delete?')) return;
    try {
        const res = await fetch(`${API_URL}/templates/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        if (res.ok) loadTemplates();
    } catch (error) { console.error(error); }
}