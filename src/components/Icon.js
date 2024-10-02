// src/components/Icon.js
import React, { useState, useEffect } from 'react';
import { getIcon } from '../utils/getIcon';

const Icon = ({ name, altText = '', width = 24, height = 24 }) => {
  const [iconSrc, setIconSrc] = useState(null);

  useEffect(() => {
    const loadIcon = async () => {
      const src = await getIcon(name);
      setIconSrc(src);
    };

    loadIcon();
  }, [name]);

  return iconSrc ? (
    <img
      src={iconSrc}
      alt={altText}
      width={width}
      height={height}
      style={{ display: 'inline-block', verticalAlign: 'middle' }}
    />
  ) : (
    <span>Loading...</span>
  );
};

export default Icon;
