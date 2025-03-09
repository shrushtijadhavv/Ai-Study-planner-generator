document.addEventListener('DOMContentLoaded', function() {
    // Load user name from localStorage
    const firstName = localStorage.getItem('firstName');
    if (firstName) {
        document.getElementById('welcome-message').textContent = `Welcome back, ${firstName}!`;
    }

    // User menu toggle
    const userMenuButton = document.getElementById('user-menu-button');
    const userMenu = document.getElementById('user-menu');
    
    userMenuButton.addEventListener('click', function() {
        userMenu.classList.toggle('hidden');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!userMenuButton.contains(event.target) && !userMenu.contains(event.target)) {
            userMenu.classList.add('hidden');
        }
    });

    // Mark complete buttons
    const completeButtons = document.querySelectorAll('.text-xs.px-2.py-1.rounded-full.bg-custom');
    completeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const taskElement = this.closest('.bg-gray-700');
            taskElement.style.opacity = '0.5';
            this.textContent = 'Completed';
            this.disabled = true;
        });
    });

    // Study Progress Chart
    const ctx = document.getElementById('studyProgressChart').getContext('2d');
    let studyProgressChart;
    
    // Weekly data
    const weeklyData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Study Hours',
            data: [2.5, 3.2, 1.8, 4.0, 3.5, 2.0, 3.7],
            backgroundColor: 'rgba(22, 188, 136, 0.2)',
            borderColor: 'rgba(22, 188, 136, 1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true
        }]
    };
    
    // Monthly data
    const monthlyData = {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [{
            label: 'Study Hours',
            data: [15.5, 18.2, 20.8, 17.5],
            backgroundColor: 'rgba(22, 188, 136, 0.2)',
            borderColor: 'rgba(22, 188, 136, 1)',
            borderWidth: 2,
            tension: 0.4,
            fill: true
        }]
    };
    
    // Chart configuration
    const chartConfig = {
        type: 'line',
        data: weeklyData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.7)'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    };
    
    // Initialize chart with weekly data
    studyProgressChart = new Chart(ctx, chartConfig);
    
    // Toggle between weekly and monthly views
    const weeklyViewBtn = document.getElementById('weekly-view-btn');
    const monthlyViewBtn = document.getElementById('monthly-view-btn');
    
    weeklyViewBtn.addEventListener('click', function() {
        weeklyViewBtn.classList.remove('bg-gray-700', 'text-gray-300');
        weeklyViewBtn.classList.add('bg-custom', 'text-white');
        monthlyViewBtn.classList.remove('bg-custom', 'text-white');
        monthlyViewBtn.classList.add('bg-gray-700', 'text-gray-300');
        
        document.querySelector('.text-lg.font-semibold.text-white').textContent = 'Weekly Study Progress';
        
        studyProgressChart.data = weeklyData;
        studyProgressChart.update();
    });
    
    monthlyViewBtn.addEventListener('click', function() {
        monthlyViewBtn.classList.remove('bg-gray-700', 'text-gray-300');
        monthlyViewBtn.classList.add('bg-custom', 'text-white');
        weeklyViewBtn.classList.remove('bg-custom', 'text-white');
        weeklyViewBtn.classList.add('bg-gray-700', 'text-gray-300');
        
        document.querySelector('.text-lg.font-semibold.text-white').textContent = 'Monthly Study Progress';
        
        studyProgressChart.data = monthlyData;
        studyProgressChart.update();
    });

    // Resource links
    const resourceLinks = document.querySelectorAll('a[href="#"]');
    resourceLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            alert('This resource will be available soon!');
        });
    });
});