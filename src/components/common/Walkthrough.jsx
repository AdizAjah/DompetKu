import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, X, Sparkles } from 'lucide-react';

const STORAGE_KEY = 'dompetku-walkthrough-completed';

/**
 * Interactive walkthrough/onboarding component.
 * Highlights target elements and shows tooltips with step-by-step guidance.
 */
export default function Walkthrough({ steps, onComplete, storageKey = STORAGE_KEY }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [targetRect, setTargetRect] = useState(null);
  const [tooltipStyle, setTooltipStyle] = useState({});
  const [arrowPosition, setArrowPosition] = useState('top');
  const tooltipRef = useRef(null);
  const resizeObserverRef = useRef(null);

  // Check if walkthrough was already completed
  useEffect(() => {
    const completed = localStorage.getItem(storageKey);
    if (!completed) {
      // Small delay to let the page render
      const timer = setTimeout(() => setIsActive(true), 800);
      return () => clearTimeout(timer);
    }
  }, [storageKey]);

  // Find & highlight the target element for current step
  const updateHighlight = useCallback(() => {
    if (!isActive || !steps[currentStep]) return;

    const step = steps[currentStep];
    const el = document.querySelector(step.target);

    if (el) {
      const rect = el.getBoundingClientRect();
      const padding = step.padding || 8;
      setTargetRect({
        top: rect.top - padding,
        left: rect.left - padding,
        width: rect.width + padding * 2,
        height: rect.height + padding * 2,
      });

      // Scroll element into view if needed
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    } else {
      setTargetRect(null);
    }
  }, [isActive, currentStep, steps]);

  useEffect(() => {
    updateHighlight();

    // Update on resize / scroll
    window.addEventListener('resize', updateHighlight);
    window.addEventListener('scroll', updateHighlight, true);

    return () => {
      window.removeEventListener('resize', updateHighlight);
      window.removeEventListener('scroll', updateHighlight, true);
    };
  }, [updateHighlight]);

  // Position tooltip relative to highlighted element
  useEffect(() => {
    if (!targetRect || !tooltipRef.current) return;

    const tooltip = tooltipRef.current;
    const tooltipRect = tooltip.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = 16;
    const arrowGap = 12;

    let top, left;
    let arrow = 'top';

    const step = steps[currentStep];
    const preferredPosition = step.position || 'auto';

    const fitsBelow = targetRect.top + targetRect.height + arrowGap + tooltipRect.height + margin < vh;
    const fitsAbove = targetRect.top - arrowGap - tooltipRect.height - margin > 0;

    if (preferredPosition === 'bottom' || (preferredPosition === 'auto' && fitsBelow)) {
      top = targetRect.top + targetRect.height + arrowGap;
      arrow = 'top';
    } else if (preferredPosition === 'top' || (preferredPosition === 'auto' && fitsAbove)) {
      top = targetRect.top - tooltipRect.height - arrowGap;
      arrow = 'bottom';
    } else {
      // Fallback: place below
      top = targetRect.top + targetRect.height + arrowGap;
      arrow = 'top';
    }

    // Horizontal centering
    left = targetRect.left + targetRect.width / 2 - tooltipRect.width / 2;

    // Clamp to viewport
    left = Math.max(margin, Math.min(left, vw - tooltipRect.width - margin));
    top = Math.max(margin, Math.min(top, vh - tooltipRect.height - margin));

    setTooltipStyle({ top: `${top}px`, left: `${left}px` });
    setArrowPosition(arrow);
  }, [targetRect, currentStep, steps]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    setIsActive(false);
    localStorage.setItem(storageKey, 'true');
    onComplete?.();
  };

  if (!isActive || !steps.length) return null;

  const step = steps[currentStep];

  return (
    <div className="walkthrough-overlay" onClick={(e) => e.target === e.currentTarget && null}>
      {/* Dark overlay with spotlight cutout using SVG */}
      <svg
        className="walkthrough-svg-overlay"
        width="100%"
        height="100%"
        style={{ position: 'fixed', inset: 0, zIndex: 9998 }}
      >
        <defs>
          <mask id="walkthrough-mask">
            <rect width="100%" height="100%" fill="white" />
            {targetRect && (
              <rect
                x={targetRect.left}
                y={targetRect.top}
                width={targetRect.width}
                height={targetRect.height}
                rx="12"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill="rgba(0, 0, 0, 0.72)"
          mask="url(#walkthrough-mask)"
          onClick={handleSkip}
          style={{ cursor: 'pointer' }}
        />
      </svg>

      {/* Highlight ring around target */}
      {targetRect && (
        <div
          className="walkthrough-highlight-ring"
          style={{
            top: `${targetRect.top}px`,
            left: `${targetRect.left}px`,
            width: `${targetRect.width}px`,
            height: `${targetRect.height}px`,
          }}
        />
      )}

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className={`walkthrough-tooltip walkthrough-tooltip--arrow-${arrowPosition}`}
        style={tooltipStyle}
      >
        {/* Step indicator & Skip */}
        <div className="walkthrough-tooltip__header">
          <div className="walkthrough-tooltip__step-indicator">
            <Sparkles size={14} className="walkthrough-tooltip__sparkle" />
            <span>
              Langkah {currentStep + 1} dari {steps.length}
            </span>
          </div>
          <button
            onClick={handleSkip}
            className="walkthrough-tooltip__skip"
            aria-label="Lewati panduan"
          >
            <X size={16} />
          </button>
        </div>

        {/* Title */}
        {step.title && (
          <h3 className="walkthrough-tooltip__title">{step.title}</h3>
        )}

        {/* Description */}
        <p className="walkthrough-tooltip__desc">{step.content}</p>

        {/* Progress dots */}
        <div className="walkthrough-tooltip__dots">
          {steps.map((_, i) => (
            <span
              key={i}
              className={`walkthrough-tooltip__dot ${i === currentStep ? 'walkthrough-tooltip__dot--active' : ''}`}
            />
          ))}
        </div>

        {/* Navigation buttons */}
        <div className="walkthrough-tooltip__nav">
          <button
            onClick={handleBack}
            disabled={currentStep === 0}
            className="walkthrough-tooltip__btn walkthrough-tooltip__btn--back"
          >
            <ChevronLeft size={16} />
            <span>Kembali</span>
          </button>

          <button
            onClick={handleSkip}
            className="walkthrough-tooltip__btn walkthrough-tooltip__btn--skip-text"
          >
            Lewati
          </button>

          <button
            onClick={handleNext}
            className="walkthrough-tooltip__btn walkthrough-tooltip__btn--next"
          >
            <span>{currentStep === steps.length - 1 ? 'Selesai' : 'Lanjut'}</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * Hook to reset walkthrough (e.g., from settings).
 * Clears localStorage and navigates to dashboard where walkthrough auto-starts.
 */
export function useResetWalkthrough(storageKey = STORAGE_KEY) {
  const navigate = useNavigate();
  return useCallback(() => {
    localStorage.removeItem(storageKey);
    navigate('/');
    // Small delay to let navigation complete, then force re-render
    setTimeout(() => window.location.reload(), 100);
  }, [storageKey, navigate]);
}
