import React from "react";
import "./ToggleSwitch.css";

interface ToggleSwitchProps {
  name: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  name,
  checked,
  onChange,
}) => {
  return (
    <div className="toggle-wrapper">
      <label className="toggle-label">{name}</label>
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="toggle-slider" />
      </label>
    </div>
  );
};

export default ToggleSwitch;
