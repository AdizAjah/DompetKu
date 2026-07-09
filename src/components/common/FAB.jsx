import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import PropTypes from 'prop-types';

export default function FAB({ actions, onClick, icon, ariaLabel = "Tambah" }) {
  const [isOpen, setIsOpen] = useState(false);

  const isMulti = actions && actions.length > 0;

  const handleClick = () => {
    if (isMulti) {
      setIsOpen(!isOpen);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div className="fixed bottom-24 sm:bottom-8 right-6 z-20 flex flex-col items-end gap-3">
      {/* Sub buttons */}
      {isMulti && isOpen && (
        <div className="flex flex-col gap-3 animate-slide-up">
          {actions.map((action, idx) => (
            <button
              key={idx}
              onClick={() => { action.onClick(); setIsOpen(false); }}
              className={`flex items-center gap-3 pl-4 pr-5 py-3 rounded-2xl shadow-lg
                text-white font-medium text-sm transition-all active:scale-95
                ${action.colorClass || 'bg-primary-500 hover:bg-primary-600'}`}
            >
              {action.icon}
              <span>{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={handleClick}
        className={`w-14 h-14 rounded-2xl shadow-xl flex items-center justify-center
          gradient-primary text-white transition-all duration-300
          hover:shadow-2xl active:scale-90
          ${isMulti && isOpen ? 'rotate-45' : 'rotate-0'}`}
        aria-label={ariaLabel}
      >
        {isMulti && isOpen ? <X size={24} /> : (icon || <Plus size={24} />)}
      </button>
    </div>
  );
}

FAB.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      icon: PropTypes.element.isRequired,
      onClick: PropTypes.func.isRequired,
      colorClass: PropTypes.string
    })
  ),
  onClick: PropTypes.func,
  icon: PropTypes.element,
  ariaLabel: PropTypes.string
};
