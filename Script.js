// GitHub API setup (replace with your repo info and token)
const repoOwner = 'YOUR_GITHUB_USERNAME';  // Replace with your GitHub username
const repoName = 'chat-visitor-counter';   // Replace with your repository name
const issueNumber = 1; // The issue number for "Visitor Count"
const apiToken = 'YOUR_GITHUB_API_TOKEN';  // Create a token at https://github.com/settings/tokens

// LocalStorage setup for saving chat messages
const chatMessages = JSON.parse(localStorage.getItem('chatMessages')) || [];

// Display chat messages from localStorage
const chatBox = document.getElementById('chatBox');
function displayChat() {
    chatBox.innerHTML = chatMessages.map(msg => `<p>${msg}</p>`).join('');
}
displayChat();

// Send message function
function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();

    if (message) {
        // Save the message in localStorage
        chatMessages.push(message);
        localStorage.setItem('chatMessages', JSON.stringify(chatMessages));

        // Display the new message
        displayChat();

        // Clear the input field
        messageInput.value = '';
    }
}

// Function to fetch and update the visitor count from GitHub Issues
async function updateVisitorCount() {
    const response = await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/issues/${issueNumber}`, {
        headers: {
            'Authorization': `token ${apiToken}`
        }
    });
    const issueData = await response.json();

    // Extract the current visitor count from the issue body
    let currentCount = parseInt(issueData.body.match(/Total visits: (\d+)/)[1]);
    currentCount++;

    // Update the visitor count on the website
    document.getElementById('visitorCount').textContent = currentCount;

    // Update the GitHub issue body with the new visitor count
    await fetch(`https://api.github.com/repos/${repoOwner}/${repoName}/issues/${issueNumber}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `token ${apiToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            body: `Total visits: ${currentCount}`
        })
    });
}

// Call the visitor count update function when the page loads
updateVisitorCount();
