// Notification System for AI Study Planner
// This file contains the common notification functionality used across all pages

// Global variables
let notifications = [];
let notificationPanel = null;

// Load notifications from localStorage
function loadNotifications() {
    const savedNotifications = localStorage.getItem('notifications');
    if (savedNotifications) {
        notifications = JSON.parse(savedNotifications);
    } else {
        // Default notifications for new users
        notifications = [
            {
                id: 1,
                title: 'Welcome to AI Study Planner',
                message: 'Get started by creating your first study plan',
                time: new Date().toISOString(),
                read: false,
                type: 'system'
            },
            {
                id: 2,
                title: 'New Feature: Study Analytics',
                message: 'Track your progress with our new analytics dashboard',
                time: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                read: false,
                type: 'system'
            },
            {
                id: 3,
                title: 'Assignment Due Soon',
                message: 'Math Assignment is due in 2 days',
                time: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                read: true,
                type: 'assignment'
            }
        ];
        saveNotifications();
    }
    updateNotificationBadge();
}

// Save notifications to localStorage
function saveNotifications() {
    localStorage.setItem('notifications', JSON.stringify(notifications));
}

// Add a new notification
function addNotification(title, message, type = 'system') {
    const newNotification = {
        id: Date.now(),
        title,
        message,
        time: new Date().toISOString(),
        read: false,
        type
    };
    
    notifications.unshift(newNotification);
    saveNotifications();
    updateNotificationBadge();
}

// Mark notification as read
function markAsRead(id) {
    const notification = notifications.find(n => n.id === id);
    if (notification) {
        notification.read = true;
        saveNotifications();
        updateNotificationBadge();
    }
}

// Mark all notifications as read
function markAllAsRead() {
    notifications.forEach(notification => {
        notification.read = true;
    });
    saveNotifications();
    
    // Add visual feedback when marking all as read
    const badge = document.querySelector('#notificationBtn span.notification-badge');
    if (badge) {
        badge.classList.add('fade-out');
        setTimeout(() => {
            badge.classList.remove('fade-out');
            updateNotificationBadge();
        }, 300);
    }
}

// Delete a notification
function deleteNotification(id) {
    notifications = notifications.filter(n => n.id !== id);
    saveNotifications();
    updateNotificationBadge();
    renderNotificationPanel();
}

// Clear all notifications
function clearAllNotifications() {
    notifications = [];
    saveNotifications();
    updateNotificationBadge();
    renderNotificationPanel();
}

// Update notification badge
function updateNotificationBadge() {
    const unreadCount = notifications.filter(n => !n.read).length;
    const badge = document.querySelector('#notificationBtn span.notification-badge');
    
    if (badge) {
        if (unreadCount > 0) {
            badge.classList.remove('hidden');
            badge.classList.add('visible');
        } else {
            badge.classList.add('hidden');
            badge.classList.remove('visible');
        }
    }
}

// Format relative time
function formatRelativeTime(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
        return 'Just now';
    } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 604800) {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    } else {
        return date.toLocaleDateString();
    }
}

