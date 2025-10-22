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
            'revoked': 'Revoked Access',
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
            // Navigate to Request Access page
            console.log('Request Access clicked');
            pageTitle.textContent = 'Request Access';
            dashboardContent.style.display = 'none';
            pageContents.forEach(content => content.style.display = 'none');
            
            const requestAccessContent = document.getElementById('requestAccessContent');
            console.log('Found requestAccessContent:', !!requestAccessContent);
            if (requestAccessContent) {
                requestAccessContent.style.display = 'block';
                console.log('Set requestAccessContent display to block');
            }
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            showNotification('Browse available institutions and request access', 'info');
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
    
    // Initialize permission cards functionality
    initializePermissionCards();
    
    // Initialize request tabs
    initializeRequestTabs();
});

// Permission Cards Functionality
function initializePermissionCards() {
    // Handle permission action buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-approve')) {
            handlePermissionAction('approve', e.target);
        } else if (e.target.classList.contains('btn-decline')) {
            handlePermissionAction('decline', e.target);
        } else if (e.target.classList.contains('btn-manage')) {
            handlePermissionAction('manage', e.target);
        } else if (e.target.classList.contains('btn-revoke')) {
            handlePermissionAction('revoke', e.target);
        } else if (e.target.classList.contains('btn-renew')) {
            handlePermissionAction('renew', e.target);
        } else if (e.target.classList.contains('menu-btn')) {
            handleMenuClick(e.target);
        } else if (e.target.classList.contains('btn-review')) {
            handleRevokedAction('review', e.target);
        } else if (e.target.classList.contains('btn-allow')) {
            handleRevokedAction('allow', e.target);
        } else if (e.target.classList.contains('btn-restore')) {
            handleRevokedAction('restore', e.target);
        } else if (e.target.classList.contains('btn-block')) {
            handleRevokedAction('block', e.target);
        } else if (e.target.classList.contains('btn-delete')) {
            handleRevokedAction('delete', e.target);
        } else if (e.target.classList.contains('btn-unblock')) {
            handleRevokedAction('unblock', e.target);
        }
    });
    
    // Add animation to permission cards
    const permissionCards = document.querySelectorAll('.permission-card');
    permissionCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function handlePermissionAction(action, button) {
    const card = button.closest('.permission-card');
    const institutionName = card.querySelector('.institution-details h3').textContent;
    
    switch (action) {
        case 'approve':
            if (confirm(`Grant access to ${institutionName}?`)) {
                showNotification(`Access granted to ${institutionName}`, 'success');
                // Update card to active state
                card.classList.add('active');
                const header = card.querySelector('.permission-header');
                const actionsDiv = card.querySelector('.permission-actions');
                
                // Replace menu button with status
                const menuDiv = header.querySelector('.permission-menu');
                if (menuDiv) {
                    menuDiv.innerHTML = '<div class="permission-status active">Active</div>';
                }
                
                // Update action buttons
                actionsDiv.innerHTML = `
                    <button class="btn-manage">Manage Access</button>
                    <button class="btn-revoke">Revoke</button>
                `;
            }
            break;
            
        case 'decline':
            if (confirm(`Decline access request from ${institutionName}?`)) {
                showNotification(`Access request declined for ${institutionName}`, 'warning');
                // Remove the card with animation
                card.style.transform = 'translateX(-100%)';
                card.style.opacity = '0';
                setTimeout(() => {
                    card.remove();
                }, 300);
            }
            break;
            
        case 'manage':
            showNotification(`Opening permission management for ${institutionName}`, 'info');
            break;
            
        case 'revoke':
            if (confirm(`Are you sure you want to revoke access for ${institutionName}? This action cannot be undone.`)) {
                showNotification(`Access revoked for ${institutionName}`, 'warning');
                // Remove active class and update UI
                card.classList.remove('active');
                card.style.transform = 'translateX(-100%)';
                card.style.opacity = '0';
                setTimeout(() => {
                    card.remove();
                }, 300);
            }
            break;
            
        case 'renew':
            if (confirm(`Renew access for ${institutionName} for another year?`)) {
                showNotification(`Access renewed for ${institutionName}`, 'success');
                // Update status and duration
                const statusElement = card.querySelector('.permission-status');
                if (statusElement) {
                    statusElement.className = 'permission-status active';
                    statusElement.textContent = 'Active';
                }
                
                // Update duration (add one year)
                const durationElement = card.querySelector('.permission-duration span');
                if (durationElement) {
                    const currentDate = new Date();
                    const nextYear = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate());
                    const formattedDate = nextYear.toLocaleDateString('de-DE');
                    durationElement.textContent = `${new Date().toLocaleDateString('de-DE')} - ${formattedDate}`;
                }
                
                // Update action buttons
                const actionsDiv = card.querySelector('.permission-actions');
                actionsDiv.innerHTML = `
                    <button class="btn-manage">Manage Access</button>
                    <button class="btn-revoke">Revoke</button>
                `;
            }
            break;
    }
}

