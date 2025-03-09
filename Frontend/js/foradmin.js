
var token = localStorage.getItem("token");
if (!token) window.location.href = "index.html";

document.addEventListener("DOMContentLoaded", function() {
    getRequests();
    getStats();
});

// For getting the credit request we are using this
function getRequests() {
    fetch("http://localhost:5000/api/credits/balance", {
        headers: {"Authorization": "Bearer " + token}
    })
    .then(r => r.json())
    .then(data => {
        var table = document.getElementById("request-for-credit");
        
        if (!data?.request?.length) {
            table.innerHTML = "<tr><td colspan='4'>No requests</td></tr>";
            return;
        }

        table.innerHTML = "";
        for(var i = 0; i < data.request.length; i++) {
            var r = data.request[i];
            var btns = r.status === "pending" 
                ? `<button onclick="handle(${r.id}, 'approved')" class="approve">Approve</button>
                   <button onclick="handle(${r.id}, 'denied')" class="deny">Deny</button>`
                : "Processed";
                
            table.innerHTML += `<tr>
                <td>${r.username}</td>
                <td>${r.amount}</td>
                <td>${r.status}</td>
                <td>${btns}</td>
            </tr>`;
        }
    })
    .catch(err => {
        console.log("Error:", err);
        document.getElementById("request-for-credit").innerHTML = 
            "<tr><td colspan='4'>Load error</td></tr>";
    });
}

function getStats() {
    fetch("http://localhost:5000/api/admin/analytics", {
        headers: {"Authorization": "Bearer " + token}
    })
    .then(r => r.json())
    .then(data => {
        console.log("Stats:", data);
        var table = document.getElementById("userStats");
        
        if (!data?.userStats?.length) {
            table.innerHTML = "<tr><td colspan='3'>No stats</td></tr>";
            return;
        }

        table.innerHTML = "";
        for(var i = 0; i < data.userStats.length; i++) {
            var u = data.userStats[i];
            table.innerHTML += `<tr>
                <td>${u.username}</td>
                <td>${u.total_scans}</td>
                <td>${u.credits}</td>
            </tr>`;
        }
    })
    .catch(err => {
        console.log("Stats error:", err);
        document.getElementById("userStats").innerHTML = 
            "<tr><td colspan='3'>Stats load error</td></tr>";
    });
}


function handle(id, status) {
    fetch("http://localhost:5000/api/credits/process", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify({requestId: id, status: status})
    })
    .then(r => r.json())
    .then(data => {
        alert(data.message || "Done!");
        getRequests();
    })
    .catch(err => {
        console.log("Process error:", err);
        alert("Error processing request");
    });
}