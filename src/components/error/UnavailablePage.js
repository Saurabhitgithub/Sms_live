import React from 'react';

const UnavailablePage = () => {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{
      background: 'linear-gradient(to bottom, #e3f3fc, #b6e0fe)'
    }}>
      <div className="bg-white rounded shadow p-5 text-center" style={{ maxWidth: 400 }}>
        <h1 className="display-5 mb-3 text-primary">Service Unavailable</h1>
        <p className="mb-4 text-secondary">
          Sorry, this website is currently unavailable.<br/>
          Please try again later.
        </p>
        <button
          type="button"
          className="btn btn-info text-white px-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    </div>
  );
};

export default UnavailablePage;