function handleRevokedAction(action, button) {
    const card = button.closest('.permission-card');
    const institutionName = card.querySelector('.institution-details h3').textContent;
    
    switch (action) {
        case 'review':
            showNotification(`Opening detailed review for ${institutionName}`, 'info');
            break;
            
        case 'allow':
            if (confirm(`Allow the request from ${institutionName}? This will grant them the requested permissions.`)) {
                showNotification(`Request approved for ${institutionName}`, 'success');
                // Remove the card and potentially move to active permissions
                card.style.transform = 'translateX(100%)';
                card.style.opacity = '0';
                setTimeout(() => {
                    card.remove();
                }, 300);
            }
            break;
            
        case 'restore':
            if (confirm(`Restore access for ${institutionName}? This will reactivate their permissions.`)) {
                showNotification(`Access restored for ${institutionName}`, 'success');
                // Remove the card from revoked list
                card.style.transform = 'translateX(100%)';
                card.style.opacity = '0';
                setTimeout(() => {
                    card.remove();
                }, 300);
            }
            break;
            
        case 'block':
            if (confirm(`Permanently block ${institutionName}? They will not be able to request access again.`)) {
                showNotification(`${institutionName} has been permanently blocked`, 'warning');
                // Update card to show blocked status
                const statusElement = card.querySelector('.revoked-status');
                statusElement.className = 'revoked-status blocked';
                statusElement.textContent = 'Blocked';
                statusElement.style.background = '#343a40';
                statusElement.style.color = 'white';
                
                // Update action buttons
                const actionsDiv = card.querySelector('.permission-actions');
                actionsDiv.innerHTML = `
                    <button class="btn-review">View History</button>
                    <button class="btn-unblock">Unblock</button>
                `;
            }
            break;
            
        case 'delete':
            if (confirm(`Permanently delete the record for ${institutionName}? This action cannot be undone.`)) {
                showNotification(`Record deleted for ${institutionName}`, 'warning');
                card.style.transform = 'scale(0)';
                card.style.opacity = '0';
                setTimeout(() => {
                    card.remove();
                }, 300);
            }
            break;
            
        case 'unblock':
            if (confirm(`Unblock ${institutionName}? They will be able to request access again.`)) {
                showNotification(`${institutionName} has been unblocked`, 'success');
                // Update card back to denied status
                const statusElement = card.querySelector('.revoked-status');
                statusElement.className = 'revoked-status denied';
                statusElement.textContent = 'Denied';
                statusElement.style.background = '#f5c6cb';
                statusElement.style.color = '#721c24';
                
                // Update action buttons
                const actionsDiv = card.querySelector('.permission-actions');
                actionsDiv.innerHTML = `
                    <button class="btn-review">Review Decision</button>
                    <button class="btn-allow">Allow Request</button>
                `;
            }
            break;
    }
}

