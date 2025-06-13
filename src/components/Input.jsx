import React from "react";
import "../components/Input.css";

const Input = ({ type, label }) => {
  return (
    <div>
      <input
        type={type}
        placeholder={label}
        className="input-field input-with-label"
      />
    </div>
  );
};

export default Input;
