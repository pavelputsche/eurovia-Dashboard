// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const sidebar = document.querySelector('.sidebar');
const navItems = document.querySelectorAll('.nav-item');
const quickActionBtns = document.querySelectorAll('.quick-action-btn');
const pageTitle = document.querySelector('.page-title');
const dashboardContent = document.getElementById('dashboardContent');
const pageContents = document.querySelectorAll('.page-content');

// Mobile menu toggle
menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    }
});

// Navigation functionality
navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Remove active class from all nav items
        navItems.forEach(nav => nav.classList.remove('active'));
        
        // Add active class to clicked item
        item.classList.add('active');
        
        // Get the page data attribute
        const page = item.getAttribute('data-page');
        
        // Update page title
        const pageTitles = {
            'dashboard': 'Dashboard',
            'permissions': 'My Permissions',
            'requests': 'Access Requests',
            'apps': 'Connected Apps',
            'activity': 'Activity Log',
            'settings': 'Settings'
        };
        
        pageTitle.textContent = pageTitles[page] || 'Dashboard';
        
        // Show/hide content based on selected page
        if (page === 'dashboard') {
            dashboardContent.style.display = 'flex';
            pageContents.forEach(content => content.style.display = 'none');
        } else {
            dashboardContent.style.display = 'none';
            pageContents.forEach(content => content.style.display = 'none');
            
            const targetContent = document.getElementById(`${page}Content`);
            if (targetContent) {
                targetContent.style.display = 'block';
            }
        }
        
        // Close sidebar on mobile after navigation
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
        }
        
        // Add animation to content
        const activeContent = page === 'dashboard' ? dashboardContent : document.getElementById(`${page}Content`);
        if (activeContent) {
            activeContent.style.opacity = '0';
            activeContent.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                activeContent.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                activeContent.style.opacity = '1';
                activeContent.style.transform = 'translateY(0)';
            }, 50);
        }
    });
});

// Quick Action buttons functionality
quickActionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const action = btn.getAttribute('data-action');
        handleQuickAction(action);
    });
});

// Quick Action handlers
function handleQuickAction(action) {
    const actions = {
        'request-access': () => {
            showNotification('Request Access form would open here', 'info');
        },
        'renew-permissions': () => {
            showNotification('Renewing permissions...', 'success');
            // Simulate API call
            setTimeout(() => {
                showNotification('Permissions renewed successfully', 'success');
            }, 2000);
        },
        'revoke-access': () => {
            if (confirm('Are you sure you want to revoke access? This action cannot be undone.')) {
                showNotification('Access revoked successfully', 'warning');
            }
        },
        'view-details': () => {
            showNotification('Permission details would be displayed here', 'info');
        }
    };
    
    if (actions[action]) {
        actions[action]();
    }
}

// Action button handlers
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('action-btn')) {
        const btnText = e.target.textContent.trim();
        
        switch (btnText) {
            case 'New Request':
                showNotification('New access request form would open here', 'info');
                break;
            case 'Renew All':
                if (confirm('Renew all expiring permissions?')) {
                    showNotification('Renewing all permissions...', 'info');
                    setTimeout(() => {
                        showNotification('All permissions renewed successfully', 'success');
                    }, 2000);
                }
                break;
            case 'Revoke Access':
                if (confirm('Are you sure you want to revoke access?')) {
                    showNotification('Access revoked', 'warning');
                }
                break;
        }
    }
});

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        min-width: 300px;
    `;
    
    // Add notification to DOM
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
        if (document.body.contains(notification)) {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        'info': 'fa-info-circle',
        'success': 'fa-check-circle',
        'warning': 'fa-exclamation-triangle',
        'error': 'fa-times-circle'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        'info': '#17a2b8',
        'success': '#28a745',
        'warning': '#ffc107',
        'error': '#dc3545'
    };
    return colors[type] || colors.info;
}

// Add styles for notification content
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: auto;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .notification-close:hover {
        opacity: 0.8;
    }
`;
document.head.appendChild(notificationStyles);

// Simulate real-time updates
function simulateRealTimeUpdates() {
    // Update stats every 30 seconds
    setInterval(() => {
        const statNumbers = document.querySelectorAll('.stat-number');
        statNumbers.forEach(stat => {
            const currentValue = parseInt(stat.textContent);
            const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
            const newValue = Math.max(0, currentValue + change);
            
            if (newValue !== currentValue) {
                stat.style.transform = 'scale(1.1)';
                stat.textContent = newValue;
                
                setTimeout(() => {
                    stat.style.transform = 'scale(1)';
                }, 200);
            }
        });
    }, 30000);
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Add loading animation to tiles
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach((tile, index) => {
        tile.style.opacity = '0';
        tile.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            tile.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            tile.style.opacity = '1';
            tile.style.transform = 'translateY(0)';
        }, index * 100);
    });
    
    // Start real-time updates simulation
    simulateRealTimeUpdates();
    
    // Add click animations to interactive elements
    const interactiveElements = document.querySelectorAll('.permission-item, .third-party-item');
    interactiveElements.forEach(element => {
        element.addEventListener('click', () => {
            element.style.transform = 'scale(0.98)';
            setTimeout(() => {
                element.style.transform = 'scale(1)';
            }, 150);
        });
    });
});

// Handle window resize
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        sidebar.classList.remove('active');
    }
});

// Add smooth scrolling for better UX
document.documentElement.style.scrollBehavior = 'smooth';

// Keyboard navigation support
document.addEventListener('keydown', (e) => {
    // ESC key to close sidebar on mobile
    if (e.key === 'Escape' && window.innerWidth <= 768) {
        sidebar.classList.remove('active');
    }
    
    // Alt + number keys for quick navigation
    if (e.altKey && !isNaN(e.key) && e.key >= 1 && e.key <= 6) {
        e.preventDefault();
        const navItem = navItems[parseInt(e.key) - 1];
        if (navItem) {
            navItem.click();
        }
    }
});

// Performance optimization: debounce resize events
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Handle resize logic here if needed
    }, 250);
});

console.log('Eurovia Banking Dashboard loaded successfully!');