import { useState, useRef } from 'react';

export default function CurrencyInput({ value, onChange, symbol = 'Rp', placeholder = '0', ...props }) {
  const [displayValue, setDisplayValue] = useState(value ? Number(value).toLocaleString('id-ID') : '');
  const inputRef = useRef(null);

  const handleChange = (e) => {
    let raw = e.target.value.replace(/[^0-9]/g, '');
    if (raw === '') {
      setDisplayValue('');
      onChange(0);
      return;
    }

    const numValue = parseInt(raw, 10);
    setDisplayValue(numValue.toLocaleString('id-ID'));
    onChange(numValue);
  };

  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-surface-400 dark:text-surface-500 font-semibold text-sm">
        {symbol}
      </span>
      <input
        ref={inputRef}
        type="text"
        inputMode="numeric"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        className="input-field pl-12 text-right text-lg font-semibold"
        {...props}
      />
    </div>
  );
}
