document.addEventListener("DOMContentLoaded", function() {
    // Mobile menu functionality
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });
    
    // Profile dropdown functionality
    const profileDropdownBtn = document.getElementById('profileDropdownBtn');
    const profileDropdown = document.getElementById('profileDropdown');
    
    profileDropdownBtn.addEventListener('click', function() {
        profileDropdown.classList.toggle('hidden');
    });

    // Click outside to close dropdowns
    document.addEventListener('click', function(event) {
        if (!profileDropdownBtn.contains(event.target) && !profileDropdown.contains(event.target)) {
            profileDropdown.classList.add('hidden');
        }
        
        if (!mobileMenuBtn.contains(event.target) && !mobileMenu.contains(event.target)) {
            mobileMenu.classList.add('hidden');
        }
    });

    // Back button functionality
    const backButton = document.getElementById('backBtn');
    backButton.addEventListener('click', function() {
        window.location.href = "dashboard.html";
    });

    // Tab navigation functionality
    const tabs = {
        profile: {
            tab: document.getElementById('profileTab'),
            content: document.getElementById('profileTabContent')
        },
        notifications: {
            tab: document.getElementById('notificationsTab'),
            content: document.getElementById('notificationsTabContent')
        },
        calendar: {
            tab: document.getElementById('calendarTab'),
            content: document.getElementById('calendarTabContent')
        },
        account: {
            tab: document.getElementById('accountTab'),
            content: document.getElementById('accountTabContent')
        }
    };
    
    function setActiveTab(activeTabName) {
        // Hide all tab contents and remove active styles
        Object.values(tabs).forEach(({tab, content}) => {
            content.classList.add('hidden');
            tab.classList.remove('border-custom', 'text-custom');
            tab.classList.add('border-transparent', 'text-gray-400');
        });
        
        // Show active tab content and add active styles
        const activeTab = tabs[activeTabName];
        activeTab.content.classList.remove('hidden');
        activeTab.tab.classList.remove('border-transparent', 'text-gray-400');
        activeTab.tab.classList.add('border-custom', 'text-custom');
        
        // Scroll to the tab content for better UX
        activeTab.content.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Store active tab in localStorage
        localStorage.setItem('activeSettingsTab', activeTabName);
    }
    
    // Set up click handlers for tabs
    Object.entries(tabs).forEach(([name, {tab}]) => {
        tab.addEventListener('click', () => {
            setActiveTab(name);
            // Update URL hash for direct linking
            window.location.hash = name;
        });
    });
    
    // Check for hash in URL to activate specific tab
    const hashTab = window.location.hash.substring(1);
    if (hashTab && tabs[hashTab]) {
        setActiveTab(hashTab);
    } else {
        // Check for previously selected tab in localStorage if no hash
        const savedTab = localStorage.getItem('activeSettingsTab');
        if (savedTab && tabs[savedTab]) {
            setActiveTab(savedTab);
        }
    }
    
    // Handle hash changes in URL
    window.onhashchange = function() {
        const hashTab = window.location.hash.substring(1);
        if (hashTab && tabs[hashTab]) {
            setActiveTab(hashTab);
        }
    };

    // Notification Settings
    function initNotificationSettings() {
        // Make notification toggles functional
        const notificationToggles = {
            'emailToggle': true,
            'pushToggle': true,
            'courseToggle': true,
            'marketingToggle': false,
            'assignmentToggle': true,
            'studyToggle': true,
            'examToggle': true,
            'progressNotifToggle': true
        };
        
        // Load saved toggle states
        Object.keys(notificationToggles).forEach(toggleId => {
            const toggle = document.getElementById(toggleId);
            const savedState = localStorage.getItem(toggleId);
            
            if (savedState !== null) {
                toggle.checked = savedState === 'true';
            } else {
                toggle.checked = notificationToggles[toggleId];
            }
            
            // Add change event listener
            toggle.addEventListener('change', function() {
                localStorage.setItem(toggleId, this.checked);
                
                // If this is the main email toggle, update all other toggles
                if (toggleId === 'emailToggle' && !this.checked) {
                    Object.keys(notificationToggles).forEach(id => {
                        if (id !== 'emailToggle') {
                            const otherToggle = document.getElementById(id);
                            otherToggle.checked = false;
                            localStorage.setItem(id, false);
                        }
                    });
                }
            });
        });

        // Add notification frequency radio button functionality
        const frequencyRadios = document.querySelectorAll('input[name="notification-frequency"]');
        const savedFrequency = localStorage.getItem('notification-frequency');
        
        if (savedFrequency) {
            document.getElementById(savedFrequency).checked = true;
        }
        
        frequencyRadios.forEach(radio => {
            radio.addEventListener('change', function() {
                if (this.checked) {
                    localStorage.setItem('notification-frequency', this.id);
                }
            });
        });

        // Add quiet hours functionality
        const quietHoursToggle = document.getElementById('quiet-hours-toggle');
        const quietHoursStart = document.getElementById('quietHoursStart');
        const quietHoursEnd = document.getElementById('quietHoursEnd');
        
        // Load saved settings
        quietHoursToggle.checked = localStorage.getItem('quiet-hours-enabled') === 'true';
        quietHoursStart.value = localStorage.getItem('quiet-hours-start') || '22:00';
        quietHoursEnd.value = localStorage.getItem('quiet-hours-end') || '07:00';
        
        // Add event listeners
        quietHoursToggle.addEventListener('change', function() {
            localStorage.setItem('quiet-hours-enabled', this.checked);
        });
        
        quietHoursStart.addEventListener('change', function() {
            localStorage.setItem('quiet-hours-start', this.value);
        });
        
        quietHoursEnd.addEventListener('change', function() {
            localStorage.setItem('quiet-hours-end', this.value);
        });
    }

    // Initialize notification settings
    initNotificationSettings();

    // Save button functionality
    const saveButton = document.getElementById('saveBtn');
    saveButton.addEventListener('click', function() {
        // Get form values from all tabs
        // Profile tab
        const firstName = document.getElementById('firstName').value;
        const lastName = document.getElementById('lastName').value;
        const email = document.getElementById('email').value;
        const language = document.getElementById('language').value;
        const timezone = document.getElementById('timezone').value;
        const bio = document.getElementById('bio').value;
        const goals = document.getElementById('learningGoals').value;
        
        // Notifications tab
        const emailNotifications = document.getElementById('emailToggle').checked;
        const pushNotifications = document.getElementById('pushToggle').checked;
        const courseUpdates = document.getElementById('courseToggle').checked;
        const marketingCommunications = document.getElementById('marketingToggle').checked;
        const notificationFrequency = document.querySelector('input[name="notification-frequency"]:checked').id;
        
        // New notification settings
        const assignmentNotifications = document.getElementById('assignmentToggle')?.checked || false;
        const studyReminders = document.getElementById('studyToggle')?.checked || false;
        const examAlerts = document.getElementById('examToggle')?.checked || false;
        const progressNotifications = document.getElementById('progressNotifToggle')?.checked || false;
        const quietHoursEnabled = document.getElementById('quiet-hours-toggle')?.checked || false;
        const quietHoursStart = document.getElementById('quietHoursStart')?.value || '22:00';
        const quietHoursEnd = document.getElementById('quietHoursEnd')?.value || '07:00';
        
        // Calendar tab
        const calendarView = document.querySelector('input[name="calendar-view"]:checked').id;
        const reminderTime = document.getElementById('reminderTime').value;
        
        // Calendar connections
        const googleCalendarConnected = document.getElementById('disconnectGoogleCalendarBtn') !== null;
        const outlookCalendarConnected = document.getElementById('disconnectOutlookCalendarBtn') !== null;
        const appleCalendarConnected = document.getElementById('disconnectAppleCalendarBtn') !== null;
        
        // New calendar settings
        const autoSchedule = document.getElementById('autoScheduleToggle')?.checked || false;
        const studyHoursStart = document.getElementById('studyHoursStart')?.value || '09:00';
        const studyHoursEnd = document.getElementById('studyHoursEnd')?.value || '18:00';
        const sessionDuration = document.getElementById('sessionDuration')?.value || '45 minutes';
        const breakDuration = document.getElementById('breakDuration')?.value || '10 minutes';
        const examCountdown = document.getElementById('examCountdownToggle')?.checked || false;
        const intensiveStudy = document.getElementById('intensiveStudyToggle')?.checked || false;
        const examPrepStart = document.getElementById('examPrepStart')?.value || '2 weeks before';
        
        // Account tab
        const twoFactorEnabled = document.getElementById('twoFactorToggle').checked;
        const twoFactorMethod = document.querySelector('input[name="2fa-method"]:checked')?.id || '2fa-app';
        
        // Check connected accounts status
        const googleConnected = document.getElementById('disconnectGoogleBtn') !== null;
        const githubConnected = document.getElementById('disconnectGithubBtn') !== null;
        const linkedinConnected = document.getElementById('disconnectLinkedinBtn') !== null;
        
        // Preferences
        const showProgress = document.getElementById('progressToggle').checked;
        const desktopNotifications = document.getElementById('desktopNotifToggle').checked;
        const autoplayVideos = document.getElementById('autoplayToggle').checked;
        const showSuggestions = document.getElementById('suggestionsToggle').checked;
        
        // Save all settings to localStorage
        const settings = {
            profile: {
                firstName,
                lastName,
                email,
                language,
                timezone,
                bio,
                goals
            },
            notifications: {
                emailNotifications,
                pushNotifications,
                courseUpdates,
                marketingCommunications,
                notificationFrequency,
                assignmentNotifications,
                studyReminders,
                examAlerts,
                progressNotifications,
                quietHoursEnabled,
                quietHoursStart,
                quietHoursEnd
            },
            calendar: {
                calendarView,
                reminderTime,
                autoSchedule,
                studyHoursStart,
                studyHoursEnd,
                sessionDuration,
                breakDuration,
                examCountdown,
                intensiveStudy,
                examPrepStart,
                connectedCalendars: {
                    google: googleCalendarConnected,
                    outlook: outlookCalendarConnected,
                    apple: appleCalendarConnected
                }
            },
            account: {
                twoFactorEnabled,
                twoFactorMethod,
                connectedAccounts: {
                    google: googleConnected,
                    github: githubConnected,
                    linkedin: linkedinConnected
                }
            },
            preferences: {
                showProgress,
                desktopNotifications,
                autoplayVideos,
                showSuggestions
            }
        };
        
        localStorage.setItem('userSettings', JSON.stringify(settings));
        
        // Show success message
        const successAlert = document.createElement('div');
        successAlert.className = 'fixed top-4 right-4 bg-custom bg-opacity-90 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        successAlert.textContent = 'Settings saved successfully!';
        document.body.appendChild(successAlert);
        
        // Remove alert after 3 seconds
        setTimeout(() => {
            successAlert.remove();
        }, 3000);
    });
    
    // Cancel button functionality
    const cancelButton = document.getElementById('cancelBtn');
    cancelButton.addEventListener('click', function() {
        window.location.href = "dashboard.html";
    });

    // Load saved settings on page load
    function loadSavedSettings() {
        const savedSettings = localStorage.getItem('userSettings');
        if (!savedSettings) return;
        
        const settings = JSON.parse(savedSettings);
        
        // Load profile settings
        if (settings.profile) {
            document.getElementById('firstName').value = settings.profile.firstName || '';
            document.getElementById('lastName').value = settings.profile.lastName || '';
            document.getElementById('email').value = settings.profile.email || '';
            document.getElementById('language').value = settings.profile.language || 'English';
            document.getElementById('timezone').value = settings.profile.timezone || '(GMT-08:00) Pacific Time';
            document.getElementById('bio').value = settings.profile.bio || '';
            document.getElementById('learningGoals').value = settings.profile.goals || '';
        }
        
        // Load notification settings
        if (settings.notifications) {
            document.getElementById('emailToggle').checked = settings.notifications.emailNotifications;
            document.getElementById('pushToggle').checked = settings.notifications.pushNotifications;
            document.getElementById('courseToggle').checked = settings.notifications.courseUpdates;
            document.getElementById('marketingToggle').checked = settings.notifications.marketingCommunications;
            
            // Set notification frequency
            const freqId = settings.notifications.notificationFrequency;
            if (freqId && document.getElementById(freqId)) {
                document.getElementById(freqId).checked = true;
            }
            
            // Load new notification settings
            if (document.getElementById('assignmentToggle')) {
                document.getElementById('assignmentToggle').checked = settings.notifications.assignmentNotifications;
            }
            if (document.getElementById('studyToggle')) {
                document.getElementById('studyToggle').checked = settings.notifications.studyReminders;
            }
            if (document.getElementById('examToggle')) {
                document.getElementById('examToggle').checked = settings.notifications.examAlerts;
            }
            if (document.getElementById('progressNotifToggle')) {
                document.getElementById('progressNotifToggle').checked = settings.notifications.progressNotifications;
            }
            if (document.getElementById('quiet-hours-toggle')) {
                document.getElementById('quiet-hours-toggle').checked = settings.notifications.quietHoursEnabled;
            }
            if (document.getElementById('quietHoursStart')) {
                document.getElementById('quietHoursStart').value = settings.notifications.quietHoursStart || '22:00';
            }
            if (document.getElementById('quietHoursEnd')) {
                document.getElementById('quietHoursEnd').value = settings.notifications.quietHoursEnd || '07:00';
            }
        }
        
        // Load calendar settings
        if (settings.calendar) {
            // Set calendar view
            const viewId = settings.calendar.calendarView;
            if (viewId && document.getElementById(viewId)) {
                document.getElementById(viewId).checked = true;
            }
            
            if (document.getElementById('reminderTime')) {
                document.getElementById('reminderTime').value = settings.calendar.reminderTime || '15 minutes before';
            }
            
            // Load new calendar settings
            if (document.getElementById('autoScheduleToggle')) {
                document.getElementById('autoScheduleToggle').checked = settings.calendar.autoSchedule;
            }
            if (document.getElementById('studyHoursStart')) {
                document.getElementById('studyHoursStart').value = settings.calendar.studyHoursStart || '09:00';
            }
            if (document.getElementById('studyHoursEnd')) {
                document.getElementById('studyHoursEnd').value = settings.calendar.studyHoursEnd || '18:00';
            }
            if (document.getElementById('sessionDuration')) {
                document.getElementById('sessionDuration').value = settings.calendar.sessionDuration || '45 minutes';
            }
            if (document.getElementById('breakDuration')) {
                document.getElementById('breakDuration').value = settings.calendar.breakDuration || '10 minutes';
            }
            if (document.getElementById('examCountdownToggle')) {
                document.getElementById('examCountdownToggle').checked = settings.calendar.examCountdown;
            }
            if (document.getElementById('intensiveStudyToggle')) {
                document.getElementById('intensiveStudyToggle').checked = settings.calendar.intensiveStudy;
            }
            if (document.getElementById('examPrepStart')) {
                document.getElementById('examPrepStart').value = settings.calendar.examPrepStart || '2 weeks before';
            }
        }
        
        // Load account settings
        if (settings.account) {
            // Two-factor authentication
            if (document.getElementById('twoFactorToggle')) {
                document.getElementById('twoFactorToggle').checked = settings.account.twoFactorEnabled;
                
                // Show/hide 2FA options based on toggle
                if (settings.account.twoFactorEnabled && document.getElementById('twoFactorOptions')) {
                    document.getElementById('twoFactorOptions').classList.remove('hidden');
                }
                
                // Set 2FA method
                const methodId = settings.account.twoFactorMethod;
                if (methodId && document.getElementById(methodId)) {
                    document.getElementById(methodId).checked = true;
                }
            }
        }
        
        // Load preferences
        if (settings.preferences) {
            document.getElementById('progressToggle').checked = settings.preferences.showProgress;
            document.getElementById('desktopNotifToggle').checked = settings.preferences.desktopNotifications;
            document.getElementById('autoplayToggle').checked = settings.preferences.autoplayVideos;
            document.getElementById('suggestionsToggle').checked = settings.preferences.showSuggestions;
        }
    }
    
    // Load saved settings on page load
    loadSavedSettings();
});