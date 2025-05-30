
import React from 'react';
import PhoneGenerator from '../components/PhoneGenerator';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Disposable Phone Numbers
          </h1>
          <p className="text-lg text-gray-600">
            Generate temporary phone numbers that expire in 1 hour. Perfect for SMS verification.
          </p>
        </div>
        <PhoneGenerator />
      </div>
    </div>
  );
};

export default Index;
