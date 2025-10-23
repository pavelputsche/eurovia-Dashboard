const { ref, onMounted } = Vue;

export default {
  name: 'Sidebar',
  props: {
    currentPage: {
      type: String,
      default: 'dashboard'
    }
  },
  setup(props, { emit }) {
    const sidebarCollapsed = ref(false);
    const mobileMenuOpen = ref(false);

    const menuItems = ref([
      { id: 'dashboard', title: 'Dashboard', icon: 'fas fa-tachometer-alt', href: 'dashboard.html' },
      { id: 'permissions', title: 'My Permissions', icon: 'fas fa-key', href: 'permissions.html' },
      { id: 'requests', title: 'Access Requests', icon: 'fas fa-inbox', href: 'requests.html' },
      { id: 'revoked', title: 'Revoked Access', icon: 'fas fa-ban', href: 'revoked.html' },
      { id: 'apps', title: 'Connected Apps', icon: 'fas fa-puzzle-piece', href: 'apps.html' },
      { id: 'activity', title: 'Activity Log', icon: 'fas fa-history', href: 'activity.html' },
      { id: 'settings', title: 'Settings', icon: 'fas fa-cog', href: 'settings.html' }
    ]);

    const quickActions = ref([
      { action: 'request-access', title: 'Request Access', icon: 'fas fa-plus-circle', href: 'request-access.html' },
      { action: 'renew-permissions', title: 'Renew Permissions', icon: 'fas fa-sync-alt', href: 'renew-permissions.html' },
      { action: 'revoke-access', title: 'Revoke Access', icon: 'fas fa-times-circle', handler: 'handleRevokeAccess' },
      { action: 'view-details', title: 'View Details', icon: 'fas fa-info-circle', handler: 'handleViewDetails' }
    ]);

    const toggleSidebar = () => {
      sidebarCollapsed.value = !sidebarCollapsed.value;
    };

    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value;
    };

    const handleQuickAction = (action, href, handler) => {
      if (href) {
        window.location.href = href;
      } else if (handler) {
        emit('quick-action', action);
      }
    };

    const showNotification = (message, type = 'info') => {
      // Create notification element
      const notification = document.createElement('div');
      notification.className = `notification notification-${type}`;
      notification.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : type === 'error' ? 'times-circle' : 'info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close" onclick="this.parentElement.remove()">
          <i class="fas fa-times"></i>
        </button>
      `;
      
      // Add styles
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
      
      // Auto remove after 5 seconds
      setTimeout(() => {
        if (notification.parentElement) {
          notification.remove();
        }
      }, 5000);
    };

    const handleRevokeAccess = () => {
      if (confirm('Are you sure you want to revoke access? This action cannot be undone.')) {
        showNotification('Access revoked successfully', 'warning');
      }
    };

    const handleViewDetails = () => {
      showNotification('Permission details would be displayed here', 'info');
    };

    onMounted(() => {
      // Add notification styles to head if not already added
      if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
          @keyframes slideIn {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          .notification-close {
            background: none;
            border: none;
            cursor: pointer;
            color: inherit;
            opacity: 0.7;
            transition: opacity 0.2s;
          }
          .notification-close:hover {
            opacity: 1;
          }
        `;
        document.head.appendChild(style);
      }
    });

    return {
      sidebarCollapsed,
      mobileMenuOpen,
      menuItems,
      quickActions,
      toggleSidebar,
      toggleMobileMenu,
      handleQuickAction,
      handleRevokeAccess,
      handleViewDetails
    };
  },
  template: `
    <div class="sidebar" :class="{ 'collapsed': sidebarCollapsed, 'mobile-open': mobileMenuOpen }">
      <!-- Mobile header -->
      <div class="mobile-header">
        <div class="logo">
          <i class="fas fa-university"></i>
          <span>Eurovia</span>
        </div>
        <button class="mobile-menu-btn" @click="toggleMobileMenu">
          <i class="fas fa-bars"></i>
        </button>
      </div>

      <!-- Sidebar toggle button -->
      <button class="sidebar-toggle" @click="toggleSidebar">
        <i class="fas fa-chevron-left" :class="{ 'rotated': sidebarCollapsed }"></i>
      </button>

      <!-- Logo -->
      <div class="logo" v-show="!sidebarCollapsed">
        <i class="fas fa-university"></i>
        <span>Eurovia</span>
      </div>

      <!-- Quick Actions -->
      <div class="sidebar-section">
        <h3 class="section-title" v-show="!sidebarCollapsed">Quick Actions</h3>
        <div class="quick-actions">
          <button 
            v-for="action in quickActions" 
            :key="action.action"
            class="quick-action-btn" 
            @click="handleQuickAction(action.action, action.href, action.handler)"
            :title="sidebarCollapsed ? action.title : ''"
          >
            <i :class="action.icon"></i>
            <span v-show="!sidebarCollapsed">{{ action.title }}</span>
          </button>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="sidebar-nav">
        <h3 class="section-title" v-show="!sidebarCollapsed">Navigation</h3>
        <ul class="nav-menu">
          <li v-for="item in menuItems" :key="item.id">
            <a 
              :href="item.href" 
              class="nav-item" 
              :class="{ 'active': currentPage === item.id }"
              :title="sidebarCollapsed ? item.title : ''"
            >
              <i :class="item.icon"></i>
              <span v-show="!sidebarCollapsed">{{ item.title }}</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  `
};