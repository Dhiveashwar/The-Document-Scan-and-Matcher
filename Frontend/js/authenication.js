const sign_in_btn = document.querySelector("#sign-in-btn");
const sign_up_btn = document.querySelector("#sign-up-btn");
const container = document.querySelector(".container");

sign_up_btn.addEventListener("click", () => {
    container.classList.add("sign-up-mode");
});

sign_in_btn.addEventListener("click", () => {
    container.classList.remove("sign-up-mode");
});

// For Handling the login we are using this
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;
    
    try {
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });
        const data = await response.json();
        
        if (response.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.role);
          
            console.log("Role from server:", data.role);
            
        
            if (data.role && data.role.toLowerCase() === "admin") {
                window.location.href = "dash-admin.html";
            } else {
                window.location.href = "dash-user.html";
            }
        } else {
            alert(data.message || "Login failed");
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("An error occurred during login");
    }
});


document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("registerUsername").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;
    
    try {
        const response = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });
        const data = await response.json();
        
        if (response.ok) {
            alert("Registration successful! Please login.");
            container.classList.remove("sign-up-mode");
        } else {
            alert(data.message || "Registration failed");
        }
    } catch (error) {
        console.error("Registration error:", error);
        alert("An error occurred during registration");
    }
});