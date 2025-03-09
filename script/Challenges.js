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
 
 // Challenge buttons functionality
 document.querySelectorAll('.challenge-button').forEach(button => {
     button.addEventListener('click', function() {
         const progressBar = this.previousElementSibling.querySelector('.progress-bar');
         const progressText = this.previousElementSibling.previousElementSibling.querySelector('.progress-text');
         const xpReward = parseInt(this.getAttribute('data-xp'));
         let currentProgress = parseInt(this.getAttribute('data-progress'));
         
         // Simulate progress update
         let newProgress = currentProgress + 25;
         if (newProgress > 100) newProgress = 100;
         
         // Update the progress bar and text
         progressBar.style.width = newProgress + '%';
         progressText.textContent = newProgress + '%';
         
         // Update button data attribute
         this.setAttribute('data-progress', newProgress);
         
         // If challenge is completed
         if (newProgress === 100) {
             this.textContent = 'Completed!';
             this.disabled = true;
             this.classList.add('bg-opacity-70');
             
             // Update XP counter
             updateXP(xpReward);
             
             // Show completion message
             showToast(`Challenge completed! +${xpReward} XP`);
         } else {
             // Show progress message
             showToast(`Progress updated! ${newProgress}% complete`);
         }
     });
 });
 
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
         } else {
             showToast(`Not enough XP to redeem this reward.`);
         }
     });
 });
 
 // Countdown timer functionality
 function updateCountdowns() {
     document.querySelectorAll('.countdown').forEach(countdown => {
         const timeLeftElement = countdown.querySelector('.time-left');
         let hoursLeft = parseInt(countdown.getAttribute('data-hours'));
         
         if (hoursLeft <= 0) {
             timeLeftElement.textContent = 'Expired';
             countdown.classList.remove('bg-green-900', 'text-green-300');
             countdown.classList.add('bg-red-900', 'text-red-300');
             return;
         }
         
         // Decrease time by a small amount for demo purposes
         // In a real app, you'd use actual time calculations
         const newHours = (hoursLeft - 0.1).toFixed(1);
         countdown.setAttribute('data-hours', newHours);
         
         if (newHours <= 1) {
             timeLeftElement.textContent = `${newHours}h left`;
             countdown.classList.remove('bg-green-900', 'text-green-300');
             countdown.classList.add('bg-red-900', 'text-red-300');
         } else {
             timeLeftElement.textContent = `${newHours}h left`;
         }
     });
 }
 
 // Update countdowns every minute (for demo purposes)
 setInterval(updateCountdowns, 60000);
 
 // Load saved XP from localStorage
 function loadSavedData() {
     const savedXP = localStorage.getItem('userXP');
     if (savedXP) {
         const xpCounter = document.getElementById('xp-counter');
         xpCounter.innerHTML = `<i class="fas fa-star mr-1"></i>${parseInt(savedXP).toLocaleString()} XP`;
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
     
     // Add copyright symbol if missing
     const copyrightText = document.querySelector('.footer-content .text-gray-400');
     if (copyrightText && !copyrightText.textContent.includes('©')) {
         copyrightText.textContent = '© ' + copyrightText.textContent.trim();
     }
 });
 
 // Handle window resize
 window.addEventListener('resize', makeTableResponsive);