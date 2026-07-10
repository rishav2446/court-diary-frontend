import React, { useState, forwardRef } from 'react';
import { FiEye, FiEyeOff, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import './Input.css';

/**
 * Premium Floating-Label Input Component
 * Types: text | email | password | number | tel | search
 */
const Input = forwardRef(({
  label,
  type = 'text',
  error,
  success,
  hint,
  icon: Icon,
  value,
  onChange,
  onBlur,
  onFocus,
  disabled = false,
  required = false,
  id,
  name,
  placeholder = ' ',
  className = '',
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const inputType = type === 'password' ? (showPassword ? 'text' : 'password') : type;
  const hasValue  = value !== undefined ? value !== '' : false;
  const inputId   = id || name || label?.toLowerCase().replace(/\s+/g, '-');

  const wrapperClasses = [
    'input-wrapper',
    error   ? 'input-wrapper--error'   : '',
    success ? 'input-wrapper--success' : '',
    focused ? 'input-wrapper--focused' : '',
    disabled ? 'input-wrapper--disabled' : '',
    Icon ? 'input-wrapper--has-icon' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={wrapperClasses}>
      {/* Left Icon */}
      {Icon && (
        <span className="input__icon input__icon--left" aria-hidden="true">
          <Icon size={16} />
        </span>
      )}

      {/* The actual input */}
      <input
        ref={ref}
        id={inputId}
        name={name}
        type={inputType}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        className="input__field"
        aria-describedby={error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined}
        aria-invalid={!!error}
        onFocus={(e) => { setFocused(true); onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); onBlur?.(e); }}
        {...props}
      />

      {/* Floating Label */}
      {label && (
        <label
          htmlFor={inputId}
          className={`input__label ${(hasValue || focused) ? 'input__label--floating' : ''}`}
        >
          {label}{required && <span className="input__required" aria-hidden="true"> *</span>}
        </label>
      )}

      {/* Right Side: Password Toggle / Status Icon */}
      <div className="input__right-actions">
        {type === 'password' && (
          <button
            type="button"
            className="input__toggle-password"
            onClick={() => setShowPassword(p => !p)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            tabIndex={-1}
          >
            {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
          </button>
        )}
        {error   && <FiAlertCircle size={16} className="input__status-icon input__status-icon--error"   aria-hidden="true" />}
        {success && !error && <FiCheckCircle size={16} className="input__status-icon input__status-icon--success" aria-hidden="true" />}
      </div>

      {/* Animated border line */}
      <span className="input__focus-line" aria-hidden="true" />

      {/* Error / Hint Messages */}
      {error && (
        <p id={`${inputId}-error`} className="input__message input__message--error" role="alert">
          {error}
        </p>
      )}
      {hint && !error && (
        <p id={`${inputId}-hint`} className="input__message input__message--hint">
          {hint}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
