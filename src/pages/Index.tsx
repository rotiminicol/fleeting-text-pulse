
import React from 'react';
import PhoneGenerator from '../components/PhoneGenerator';

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Disposable Phone Numbers
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Generate temporary phone numbers that expire in 1 hour. Perfect for SMS verification 
            and protecting your privacy online.
          </p>
        </div>
        <PhoneGenerator />
      </div>
    </div>
  );
};

export default Index;
