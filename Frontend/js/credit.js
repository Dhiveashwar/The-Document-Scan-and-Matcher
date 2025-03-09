const token = localStorage.getItem("token");
if (!token) {
    window.location.href = "index.html";
}

document.getElementById("creditRequestForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const amount = document.getElementById("creditAmount").value;
    
    const response = await fetch("http://localhost:5000/api/credits/request", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ amount })
    });
    
    const data = await response.json();
    if (response.ok) {
        alert("Credit request submitted successfully!");
        window.location.href = "dash-user.html";
    } else {
        alert("Request failed: " + data.message);
    }
});