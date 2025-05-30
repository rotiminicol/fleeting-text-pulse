
import React from 'react';
import PhoneGenerator from '../components/PhoneGenerator';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            Disposable Phone Numbers
          </h1>
          <p className="text-xl text-gray-700 max-w-2xl mx-auto leading-relaxed">
            Generate temporary phone numbers from any country that expire in 1 hour. Perfect for SMS verification 
            and protecting your privacy online.
          </p>
          <div className="flex justify-center mt-6">
            <div className="flex gap-2">
              <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">🌍 Worldwide</span>
              <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">⚡ Instant</span>
              <span className="px-4 py-2 bg-pink-100 text-pink-700 rounded-full text-sm font-semibold">🔒 Private</span>
            </div>
          </div>
        </div>
        <PhoneGenerator />
      </div>
    </div>
  );
};

export default Index;
