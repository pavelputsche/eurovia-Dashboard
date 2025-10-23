// Common utilities and functions
export const utils = {
  // Show notification
  showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
      <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i>
      <span>${message}</span>
      <button class="notification-close" onclick="this.parentElement.remove()">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: ${type === 'success' ? '#d4edda' : type === 'warning' ? '#fff3cd' : type === 'error' ? '#f8d7da' : '#d1ecf1'};
      color: ${type === 'success' ? '#155724' : type === 'warning' ? '#856404' : type === 'error' ? '#721c24' : '#0c5460'};
      border: 1px solid ${type === 'success' ? '#c3e6cb' : type === 'warning' ? '#ffeaa7' : type === 'error' ? '#f5c6cb' : '#bee5eb'};
      border-radius: 8px;
      padding: 15px 20px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      z-index: 10000;
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 300px;
      animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
      if (notification.parentElement) {
        notification.remove();
      }
    }, 5000);
  },

  // Format date
  formatDate(date) {
    return new Date(date).toLocaleDateString('de-DE');
  },

  // Format time ago
  formatTimeAgo(date) {
    const now = new Date();
    const diffMs = now - new Date(date);
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
  }
};

// Common data
export const mockData = {
  permissions: [
    {
      id: 1,
      appName: 'BudgetTracker',
      icon: 'fas fa-calculator',
      status: 'Active',
      permissions: ['View account balance', 'Transaction history'],
      grantedDate: '2024-01-15',
      expiryDate: '2025-01-15',
      isExpiring: false
    },
    {
      id: 2,
      appName: 'PaymentApp Pro',
      icon: 'fas fa-credit-card',
      status: 'Active',
      permissions: ['Make payments', 'View transactions'],
      grantedDate: '2024-03-10',
      expiryDate: '2025-03-10',
      isExpiring: false
    },
    {
      id: 3,
      appName: 'Insurance Portal',
      icon: 'fas fa-shield-alt',
      status: 'Expiring Soon',
      permissions: ['Personal information', 'Policy documents'],
      grantedDate: '2024-05-20',
      expiryDate: '2025-01-28',
      isExpiring: true
    },
    {
      id: 4,
      appName: 'Investment Tracker',
      icon: 'fas fa-chart-line',
      status: 'Expiring Soon',
      permissions: ['Portfolio data', 'Investment history'],
      grantedDate: '2024-02-28',
      expiryDate: '2025-01-30',
      isExpiring: true
    }
  ],

  institutions: [
    {
      id: 1,
      name: 'PaymentApp Pro',
      icon: 'PAY',
      color: '#28a745',
      verified: true,
      description: 'Secure payment processing and transaction management',
      permissions: ['Make payments', 'View transaction history', 'Manage payment methods']
    },
    {
      id: 2,
      name: 'BudgetTracker',
      icon: 'BT',
      color: '#007bff',
      verified: true,
      description: 'Personal finance management and budget tracking',
      permissions: ['View account balance', 'Categorize expenses', 'Budget analysis']
    },
    {
      id: 3,
      name: 'Insurance Portal',
      icon: 'IP',
      color: '#6f42c1',
      verified: true,
      description: 'Insurance policy management and claims processing',
      permissions: ['View policy details', 'Submit claims', 'Access documents']
    }
  ],

  requests: [
    {
      id: 1,
      appName: 'CryptoWallet',
      icon: 'fas fa-bitcoin',
      requestDate: '2024-10-20',
      status: 'Pending',
      permissions: ['View wallet balance', 'Transaction history'],
      verified: false
    },
    {
      id: 2,
      appName: 'TaxHelper',
      icon: 'fas fa-file-invoice-dollar',
      requestDate: '2024-10-19',
      status: 'Pending',
      permissions: ['Access tax documents', 'Calculate deductions'],
      verified: true
    }
  ]
};