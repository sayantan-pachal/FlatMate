import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, Lock } from "lucide-react";

const CustomDropdown = ({
  value,
  onChange,
  options = [],
  placeholder = "Select option",
  icon = null,
  width = "w-full",
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block ${width}`} ref={dropdownRef}>
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setIsOpen((prev) => !prev)}
        className={`flex w-full items-center justify-between gap-2 rounded-2xl border px-3.5 py-3 text-sm font-medium backdrop-blur-md transition ${
          disabled
            ? "cursor-not-allowed border-slate-200/60 bg-slate-100/70 text-slate-500 opacity-85 dark:border-white/10 dark:bg-[#0B1522]/70 dark:text-slate-300"
            : "cursor-pointer border-slate-200/80 bg-white/80 text-slate-900 shadow-sm hover:border-teal-500/40 dark:border-white/10 dark:bg-[#0E1B2B]/90 dark:text-white dark:shadow-none dark:hover:border-[#34E8C5]/40"
        }`}
      >
        <div className="flex min-w-0 items-center gap-2">
          {selectedOption?.icon || icon}
          <span className="truncate">
            {selectedOption?.label || placeholder}
          </span>
        </div>

        {disabled ? (
          <Lock size={14} className="shrink-0 text-slate-400 dark:text-slate-500" />
        ) : (
          <ChevronDown
            size={16}
            className={`shrink-0 text-slate-400 transition-transform duration-300 ${
              isOpen ? "rotate-180 text-teal-600 dark:text-[#34E8C5]" : ""
            }`}
          />
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl border border-slate-200/80 bg-white/95 p-1.5 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-[#0E1B2B]/95">
          {options.map((option) => {
            const isSelected = value === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  isSelected
                    ? "bg-teal-500/15 text-teal-700 dark:bg-[#133840] dark:text-[#34E8C5]"
                    : "text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5"
                }`}
              >
                <div className="flex min-w-0 items-center gap-2">
                  {option.icon}
                  <span className="truncate">{option.label}</span>
                </div>
                {isSelected && (
                  <Check
                    size={14}
                    strokeWidth={3}
                    className="shrink-0 text-teal-600 dark:text-[#34E8C5]"
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown;