import React from 'react';

interface CheckBoxProps {
    checked: boolean;
    onChange: () => void;
    label: string;
}

const CheckBox: React.FC<CheckBoxProps> = ({ checked, onChange, label }) => {
    return (
        <label className="flex items-center cursor-pointer">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="hidden"
            />
            <span className={`w-4 h-4 border rounded-md flex items-center justify-center mr-2 ${checked ? 'bg-blue-500 border-blue-500' : 'border-gray-300'}`}>
                {checked && <span className="text-white">✓</span>}
            </span>
            {label}
        </label>
    );
};

export default CheckBox;
