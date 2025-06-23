import React from "react";
import "../components/Input.css";

const Input = ({ type, label, name, value, onChange, required, ...props }) => {
  return (
    <div className="input-group">
      {label && <label>{label}</label>}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={label}
        className="input-field input-with-label"
        required={required}
        {...props}
      />
    </div>
  );
};

export default Input;
