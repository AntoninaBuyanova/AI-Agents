// Этот файл гарантирует, что во всем приложении используется одна версия React
import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMClient from 'react-dom/client';

// Важный момент: объект window.React должен быть доступен глобально
// Многие библиотеки, встроенные в минифицированном JavaScript,
// ссылаются на window.React вместо импорта
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.React = React;
  // @ts-ignore
  window.ReactDOM = ReactDOM;
}

// Проверяем, что React.useState доступен
console.log('React version:', React.version);
console.log('React hooks are available:', typeof React.useState === 'function');

// Экспортируем React и ReactDOM для использования в других файлах
export { React, ReactDOM, ReactDOMClient };

// Экспортируем хуки для удобства
export const {
  useState,
  useEffect,
  useContext,
  useReducer,
  useCallback,
  useMemo,
  useRef,
  useLayoutEffect
} = React; 