import React from "react";

type DropdownProps = {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  onChange,
}) => {
  return (
    <div>
      <label>
        {label}：
        <select value={value} onChange={(e) => onChange(e.target.value)}>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default Dropdown;