function handleMenuClick(button) {
    // Create a simple dropdown menu
    const existingMenu = document.querySelector('.permission-dropdown');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }
    
    const dropdown = document.createElement('div');
    dropdown.className = 'permission-dropdown';
    dropdown.innerHTML = `
        <div class="dropdown-item" data-action="details">View Details</div>
        <div class="dropdown-item" data-action="history">View History</div>
        <div class="dropdown-item" data-action="notifications">Notification Settings</div>
    `;
    
    // Position dropdown
    const rect = button.getBoundingClientRect();
    dropdown.style.position = 'fixed';
    dropdown.style.top = `${rect.bottom + 5}px`;
    dropdown.style.right = `${window.innerWidth - rect.right}px`;
    dropdown.style.zIndex = '1000';
    dropdown.style.background = 'white';
    dropdown.style.border = '1px solid #e9ecef';
    dropdown.style.borderRadius = '8px';
    dropdown.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    dropdown.style.minWidth = '150px';
    
    document.body.appendChild(dropdown);
    
    // Handle dropdown clicks
    dropdown.addEventListener('click', (e) => {
        const action = e.target.getAttribute('data-action');
        if (action) {
            showNotification(`${e.target.textContent} feature would open here`, 'info');
            dropdown.remove();
        }
    });
    
    // Close dropdown when clicking outside
    setTimeout(() => {
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && e.target !== button) {
                dropdown.remove();
            }
        }, { once: true });
    }, 10);
}

// Add dropdown styles
const dropdownStyles = document.createElement('style');
dropdownStyles.textContent = `
    .permission-dropdown {
        animation: fadeIn 0.2s ease;
    }
    
    .dropdown-item {
        padding: 10px 15px;
        cursor: pointer;
        font-size: 0.9rem;
        color: #333;
        border-bottom: 1px solid #f1f3f4;
    }
    
    .dropdown-item:last-child {
        border-bottom: none;
    }
    
    .dropdown-item:hover {
        background: #f8f9fa;
    }
`;
document.head.appendChild(dropdownStyles);

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

// Request Tabs Functionality
function initializeRequestTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => {
                content.classList.remove('active');
                content.style.display = 'none';
            });
            
            // Add active class to clicked tab
            button.classList.add('active');
            
            // Show corresponding content
            const targetContent = document.getElementById(`${targetTab}-tab`);
            console.log('Looking for tab:', `${targetTab}-tab`, 'Found:', targetContent);
            if (targetContent) {
                targetContent.classList.add('active');
                targetContent.style.display = 'block';
                console.log('Showing tab content for:', targetTab);
                
                // Add animation
                targetContent.style.opacity = '0';
                targetContent.style.transform = 'translateY(10px)';
                
                setTimeout(() => {
                    targetContent.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                    targetContent.style.opacity = '1';
                    targetContent.style.transform = 'translateY(0)';
                }, 50);
            }
        });
    });
}

