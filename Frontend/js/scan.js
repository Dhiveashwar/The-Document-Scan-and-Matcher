
document.addEventListener("DOMContentLoaded", function() {
    
    var userToken = localStorage.getItem("token");
    if (!userToken) {
        window.location.href = "index.html";
        return; 
    }
 
    // for knowing elements we are using this
    var docForm = document.getElementById("uploadForm");
    var fileField = document.getElementById("document");
    var resultsArea = document.getElementById("matchResults");
 
    
    if (docForm) {
       
        if (!docForm.hasAttribute("data-scan-handler")) {
            docForm.setAttribute("data-scan-handler", "true");
            docForm.addEventListener("submit", submitHandler);
        }
    }
 
    // For handling the file uploaded scans
    function submitHandler(evt) {
        evt.preventDefault();
 
        if (!fileField.files.length) {
            alert("Please select a file to upload.");
            return;
        }
 
        resultsArea.innerHTML = "<p>Uploading & Scanning... Please wait.</p>";

        var formData = new FormData();
        formData.append("document", fileField.files[0]);
 
        // Firstly we have to upload the file
        fetch("http://localhost:5000/api/documents/upload", {
            method: "POST",
            headers: { 
                "Authorization": "Bearer " + userToken 
            },
            body: formData
        })
        .then(function(uploadResp) {
            return uploadResp.json();
        })
        .then(function(fileData) {
            // For checking the file is uploaded or not
            if (!fileData.id) {
                alert("Upload failed: " + (fileData.message || "Unknown error"));
                resultsArea.innerHTML = "";
                return Promise.reject("Upload failed");
            }

            alert("File uploaded successfully!");
            console.log("Document ID:", fileData.id);

            if (typeof getProfile === 'function') getProfile();
            if (typeof getScanHistory === 'function') getScanHistory();

            return fetch("http://localhost:5000/api/documents/match/" + fileData.id, {
                method: "GET",
                headers: { 
                    "Authorization": "Bearer " + userToken 
                }
            });
        })
        .then(function(matchResp) {
            return matchResp.json();
        })
        .then(function(scanResults) {
          
            console.log("Matching Results:", scanResults);
 
            if (!scanResults.matches) {
                resultsArea.innerHTML = "<p>No matching documents found.</p>";
                return;
            }

            resultsArea.innerHTML = "<h3>Matching Documents</h3>";

            var listItems = "";
            
            if (Array.isArray(scanResults.matches)) {

                for (var i = 0; i < scanResults.matches.length; i++) {
                    listItems += "<li>" + scanResults.matches[i] + "</li>";
                }
            } else if (scanResults.matches.parts) {

                for (var j = 0; j < scanResults.matches.parts.length; j++) {
                    listItems += "<li>" + scanResults.matches.parts[j].text + "</li>";
                }
            } else if (typeof scanResults.matches === "string") {
            
                listItems = "<li>" + scanResults.matches + "</li>";
            } else {
        
                listItems = "<li>No valid response from AI</li>";
            }
            
            // We adding here the list page
            resultsArea.innerHTML += "<ul>" + listItems + "</ul>";
        })
        .catch(function(error) {
            console.error("Error in scan:", error);
            resultsArea.innerHTML = "";
        });
    }
});