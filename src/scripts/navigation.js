// navigation.js - Controlador de Pestañas e Inicialización General (PETI 2026-2030)

window.showToast = function(message, title = "Notificación") {
  const toast = document.getElementById('alert-toast');
  const toastTitle = document.getElementById('alert-toast-title');
  const toastText = document.getElementById('alert-toast-text');
  
  if (toast && toastTitle && toastText) {
    toastTitle.textContent = title;
    toastText.textContent = message;
    toast.classList.remove('hidden');
    
    // Ocultar toast después de 4.5 segundos
    setTimeout(() => {
      toast.classList.add('hidden');
    }, 4500);
  }
};

window.initNavigation = function() {
  const tabs = document.querySelectorAll('.nav-tab');
  const views = document.querySelectorAll('.tab-view');

  if (!tabs || !views) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.getAttribute('data-tab');

      // Modificar estilo de los botones de pestañas
      tabs.forEach(t => {
        t.className = "nav-tab px-4 py-2.5 rounded-lg text-xs md:text-sm font-semibold flex-1 text-center transition-all cyber-title cursor-pointer text-slate-400 hover:text-white";
      });
      tab.className = "nav-tab px-4 py-2.5 rounded-lg text-xs md:text-sm font-semibold flex-1 text-center transition-all cyber-title cursor-pointer bg-red-600/90 text-white glow-red";

      // Mostrar la sección correspondiente
      views.forEach(v => {
        v.classList.add('hidden');
        v.classList.remove('block');
      });

      const activeView = document.getElementById(`view-${target}`);
      if (activeView) {
        activeView.classList.remove('hidden');
        activeView.classList.add('block');
      }

      // Re-dibujar líneas de conexión en el Mapa BSC si se entra a esa pestaña
      if (target === 'mapa') {
        setTimeout(() => {
          if (typeof window.drawLaserPaths === 'function') {
            window.drawLaserPaths('all');
          }
        }, 150);
      }
    });
  });
};

// GATILLO DE INICIALIZACIÓN GLOBAL DOM CONTENT LOADED
window.addEventListener('DOMContentLoaded', () => {
  // 1. Cargar persistencia de localStorage
  if (typeof window.loadState === 'function') {
    window.loadState();
  }

  // 2. Inicializar controlador de navegación
  if (typeof window.initNavigation === 'function') {
    window.initNavigation();
  }

  // 3. Inicializar interacciones del Mapa BSC
  if (typeof window.initBscInteractions === 'function') {
    window.initBscInteractions();
  }

  // 4. Inicializar cuestionario de autodiagnóstico
  if (typeof window.initDiagnosticConsole === 'function') {
    window.initDiagnosticConsole();
  }
  if (typeof window.initStaticDiagnosticListeners === 'function') {
    window.initStaticDiagnosticListeners();
  }

  // 5. Inicializar la Consola lateral de Gobernanza ISO 38500
  if (typeof window.initISO38500Console === 'function') {
    window.initISO38500Console();
  }

  // 6. Recalcular y Renderizar todo por primera vez
  if (typeof window.recalculateAndRender === 'function') {
    window.recalculateAndRender();
  }
});