// Request Info Modal Functionality
function showRequestInfo(requestType) {
    const modal = document.getElementById('infoModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    const requestData = {
        drv: {
            title: "Deutsche Rentenversicherung",
            company: "German Pension Insurance",
            verification: "Verified Government Entity",
            purpose: "Pension Calculation & Management",
            dataAccess: [
                "Investment portfolio overview",
                "Account balance information", 
                "Transaction history (last 12 months)",
                "Personal identification data"
            ],
            securityLevel: "High - Government Entity",
            duration: "1 Year",
            autoRenewal: "Manual approval required",
            riskLevel: "Low",
            description: "The German Pension Insurance requires access to your investment portfolio to accurately calculate your future pension benefits. This is a legitimate government request required for pension planning.",
            moreInfoLink: "https://www.deutsche-rentenversicherung.de/DRV/DE/Home/home_node.html",
            moreInfoText: "Visit the official Deutsche Rentenversicherung website"
        },
        investment: {
            title: "Investment Advisor Pro",
            company: "FinTech Solutions GmbH",
            verification: "Licensed Investment Advisor",
            purpose: "Portfolio Analysis & Investment Recommendations",
            dataAccess: [
                "Portfolio performance metrics",
                "Investment allocation data",
                "Historical transaction data",
                "Risk tolerance profile"
            ],
            securityLevel: "Medium - Licensed Provider",
            duration: "1 Year",
            autoRenewal: "Automatic with 30-day notice",
            riskLevel: "Medium",
            description: "Investment Advisor Pro is a licensed financial advisor that provides personalized investment recommendations based on your portfolio performance and risk profile. They are regulated by BaFin.",
            moreInfoLink: "https://www.bafin.de/EN/Homepage/homepage_node.html",
            moreInfoText: "Learn more about BaFin regulation and licensed advisors"
        },
        crypto: {
            title: "Crypto Portfolio Tracker",
            company: "CryptoAnalytics Ltd",
            verification: "Verified Cryptocurrency Service",
            purpose: "Cryptocurrency Portfolio Management",
            dataAccess: [
                "Cryptocurrency transaction history",
                "Digital wallet balances",
                "Trading activity data",
                "Portfolio allocation metrics"
            ],
            securityLevel: "Medium - Verified Service",
            duration: "6 Months",
            autoRenewal: "Manual approval required",
            riskLevel: "Medium",
            description: "Crypto Portfolio Tracker helps you monitor and analyze your cryptocurrency investments across multiple wallets and exchanges. They provide comprehensive portfolio analytics and tax reporting.",
            moreInfoLink: "https://help.eurovia-bank.com/crypto-services",
            moreInfoText: "View our approved cryptocurrency service providers"
        },
        quickrich: {
            title: "QuickRich Investment",
            company: "Unknown Entity",
            verification: "⚠️ UNVERIFIED - POTENTIAL SCAM",
            purpose: "Suspicious Financial Services",
            dataAccess: [
                "Complete financial profile",
                "Investment history and holdings",
                "Personal identification data",
                "Account access credentials"
            ],
            securityLevel: "🚨 CRITICAL RISK - UNVERIFIED",
            duration: "Indefinite",
            autoRenewal: "Unknown terms",
            riskLevel: "🚨 EXTREME RISK",
            description: "⚠️ WARNING: QuickRich Investment is an unverified entity requesting extensive access to your financial data. This appears to be a fraudulent investment scheme. DO NOT APPROVE this request.",
            moreInfoLink: "https://help.eurovia-bank.com/security/fraud-prevention",
            moreInfoText: "Learn how to protect yourself from financial fraud"
        }
    };
    
    const data = requestData[requestType];
    if (!data) return;
    
    modalTitle.textContent = data.title;
    
    const isSpam = requestType === 'quickrich';
    const warningClass = isSpam ? 'danger' : '';
    
    modalBody.innerHTML = `
        <div class="info-section">
            <h4>Company Information</h4>
            <ul class="info-list">
                <li><strong>Organization:</strong> <span>${data.company}</span></li>
                <li><strong>Verification Status:</strong> <span>${data.verification}</span></li>
                <li><strong>Security Level:</strong> <span>${data.securityLevel}</span></li>
            </ul>
        </div>
        
        <div class="info-section">
            <h4>Request Details</h4>
            <ul class="info-list">
                <li><strong>Purpose:</strong> <span>${data.purpose}</span></li>
                <li><strong>Access Duration:</strong> <span>${data.duration}</span></li>
                <li><strong>Auto-Renewal:</strong> <span>${data.autoRenewal}</span></li>
                <li><strong>Risk Level:</strong> <span>${data.riskLevel}</span></li>
            </ul>
        </div>
        
        <div class="info-section">
            <h4>Data Access Requested</h4>
            <ul class="info-list">
                ${data.dataAccess.map(item => `<li>• ${item}</li>`).join('')}
            </ul>
        </div>
        
        <div class="security-warning ${warningClass}">
            <strong>${isSpam ? '🚨 SECURITY ALERT' : 'ℹ️ Information'}:</strong><br>
            ${data.description}
        </div>
        
        <div class="more-info-section">
            <p><strong>For more information:</strong></p>
            <a href="${data.moreInfoLink}" target="_blank" class="more-info-link">
                <i class="fas fa-external-link-alt"></i>
                ${data.moreInfoText}
            </a>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('infoModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('infoModal');
    if (event.target === modal) {
        closeModal();
    }
}

// Request Access functionality
function requestAccess(institutionId) {
    const institutions = {
        'paymentapp': 'PaymentApp Pro',
        'budgettracker': 'BudgetTracker',
        'expensemanager': 'ExpenseManager',
        'investmenttracker': 'InvestmentTracker',
        'taxhelper': 'TaxHelper',
        'creditmonitor': 'CreditMonitor'
    };
    
    const institutionName = institutions[institutionId];
    
    if (confirm(`Do you want to request additional permissions from ${institutionName}?`)) {
        showNotification(`Access request sent to ${institutionName}`, 'success');
        
        // Simulate updating the UI after a delay
        setTimeout(() => {
            showNotification(`${institutionName} will review your request within 24 hours`, 'info');
        }, 2000);
    }
}

console.log('Eurovia Banking Dashboard loaded successfully!');