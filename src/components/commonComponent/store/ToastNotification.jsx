import React, { useEffect } from 'react';
import { Toast, ToastBody, ToastHeader } from 'reactstrap';

const ToastNotification = ({ icon,show, header, msg, duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="p-3 my-2 rounded" style={{ position: 'fixed', top: 10, right: 10, zIndex: 1050 }}>
      <Toast isOpen={show}>
        <ToastHeader icon={icon}  toggle={onClose}>
          {header}
        </ToastHeader>
        <ToastBody>
          {msg}
        </ToastBody>
      </Toast>
    </div>
  );
};

export default ToastNotification;
