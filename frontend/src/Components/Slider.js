import React from 'react';
import PropTypes from 'prop-types';

export default function Slider({ value, onChange, min, max }) {
  const steps = [];
  for (let i = min; i <= max; i += 10) {
    steps.push(i);
  }

  const getBackgroundSize = () => {
    return ((value - min) * 100) / (max - min);
  };

  return (
    <div className="w-full flex flex-col items-center">
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={onChange}
        className="w-full appearance-none border border-tertiary focus:outline-none focus:ring-0 transition duration rounded-full h-3"
        style={{
          background: `linear-gradient(to right, #312e81 ${getBackgroundSize()}%, #2b2934 ${getBackgroundSize()}%)`,
        }}
      />
      <div className="w-full flex justify-between text-white mt-2 px-1">
        {steps.map((step) => (
          <span
            key={step}
            className={`w-2 h-2 rounded-full ${
              value >= step ? 'bg-blueColorLight' : 'bg-[#2b2934]'
            }`}
          />
        ))}
      </div>
      <div className="w-full flex justify-between text-white mt-2 px-1">
        {steps.map((step) => (
          <span key={step} className="text-sm">
            {step}
          </span>
        ))}
      </div>
    </div>
  );
}

Slider.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
};
