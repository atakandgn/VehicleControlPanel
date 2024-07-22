import React, { useState, useEffect } from 'react';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timerId);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleTimeString(['en-US'], { hour: '2-digit', minute: '2-digit' });
  };
  return (
    <div>
      <span className='xs:text-base text-xs'>{formatTime(time)}</span>
    </div>
  );
};

export default Clock;
