document.addEventListener('DOMContentLoaded', () => {
  
  // --- DOM Elements ---
  const tabButtons = document.querySelectorAll('.service-tab-btn');
  const servicePanels = document.querySelectorAll('.service-panel');
  const inquiryForm = document.getElementById('inquiry-form');
  const submitButton = document.getElementById('btn-submit-form');
  const toastContainer = document.getElementById('toast-container-box');
  const panelCtaButtons = document.querySelectorAll('.btn-panel-cta');
  const contactServiceSelect = document.getElementById('contact-service');

  // --- Reusable Toast Notification System ---
  const showToast = (message, isSuccess = true) => {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = 'toast';
    if (!isSuccess) {
      toast.style.borderColor = '#EF4444'; // Red border for error
    }
    
    // Icon selection
    const iconSvg = isSuccess 
      ? `<svg viewBox="0 0 24 24" width="20" height="20">
          <polyline points="20 6 9 17 4 12" fill="none" stroke="#C79A3B" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
         </svg>`
      : `<svg viewBox="0 0 24 24" width="20" height="20">
          <circle cx="12" cy="12" r="10" fill="none" stroke="#EF4444" stroke-width="2.5"/>
          <line x1="12" y1="8" x2="12" y2="12" stroke="#EF4444" stroke-width="2.5" stroke-linecap="round"/>
          <line x1="12" y1="16" x2="12.01" y2="16" stroke="#EF4444" stroke-width="3" stroke-linecap="round"/>
         </svg>`;

    toast.innerHTML = `
      ${iconSvg}
      <span>${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Micro-delay for slide-in animation
    setTimeout(() => {
      toast.classList.add('show');
    }, 10);

    // Auto fadeout and destroy
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 400);
    }, 3200);
  };

  // --- Interactive Tabs Logic ---
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.getAttribute('data-target');
      switchServiceTab(targetId);
    });
  });

  const switchServiceTab = (targetId) => {
    // Deactivate all buttons
    tabButtons.forEach(btn => {
      btn.classList.remove('active');
      btn.setAttribute('aria-selected', 'false');
    });

    // Deactivate all panels
    servicePanels.forEach(panel => {
      panel.classList.remove('active');
    });

    // Activate the selected button and its matching panel
    const activeBtn = document.querySelector(`.service-tab-btn[data-target="${targetId}"]`);
    const activePanel = document.getElementById(`panel-${targetId}`);

    if (activeBtn && activePanel) {
      activeBtn.classList.add('active');
      activeBtn.setAttribute('aria-selected', 'true');
      activePanel.classList.add('active');
    }
  };

  // Global function exposed to window so that footer links can activate tabs
  window.activateServiceTab = (targetId) => {
    switchServiceTab(targetId);
    
    // Smooth scroll to services container
    const servicesSection = document.getElementById('servicos');
    if (servicesSection) {
      servicesSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // --- CTA Click-to-Form Auto Select ---
  panelCtaButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const serviceName = button.getAttribute('data-service');
      
      // Auto-select the option in the form dropdown
      if (contactServiceSelect && serviceName) {
        contactServiceSelect.value = serviceName;
      }
      
      // Smooth scroll to contact form section
      const contactSection = document.getElementById('contato');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      }
      
      // Show micro-notification to highlight auto-selection
      setTimeout(() => {
        showToast(`Serviço "${serviceName}" selecionado no formulário!`);
      }, 800);
    });
  });

  // --- Inquiry Form Submission & Validation ---
  if (inquiryForm) {
    inquiryForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Fetch input fields for validation checking
      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const serviceSelect = document.getElementById('contact-service');
      const messageInput = document.getElementById('contact-message');

      // Simple validation checks
      if (!nameInput.value.trim()) {
        showToast('Por favor, informe o seu nome.', false);
        nameInput.focus();
        return;
      }

      if (!emailInput.value.trim() || !validateEmail(emailInput.value)) {
        showToast('Por favor, insira um e-mail corporativo válido.', false);
        emailInput.focus();
        return;
      }

      if (!serviceSelect.value) {
        showToast('Por favor, selecione um serviço de interesse.', false);
        serviceSelect.focus();
        return;
      }

      if (!messageInput.value.trim()) {
        showToast('Por favor, descreva brevemente seu projeto ou desafio.', false);
        messageInput.focus();
        return;
      }

      // If all valid, simulate sending state
      submitButton.classList.add('loading');
      submitButton.disabled = true;

      // Simulate network request latency (1.5 seconds)
      setTimeout(() => {
        // Reset button state
        submitButton.classList.remove('loading');
        submitButton.disabled = false;

        // Display Success Toast
        showToast(`Obrigado, ${nameInput.value.split(' ')[0]}! Solicitação de diagnóstico enviada com sucesso.`);
        
        // Reset form
        inquiryForm.reset();
      }, 1500);
    });
  }

  // Email helper validator regex
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  // --- Scroll Reveal Animation ---
  // We use IntersectionObserver for premium performance scroll entrance animations
  const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
  };

  const revealCallback = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        observer.unobserve(entry.target); // Stop observing once animate is triggered
      }
    });
  };

  const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

  // Select all premium cards and blocks to animate
  const elementsToReveal = document.querySelectorAll('.sector-card, .value-card, .feature-box, .stat-card');
  
  // Inject keyframe trigger CSS styling directly
  const styleSheet = document.createElement("style");
  styleSheet.textContent = `
    .sector-card, .value-card, .feature-box, .stat-card {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s cubic-bezier(0.25, 0.8, 0.25, 1), transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
    }
    .reveal-active {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(styleSheet);

  elementsToReveal.forEach(el => {
    revealObserver.observe(el);
  });
});
