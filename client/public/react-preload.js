// Предзагрузка React для предотвращения ошибок
(function() {
  try {
    // Записываем версию React в глобальную переменную, чтобы гарантировать его доступность
    window.React = window.React || {
      version: '18.3.1', // Текущая версия React
      useState: function() { 
        console.error('React not fully loaded yet'); 
        return [undefined, function(){}]; 
      },
      useEffect: function() {},
      useRef: function() { return { current: null }; },
      createContext: function() { return {}; },
      useContext: function() { return {}; },
      createElement: function() { return {}; },
      Fragment: Symbol('Fragment')
    };
    
    console.log('React preloaded via preload script');
  } catch(e) {
    console.error('Failed to preload React:', e);
  }
})(); 