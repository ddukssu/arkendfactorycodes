import {API_URL} from "./config.js";

export function getToken() {
    return localStorage.getItem("token");
}

export function getRole() {
    return localStorage.getItem("role");
}

export function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

export function initAuth() {
    updateSidebar();

    const loginForm = document.getElementById("loginForm");
    if (loginForm) loginForm.addEventListener("submit", handleLogin);

    const registerForm = document.getElementById("registerForm");
    if (registerForm) registerForm.addEventListener("submit", handleRegister);

    window.logout = logout;
}

function updateSidebar() {
    const guestMenu = document.getElementById("guestMenu");
    const userMenu = document.getElementById("userMenu");
    const token = getToken();

    if (!guestMenu || !userMenu) return;

    if (token) {
        guestMenu.classList.add("d-none");
        userMenu.classList.remove("d-none");
        const username = localStorage.getItem("username") || "Endministrator";
        const emailDisplay = document.getElementById("userEmailDisplay");
        if (emailDisplay) emailDisplay.innerText = username;

        if (getRole() === "admin") {
            const adminLink = document.getElementById("adminLink");
            if (adminLink) adminLink.classList.remove("d-none");
        }
    } else {
        guestMenu.classList.remove("d-none");
        userMenu.classList.add("d-none");
    }
}

async function handleLogin(e) {
    e.preventDefault()

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPass").value;

    try {
        const res = await fetch(API_URL + "/auth/login", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();

        if (res.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
            localStorage.setItem("username", data.username);
            alert("LOGIN SUCCESS!");
            window.location.reload();
        } else {
            alert("LOGIN ERROR: " + (data.message || data.error));
        }
    } catch (err) {
        console.error(err);
        alert("SERVER CONNECT ERROR!");
    }
}

async function handleRegister(e) {
    e.preventDefault();

    const username = document.getElementById("regUsername").value;
    const email = document.getElementById("regEmail").value;
    const password = document.getElementById("regPass").value;

    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({username, email, password}),
    });

    if (res.ok) {
        alert("REGISTERED\n Please login.");
        const triggerEl = document.querySelector("#authTab button[data-bs-target='#loginTab']");
        if (triggerEl) bootstrap.Tab.getInstance(triggerEl).show();
    } else {
        const data = await res.json();
        alert(data.error);
    }
}