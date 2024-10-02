// src/utils/getIcon.js
export const getIcon = async (iconName) => {
    try {
      const icon = await import(`../icons_FEtask/${iconName}.svg`);
      return icon.default;
    } catch (error) {
      console.error(`Icon "${iconName}" not found.`);
      return null;
    }
  };
  