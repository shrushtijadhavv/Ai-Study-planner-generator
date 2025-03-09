// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', function() {
    mobileMenu.classList.toggle('active');
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

// Get current XP value
function getCurrentXP() {
    const xpCounter = document.getElementById('xp-counter');
    const xpText = xpCounter.textContent.trim();
    return parseInt(xpText.replace(/[^\d]/g, ''));
}

// Update XP counter
function updateXP(amount) {
    const xpCounter = document.getElementById('xp-counter');
    let currentXP = getCurrentXP();
    currentXP += amount;
    
    // Format with commas
    xpCounter.innerHTML = `<i class="fas fa-star mr-1"></i>${currentXP.toLocaleString()} XP`;
    
    // Show toast notification
    if (amount > 0) {
        showToast(`Earned ${amount} XP!`);
    } else if (amount < 0) {
        showToast(`Spent ${Math.abs(amount)} XP`);
    }
    
    // Save to localStorage
    localStorage.setItem('userXP', currentXP);
    
    return currentXP;
}

// Reward buttons functionality
document.querySelectorAll('.reward-button').forEach(button => {
    button.addEventListener('click', function() {
        const xpCost = parseInt(this.getAttribute('data-cost'));
        const currentXP = getCurrentXP();
        
        if (currentXP >= xpCost) {
            // Update XP counter
            updateXP(-xpCost);
            
            // Show success message
            showToast(`Reward redeemed successfully!`);
            
            // Add visual feedback
            const rewardCard = this.closest('.reward-card');
            rewardCard.style.border = '2px solid #16BC88';
            
            setTimeout(() => {
                rewardCard.style.border = '1px solid rgb(55, 65, 81)';
            }, 2000);
            
            // Add to redeemed rewards (in a real app, this would be saved to a database)
            // For demo purposes, we'll just show a toast
            showToast(`Reward added to your account!`, 4000);
        } else {
            showToast(`Not enough XP to redeem this reward.`);
        }
    });
});

// Load saved XP from localStorage
function loadSavedData() {
    const savedXP = localStorage.getItem('userXP');
    if (savedXP) {
        const xpCounter = document.getElementById('xp-counter');
        xpCounter.innerHTML = `<i class="fas fa-star mr-1"></i>${parseInt(savedXP).toLocaleString()} XP`;
        
        // Update progress bar based on XP
        const progressBar = document.querySelector('.progress-bar');
        const progressText = document.querySelector('.flex.mb-2 .text-right span');
        const currentXP = parseInt(savedXP);
        const targetXP = 5000;
        const percentage = Math.min(Math.round((currentXP / targetXP) * 100), 100);
        
        progressBar.style.width = `${percentage}%`;
        progressText.textContent = `${percentage}%`;
    }
}

// Make the table responsive
function makeTableResponsive() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        const tableParent = table.parentElement;
        if (!tableParent.classList.contains('responsive-table-wrapper')) {
            table.classList.add('responsive-table');
        }
    });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadSavedData();
    makeTableResponsive();
});

// Handle window resize
window.addEventListener('resize', makeTableResponsive);