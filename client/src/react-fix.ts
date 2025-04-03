// Этот файл гарантирует, что во всем приложении используется одна версия React
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactDOMClient from 'react-dom/client';

// Экспортируем все из React и ReactDOM для использования в других файлах
export { React, ReactDOM, ReactDOMClient };

// Проверяем, что React.useState доступен
console.log('React hooks are available:', typeof React.useState === 'function');

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