// Create and render notification panel
function renderNotificationPanel() {
    // Get the notification button
    const notificationBtn = document.querySelector('#notificationBtn');
    
    // Remove existing panel if it exists
    if (notificationPanel) {
        notificationPanel.remove();
    }
    
    // Create new panel
    notificationPanel = document.createElement('div');
    notificationPanel.id = 'notificationPanel';
    notificationPanel.className = 'fixed right-4 mt-2 w-96 bg-gray-800 rounded-lg shadow-xl py-2 z-50 max-h-[80vh] overflow-y-auto border border-gray-700 transform transition-all duration-200 ease-out';
    
    // Panel header
    const header = document.createElement('div');
    header.className = 'px-4 py-3 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800 z-10';
    
    const title = document.createElement('h3');
    title.className = 'text-lg font-semibold text-white';
    title.textContent = 'Notifications';
    
    const actions = document.createElement('div');
    actions.className = 'flex space-x-3';
    
    const markAllReadBtn = document.createElement('button');
    markAllReadBtn.className = 'text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center';
    markAllReadBtn.innerHTML = '<i class="fas fa-check-double mr-1"></i> Mark all read';
    markAllReadBtn.addEventListener('click', () => {
        markAllAsRead();
        renderNotificationPanel();
    });
    
    const clearAllBtn = document.createElement('button');
    clearAllBtn.className = 'text-sm text-gray-400 hover:text-white transition-colors duration-200 flex items-center';
    clearAllBtn.innerHTML = '<i class="fas fa-trash-alt mr-1"></i> Clear all';
    clearAllBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all notifications?')) {
            clearAllNotifications();
        }
    });
    
    actions.appendChild(markAllReadBtn);
    actions.appendChild(clearAllBtn);
    header.appendChild(title);
    header.appendChild(actions);
    notificationPanel.appendChild(header);
    
    // Notification list
    if (notifications.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'px-4 py-8 text-center';
        
        const emptyIcon = document.createElement('i');
        emptyIcon.className = 'fas fa-bell-slash text-4xl text-gray-600 mb-3';
        
        const emptyText = document.createElement('p');
        emptyText.className = 'text-gray-400 text-sm';
        emptyText.textContent = 'No notifications';
        
        emptyState.appendChild(emptyIcon);
        emptyState.appendChild(emptyText);
        notificationPanel.appendChild(emptyState);
    } else {
        const list = document.createElement('div');
        list.className = 'divide-y divide-gray-700';
        
        notifications.forEach(notification => {
            const item = document.createElement('div');
            item.className = `px-4 py-3 hover:bg-gray-700 transition-colors duration-200 cursor-pointer ${notification.read ? 'opacity-70' : ''}`;
            item.addEventListener('click', () => {
                markAsRead(notification.id);
                renderNotificationPanel();
            });
            
            const itemHeader = document.createElement('div');
            itemHeader.className = 'flex justify-between items-start mb-1';
            
            const itemTitle = document.createElement('h4');
            itemTitle.className = `text-sm font-medium ${notification.read ? 'text-gray-400' : 'text-white'}`;
            itemTitle.textContent = notification.title;
            
            const itemTime = document.createElement('span');
            itemTime.className = 'text-xs text-gray-500 ml-2 whitespace-nowrap';
            itemTime.textContent = formatRelativeTime(notification.time);
            
            itemHeader.appendChild(itemTitle);
            itemHeader.appendChild(itemTime);
            
            const itemMessage = document.createElement('p');
            itemMessage.className = 'text-sm text-gray-400 mb-2';
            itemMessage.textContent = notification.message;
            
            const itemFooter = document.createElement('div');
            itemFooter.className = 'flex justify-between items-center';
            
            const itemType = document.createElement('span');
            itemType.className = 'text-xs px-2 py-1 rounded-full font-medium transition-all duration-200';
            
            // Style based on notification type
            switch (notification.type) {
                case 'assignment':
                    itemType.className += ' bg-yellow-900/50 text-yellow-300 border border-yellow-700/50';
                    itemType.innerHTML = '<i class="fas fa-book-open mr-1"></i> Assignment';
                    break;
                case 'reminder':
                    itemType.className += ' bg-blue-900/50 text-blue-300 border border-blue-700/50';
                    itemType.innerHTML = '<i class="fas fa-clock mr-1"></i> Reminder';
                    break;
                case 'course':
                    itemType.className += ' bg-green-900/50 text-green-300 border border-green-700/50';
                    itemType.innerHTML = '<i class="fas fa-graduation-cap mr-1"></i> Course';
                    break;
                default:
                    itemType.className += ' bg-gray-700/50 text-gray-300 border border-gray-600/50';
                    itemType.innerHTML = '<i class="fas fa-info-circle mr-1"></i> System';
            }
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'text-gray-400 hover:text-red-400 transition-colors duration-200 p-1 hover:bg-red-900/20 rounded';
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm('Are you sure you want to delete this notification?')) {
                    deleteNotification(notification.id);
                }
            });
            
            itemFooter.appendChild(itemType);
            itemFooter.appendChild(deleteBtn);
            
            item.appendChild(itemHeader);
            item.appendChild(itemMessage);
            item.appendChild(itemFooter);
            list.appendChild(item);
        });
        
        notificationPanel.appendChild(list);
    }
    
    // Add to DOM
    document.body.appendChild(notificationPanel);
    
    // Position the panel
    const btnRect = notificationBtn.getBoundingClientRect();
    notificationPanel.style.position = 'fixed';
    notificationPanel.style.top = `${btnRect.bottom + 8}px`;
    notificationPanel.style.right = '1rem';
    
    // Add animation
    setTimeout(() => {
        notificationPanel.style.opacity = '1';
        notificationPanel.style.transform = 'translateY(0) scale(1)';
    }, 0);
}

// Toggle notification panel
function toggleNotificationPanel() {
    if (notificationPanel && document.body.contains(notificationPanel)) {
        notificationPanel.remove();
        notificationPanel = null;
    } else {
        renderNotificationPanel();
    }
}

// Initialize notification system
function initNotificationSystem() {
    loadNotifications();
    
    // Set up notification button click handler
    const notificationBtn = document.querySelector('#notificationBtn');
    if (notificationBtn) {
        notificationBtn.addEventListener('click', (e) => {
            e.preventDefault();
            toggleNotificationPanel();
        });
    }
    
    // Close notification panel when clicking outside
    document.addEventListener('click', (e) => {
        const notificationBtn = document.querySelector('#notificationBtn');
        if (notificationPanel && 
            !notificationPanel.contains(e.target) && 
            notificationBtn && 
            !notificationBtn.contains(e.target)) {
            notificationPanel.remove();
            notificationPanel = null;
        }
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initNotificationSystem); 