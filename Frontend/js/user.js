
var myToken = localStorage.getItem("token");
if (!myToken) {
   window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", function() {
   
   getProfile();
   getScanHistory();
});

// We are gathering the user info
function getProfile() {
   fetch("http://localhost:5000/api/auth/profile", {
       headers: { "Authorization": "Bearer " + myToken }
   })
   .then(function(resp) {
       return resp.json();
   })
   .then(function(userData) {
       if (userData.username) {
          
           document.getElementById("username").innerText = userData.username;
           document.getElementById("role").innerText = userData.role;
           document.getElementById("credits").innerText = userData.credits;
       } else {
           alert("Couldn't get your profile data");
       }
   })
   .catch(function(err) {
       console.log("Profile error:", err);
       alert("Problem loading your profile");
   });
}

// For getting the users previous scan we are using this
function getScanHistory() {
   fetch("http://localhost:5000/api/documents/history", {
       headers: { "Authorization": "Bearer " + myToken }
   })
   .then(function(resp) {
       return resp.json();
   })
   .then(function(historyData) {
      
       var historyList = document.getElementById("scanHistory");
       
   
       historyList.innerHTML = "";
       
       // For adding the new scan entries
       if (historyData.scans && historyData.scans.length > 0) {
           for (var i = 0; i < historyData.scans.length; i++) {
               var scan = historyData.scans[i];
               var item = document.createElement("li");
               item.textContent = scan.filename + " (ID: " + scan.id + ")";
               historyList.appendChild(item);
           }
       } else {
           historyList.innerHTML = "<li>No scan history found</li>";
       }
   })
   .catch(function(err) {
       console.log("History error:", err);
       document.getElementById("scanHistory").innerHTML = 
           "<li>Error loading scan history</li>";
   });
}
