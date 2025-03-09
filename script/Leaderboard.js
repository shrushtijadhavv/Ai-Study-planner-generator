// Mobile menu toggle
document.getElementById('mobile-menu-button').addEventListener('click', function() {
    document.getElementById('mobile-menu').classList.toggle('active');
});

// Tab switching
const tabs = document.querySelectorAll('.tab');
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        // Remove active class from all tabs
        tabs.forEach(t => t.classList.remove('active'));
        
        // Add active class to clicked tab
        tab.classList.add('active');
        
        // Hide all tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Show content for the active tab
        const contentId = tab.getAttribute('data-tab') + '-content';
        document.getElementById(contentId).classList.add('active');
    });
});

// Toast notification function
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    toastMessage.textContent = message;
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, duration);
}

// Initialize XP counter with animation
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const currentValue = Math.floor(progress * (end - start) + start);
        obj.innerHTML = `<i class="fas fa-star mr-1"></i>${currentValue.toLocaleString()} XP`;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Initialize random XP increase on actions
const periodSelector = document.getElementById('period-selector');
periodSelector.addEventListener('change', () => {
    showToast(`Showing rankings for ${periodSelector.options[periodSelector.selectedIndex].text}`);
});     

document.addEventListener("DOMContentLoaded", function () {
    // Get XP from localStorage or set default to 320 (matching the UI)
    let storedXP = localStorage.getItem("userXP") || "320";
    
    // Update XP counter in the UI
    const xpCounter = document.getElementById('xp-counter');
    if (xpCounter) {
        xpCounter.innerHTML = `<i class="fas fa-star mr-1"></i>${parseInt(storedXP).toLocaleString()} XP`;
    }
    
    // Also update the XP value in the current user row in the leaderboard
    const currentUserXpCell = document.querySelector('.current-user td:nth-child(4)');
    if (currentUserXpCell) {
        currentUserXpCell.textContent = `${storedXP} XP`;
    }
});

// Simulating random XP gain for demo purposes
document.querySelectorAll('.hover-effect').forEach(button => {
    button.addEventListener('click', () => {
        const xpGained = Math.floor(Math.random() * 20) + 5;
        const xpCounter = document.getElementById('xp-counter');
        
        // Get current XP from localStorage
        let currentXP = parseInt(localStorage.getItem("userXP") || "320");
        let newXP = currentXP + xpGained;
        
        // Update localStorage
        localStorage.setItem("userXP", newXP.toString());
        
        // Animate the XP counter
        animateValue(xpCounter, currentXP, newXP, 1000);
        
        // Update the XP in the current user row
        const currentUserXpCell = document.querySelector('.current-user td:nth-child(4)');
        if (currentUserXpCell) {
            currentUserXpCell.textContent = `${newXP} XP`;
        }
        
        showToast(`You earned ${xpGained} XP!`);
    });
});