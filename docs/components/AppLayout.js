import Sidebar from './Sidebar.js';

const { ref, onMounted } = Vue;

export default {
  name: 'AppLayout',
  components: {
    Sidebar
  },
  props: {
    pageTitle: {
      type: String,
      required: true
    },
    currentPage: {
      type: String,
      required: true
    }
  },
  setup(props, { emit }) {
    const handleQuickAction = (action) => {
      emit('quick-action', action);
    };

    return {
      handleQuickAction
    };
  },
  template: `
    <div class="app-container">
      <Sidebar 
        :current-page="currentPage" 
        @quick-action="handleQuickAction"
      />
      
      <main class="main-content">
        <header class="page-header">
          <h1 class="page-title">{{ pageTitle }}</h1>
        </header>
        
        <div class="page-content">
          <slot></slot>
        </div>
      </main>
    </div>
  `
};