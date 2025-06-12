import React from "react";
import "./ToggleSwitch.css";

interface ToggleSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ checked, onChange }) => {
  return (
    <div className="toggle-wrapper">
      <label className="toggle-label">Exif情報</label>
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
