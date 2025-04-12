import React from "react";
import languageOptions from "../../constants/languageOptions";

const LanguageSelector = ({ selected, onChange }) => {
  return (
    <select value={selected} onChange={onChange} style={{ padding: "0.5rem", fontSize: "1rem" }}>
      {languageOptions.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.label}
        </option>
      ))}
    </select>
  );
};

export default LanguageSelector;
