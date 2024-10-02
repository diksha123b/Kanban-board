// Icon.js
import React from 'react';

const Icon = ({ name, altText, width = 24, height = 24 }) => {
  try {
    const iconSrc = require(`../icons_FEtask/${name}.svg`); // Adjust path as needed

    return (
      <img
        src={iconSrc.default}
        alt={altText}
        width={width}
        height={height}
        style={{ display: 'inline-block', verticalAlign: 'middle' }}
      />
    );
  } catch (error) {
    console.error(`Icon ${name} not found.`, error);
    return null;
  }
};

export default Icon;
