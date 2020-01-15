import React, { useState, useEffect } from 'react';

export default function useCounter() {
  const initialState = () => {
    if (localStorage.getItem('path')) return localStorage.getItem('path');
    return null;
  };
  const [path, _setPath] = useState(null);

  const setPath = p => _setPath(p);

  useEffect(() => window.localStorage.setItem('path', path), [path]);

  return { path, setPath };
}
