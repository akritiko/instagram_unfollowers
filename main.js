/**
 * Extracts Instagram usernames from HTML content exported from Instagram.
 * @param {string} htmlContent - HTML content from an Instagram data export file
 * @returns {Object} An object mapping usernames to their profile URLs
 */
function extractUsernames(htmlContent) {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");
    
    // Check if parsing was successful
    if (doc.querySelector("parsererror")) {
      throw new Error("Error parsing HTML content");
    }
    
    const users = {};
    
    // Log a sample of the document structure to console for debugging
    console.log('Document title:', doc.title);
    console.log('Sample HTML structure:', doc.body.innerHTML.substring(0, 500));
    
    // Method 1: Try finding elements with specific text patterns
    let foundUsernames = false;
    const allElements = doc.querySelectorAll('*');
    
    allElements.forEach(el => {
      const text = el.textContent.trim();
      
      // Look for elements that only contain what looks like a username (no spaces, reasonable length)
      if (text && 
          text.length > 0 && 
          text.length < 50 && 
          !text.includes(" ") && 
          !text.includes("\n") && 
          text !== "following" && 
          text !== "followers" &&
          !/^\d+$/.test(text)) { // Not just numbers
          
        // Skip common text that isn't usernames
        const commonNonUsernames = ["Instagram", "html", "body", "head", "script", "style", "Following", "Followers", "div"];
        if (!commonNonUsernames.includes(text)) {
          console.log('Potential username found:', text);
          const username = text.startsWith('@') ? text.substring(1) : text;
          const url = `https://www.instagram.com/${username}/`;
          users[username] = url;
          foundUsernames = true;
        }
      }
    });
    
    // Method 2: Check for tables which are often used in exports
    if (!foundUsernames) {
      const tableRows = doc.querySelectorAll('tr');
      if (tableRows.length > 0) {
        console.log('Found table rows:', tableRows.length);
        tableRows.forEach(row => {
          const cells = row.querySelectorAll('td');
          if (cells.length > 0) {
            // Usually the username is in one of the first few cells
            for (let i = 0; i < Math.min(3, cells.length); i++) {
              const text = cells[i].textContent.trim();
              if (text && text.length > 0 && text.length < 50 && !text.includes(" ")) {
                const username = text.startsWith('@') ? text.substring(1) : text;
                const url = `https://www.instagram.com/${username}/`;
                users[username] = url;
                foundUsernames = true;
                break;  // Found username in this row
              }
            }
          }
        });
      }
    }
    
    // Method 3: Look for specific class patterns from Instagram exports
    if (!foundUsernames) {
      // Various class patterns Instagram has used
      const possibleSelectors = [
        '._a6-p', // Newer format
        '.follows', // Possible format
        '.follower',
        '.connections',
        '.user-item',
        '.user-username',
        'div[role="row"]'
      ];
      
      for (const selector of possibleSelectors) {
        const elements = doc.querySelectorAll(selector);
        console.log(`Found ${elements.length} elements with selector ${selector}`);
        
        if (elements.length > 0) {
          elements.forEach(el => {
            // Try to find the username within this element
            let username = el.textContent.trim();
            
            // If the element has multiple children, try to find a more specific child with the username
            if (el.children.length > 0 && username.length > 50) {
              for (const child of el.children) {
                const childText = child.textContent.trim();
                if (childText && childText.length > 0 && childText.length < 50 && !childText.includes(" ")) {
                  username = childText;
                  break;
                }
              }
            }
            
            if (username && username.length > 0 && username.length < 50 && !username.includes(" ")) {
              username = username.startsWith('@') ? username.substring(1) : username;
              const url = `https://www.instagram.com/${username}/`;
              users[username] = url;
              foundUsernames = true;
            }
          });
          
          // If we found usernames with this selector, break the loop
          if (foundUsernames) break;
        }
      }
    }
    
    // Method 4: Try to parse plain text for username patterns
    if (!foundUsernames) {
      const text = doc.body.textContent;
      console.log('Trying text pattern matching...');
      
      // Look for username patterns: alphanumeric with underscores and periods
      const usernamePattern = /(?:^|\s|@)([a-zA-Z0-9._]{3,30})(?:\s|$)/g;
      let match;
      
      while ((match = usernamePattern.exec(text)) !== null) {
        const username = match[1];
        // Skip common words
        const commonWords = ["html", "body", "instagram", "following", "followers", "connections"];
        if (!commonWords.includes(username.toLowerCase())) {
          console.log('Text pattern match:', username);
          const url = `https://www.instagram.com/${username}/`;
          users[username] = url;
          foundUsernames = true;
        }
      }
    }
    
    // Log the results
    console.log('Extracted usernames count:', Object.keys(users).length);
    if (Object.keys(users).length > 0) {
      console.log('Sample of extracted usernames:', Object.keys(users).slice(0, 5));
    }
    
    if (Object.keys(users).length === 0) {
      // Add more detailed error to help troubleshoot
      console.error('HTML Content sample for debugging:', htmlContent.substring(0, 1000));
      throw new Error("No Instagram usernames found in the file. Please check if you've uploaded the correct export files from Instagram.");
    }
    
    return users;
  } catch (error) {
    console.error("Error extracting usernames:", error);
    throw error;
  }
}

