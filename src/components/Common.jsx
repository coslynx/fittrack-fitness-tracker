import React from 'react';
import PropTypes from 'prop-types';

const Button = ({ children, onClick, type = "button", disabled = false, className = "", ...props }) => {
  return (
    <button
      onClick={onClick}
      type={type}
      disabled={disabled}
      className={rounded px-4 py-2 font-medium disabled:opacity-50 disabled:cursor-not-allowed ${className}}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(["button", "submit", "reset"]),
  disabled: PropTypes.bool,
  className: PropTypes.string,
};


const Input = ({ type = "text", placeholder = "", value, onChange, className = "", required = false, ...props }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 ${className}}
      required={required}
      {...props}
    />
  );
};

Input.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  className: PropTypes.string,
  required: PropTypes.bool,
};


const Modal = ({ isOpen, onClose, children, title = "Modal" }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded p-6 w-full max-w-md relative">
          <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{title}</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700 focus:outline-none absolute top-2 right-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
              </button>
          </div>
        {children}
      </div>
    </div>
  );
};


Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    children: PropTypes.node.isRequired,
    title: PropTypes.string,
};


const LoadingSpinner = ({ size = "medium", color = "blue" }) => {
    let spinnerSizeClass;
    switch (size) {
        case 'small':
            spinnerSizeClass = 'w-4 h-4';
            break;
        case 'large':
            spinnerSizeClass = 'w-8 h-8';
            break;
        default:
            spinnerSizeClass = 'w-6 h-6';
    }

    let spinnerColorClass;
    switch (color) {
        case 'red':
            spinnerColorClass = 'border-red-500';
            break;
         case 'green':
            spinnerColorClass = 'border-green-500';
            break;
        default:
            spinnerColorClass = 'border-blue-500';
    }

  return (
        <div className={animate-spin rounded-full border-t-2  ${spinnerColorClass} ${spinnerSizeClass}}></div>
  );
};


LoadingSpinner.propTypes = {
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    color: PropTypes.oneOf(['blue', 'red', 'green']),
}

const ErrorMessage = ({ message }) => {
    if (!message) return null
    return (
        <div className="text-red-500 text-sm">{message}</div>
    )
}

ErrorMessage.propTypes = {
    message: PropTypes.string,
}

export { Button, Input, Modal, LoadingSpinner, ErrorMessage };