/**
 * Generates an HTML page displaying unfollowers with Bootstrap styling.
 * @param {Object} unfollowers - Object containing usernames and their URLs
 * @returns {string} Generated HTML content
 */
function generateHTML(unfollowers) {
  const unfollowerCount = Object.keys(unfollowers).length;
  
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Instagram Unfollowers</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css">
  <style>
    body {
      background-color: #f8f9fa;
      padding: 20px;
    }
    .card-user {
      transition: transform 0.2s, box-shadow 0.2s;
      margin-bottom: 15px;
      height: 100%;
    }
    .card-user:hover {
      transform: translateY(-5px);
      box-shadow: 0 10px 20px rgba(0,0,0,0.1);
    }
    .card-body {
      padding: 15px;
    }
    .user-link {
      text-decoration: none;
      color: #0d6efd;
      display: flex;
      align-items: center;
    }
    .user-link:hover {
      text-decoration: underline;
    }
    .user-icon {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      margin-right: 10px;
      background-color: #e9ecef;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .header-section {
      background-color: white;
      border-radius: 10px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      padding: 25px;
      margin-bottom: 25px;
    }
    .stats-card {
      border-left: 4px solid #0d6efd;
      background-color: white;
      border-radius: 5px;
      padding: 15px;
      margin-bottom: 20px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    }
    .stats-number {
      font-size: 2rem;
      font-weight: bold;
      color: #0d6efd;
    }
    .stats-text {
      color: #6c757d;
    }
    .search-section {
      margin-bottom: 25px;
    }
    .instagram-color {
      background: linear-gradient(45deg, #405de6, #5851db, #833ab4, #c13584, #e1306c, #fd1d1d);
      color: white;
    }
    .page-header {
      padding-bottom: 0.5rem;
      border-bottom: 1px solid #dee2e6;
      margin-bottom: 1.5rem;
    }
    .page-title {
      font-weight: 600;
      margin-bottom: 0;
    }
    .badge-count {
      font-size: 1rem;
      vertical-align: middle;
    }
    .app-footer {
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #dee2e6;
      font-size: 0.85rem;
      color: #6c757d;
      text-align: center;
    }
    .kofi-button {
      display: inline-block;
      padding: 5px 15px;
      background-color: #29abe0;
      color: white !important;
      text-decoration: none;
      border-radius: 4px;
      font-weight: 600;
      font-size: 14px;
      margin-left: 15px;
    }
    .kofi-button:hover {
      background-color: #2185b0;
      text-decoration: none !important;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header-section">
      <div class="row mb-4">
        <div class="col">
          <div class="page-header d-flex justify-content-between align-items-center">
            <h1 class="page-title">
              <i class="bi bi-instagram header-icon"></i>
              Instagram Unfollowers
              <span class="badge bg-secondary ms-2 badge-count">${unfollowerCount}</span>
            </h1>
            <div class="text-muted">Generated on ${new Date().toLocaleDateString()}</div>
          </div>
        </div>
      </div>
      
      <div class="row">
        <div class="col-12">
          <div class="alert alert-primary" role="alert">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <i class="bi bi-info-circle-fill me-2"></i>
                These are the accounts you follow that don't follow you back.
                <a href="https://ko-fi.com/V7V31L6V4" target="_blank" class="kofi-button">
                  <i class="bi bi-cup-hot-fill me-1"></i>Support me on Ko-fi
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="search-section">
      <div class="row">
        <div class="col-md-6 mx-auto">
          <div class="input-group">
            <span class="input-group-text"><i class="bi bi-search"></i></span>
            <input type="text" id="searchInput" class="form-control" placeholder="Search users...">
            <button class="btn btn-outline-secondary" type="button" id="clearSearch">Clear</button>
          </div>
        </div>
      </div>
    </div>
    
    <div class="row" id="userList">
      ${Object.entries(unfollowers).map(([name, url]) => `
        <div class="col-md-4 col-sm-6 user-item">
          <div class="card card-user">
            <div class="card-body">
              <a href="${url}" target="_blank" class="user-link">
                <div class="user-icon">
                  <i class="bi bi-person-fill"></i>
                </div>
                <span class="user-name">${name}</span>
              </a>
            </div>
          </div>
        </div>
      `).join('')}
    </div>
    
    <footer class="app-footer">
      <p>Instagram Unfollowers Finder &copy; 2025 is created by <a href="https://linkedin.com/in/apostoloskritikos" target="_blank" rel="noopener">Apostolos Kritikos</a>.</p>
      <p>This project is not endorsed by nor affiliated with Instagram or Meta in any way.</p>
    </footer>
  </div>

  <script>
    // Add search functionality
    const searchInput = document.getElementById('searchInput');
    const userItems = document.querySelectorAll('.user-item');
    const clearSearch = document.getElementById('clearSearch');
    
    searchInput.addEventListener('input', function() {
      const searchTerm = this.value.toLowerCase();
      filterUsers(searchTerm);
    });
    
    clearSearch.addEventListener('click', function() {
      searchInput.value = '';
      filterUsers('');
    });
    
    function filterUsers(searchTerm) {
      let visibleCount = 0;
      
      userItems.forEach(item => {
        const username = item.querySelector('.user-name').textContent.toLowerCase();
        
        if (username.includes(searchTerm)) {
          item.style.display = '';
          visibleCount++;
        } else {
          item.style.display = 'none';
        }
      });
      
      // Show message if no users match the search
      let noResultsEl = document.getElementById('noResults');
      
      if (visibleCount === 0 && searchTerm !== '') {
        if (!noResultsEl) {
          noResultsEl = document.createElement('div');
          noResultsEl.id = 'noResults';
          noResultsEl.classList.add('col-12', 'text-center', 'py-5');
          noResultsEl.innerHTML = '<div class="alert alert-warning">No users match your search.</div>';
          document.getElementById('userList').appendChild(noResultsEl);
        }
      } else if (noResultsEl) {
        noResultsEl.remove();
      }
    }
  </script>
</body>
</html>`;
}

/**
 * Creates and triggers a download of content as a file.
 * @param {string} content - The content to be downloaded
 * @param {string} filename - The name of the file to be downloaded
 */
function triggerDownload(content, filename) {
  try {
    // The Bootstrap CSS and fonts are loaded via CDN in the HTML
    // so we don't need to fetch the CSS file locally anymore
    
    // Create and download the HTML file
    const blob = new Blob([content], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object to prevent memory leaks
    URL.revokeObjectURL(link.href);
  } catch (error) {
    console.error("Error triggering download:", error);
    throw error;
  }
}

/**
 * Main function that processes the uploaded Instagram following and followers HTML files.
 * It compares the lists to find users you follow who don't follow you back,
 * then generates and downloads an HTML file with the results.
 */
function processFiles() {
  const followingFile = document.getElementById("followingFile").files[0];
  const followersFile = document.getElementById("followersFile").files[0];
  const status = document.querySelector(".output-status");
  const loader = document.querySelector(".loader");
  
  status.textContent = "";
  status.className = "output-status"; // Reset any alert classes
  
  if (!followingFile || !followersFile) {
    status.textContent = "Please upload both files.";
    status.className = "output-status alert alert-danger";
    return;
  }

  // Show loading indicator
  loader.style.display = "inline-block";
  status.textContent = "Processing files...";
  
  // Debug info for file analysis
  console.log("File details - Following:", followingFile.name, followingFile.size);
  console.log("File details - Followers:", followersFile.name, followersFile.size);

  Promise.all([
    followingFile.text(),
    followersFile.text()
  ]).then(([followingHTML, followersHTML]) => {
    try {
      // Show file content samples in console for debugging
      console.log("Following HTML sample:", followingHTML.substring(0, 200));
      console.log("Followers HTML sample:", followersHTML.substring(0, 200));
      
      // Extract usernames from both files
      console.log("Extracting usernames from following file...");
      const following = extractUsernames(followingHTML);
      
      console.log("Extracting usernames from followers file...");
      const followers = extractUsernames(followersHTML);
      
      const followingCount = Object.keys(following).length;
      const followersCount = Object.keys(followers).length;
      
      console.log("Username counts - Following:", followingCount, "Followers:", followersCount);
      
      if (followingCount === 0) {
        throw new Error("No users found in your following list. Please make sure you uploaded the correct 'following.html' file.");
      }
      
      if (followersCount === 0) {
        throw new Error("No users found in your followers list. Please make sure you uploaded the correct 'followers_1.html' file.");
      }
      
      // Find users you follow who don't follow you back
      const unfollowers = {};
      for (let user in following) {
        if (!(user in followers)) {
          unfollowers[user] = following[user];
        }
      }
      
      const unfollowersCount = Object.keys(unfollowers).length;
      console.log("Unfollowers count:", unfollowersCount);
      
      // Generate and download the results
      const resultHTML = generateHTML(unfollowers);
      triggerDownload(resultHTML, "unfollowers.html");
      
      // Display success message with stats
      status.innerHTML = `<i class="bi bi-check-circle-fill me-2"></i>Done! Found <strong>${unfollowersCount}</strong> users who don't follow you back out of <strong>${followingCount}</strong> that you follow.`;
      status.className = "output-status alert alert-success";
    } catch (error) {
      status.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-2"></i>Error: ${error.message}`;
      status.className = "output-status alert alert-danger";
      
      // Add debug information button
      const debugInfoBtn = document.createElement('button');
      debugInfoBtn.className = 'btn btn-sm btn-outline-danger mt-2';
      debugInfoBtn.textContent = 'Show Technical Details';
      debugInfoBtn.onclick = function() {
        const debugInfo = document.createElement('div');
        debugInfo.className = 'mt-2 text-start';
        debugInfo.style.fontSize = '0.8rem';
        debugInfo.style.fontFamily = 'monospace';
        debugInfo.style.whiteSpace = 'pre-wrap';
        debugInfo.textContent = `Error: ${error.stack || error.message}\n\nPlease try uploading different Instagram files. The format might have changed.\nCheck the browser console for more details (press F12).`;
        
        this.parentNode.appendChild(debugInfo);
        this.style.display = 'none';
      };
      
      status.appendChild(debugInfoBtn);
      console.error("Error processing files:", error);
    } finally {
      // Hide loading indicator
      loader.style.display = "none";
    }
  }).catch(error => {
    loader.style.display = "none";
    status.innerHTML = `<i class="bi bi-exclamation-triangle-fill me-2"></i>Error: ${error.message}`;
    status.className = "output-status alert alert-danger";
    console.error("Error reading files:", error);
  });
}

/**
 * Initializes the application and adds event listeners.
 */
function initApp() {
  // Add event listener for the process button
  const processButton = document.getElementById("processButton");
  if (processButton) {
    processButton.addEventListener("click", processFiles);
  }
  
  // Add file input listeners to show filenames
  const fileInputs = document.querySelectorAll('input[type="file"]');
  fileInputs.forEach(input => {
    input.addEventListener('change', function() {
      const fileName = this.files[0]?.name;
      const container = this.closest('.file-input-container');
      
      if (fileName) {
        const fileNameDisplay = document.createElement('div');
        fileNameDisplay.className = 'mt-2 text-muted small';
        fileNameDisplay.textContent = fileName;
        
        // Remove any existing filename display
        const existingDisplay = container.querySelector('.text-muted');
        if (existingDisplay) {
          container.removeChild(existingDisplay);
        }
        
        container.appendChild(fileNameDisplay);
      }
    });
  });
}

// Initialize the app when the DOM is fully loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
