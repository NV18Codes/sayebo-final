
import { useState } from 'react';
import { CreditCard, Smartphone, Building, QrCode } from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'card' | 'eft' | 'payfast' | 'ozow' | 'yoco';
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  fees?: string;
}

const paymentMethods: PaymentMethod[] = [
  {
    id: 'card',
    type: 'card',
    name: 'Credit/Debit Card',
    icon: CreditCard,
    description: 'Visa, Mastercard, American Express',
    fees: 'No additional fees'
  },
  {
    id: 'eft',
    type: 'eft',
    name: 'EFT Secure',
    icon: Building,
    description: 'Direct bank transfer',
    fees: 'No additional fees'
  },
  {
    id: 'payfast',
    type: 'payfast',
    name: 'PayFast',
    icon: Smartphone,
    description: 'South African payment gateway',
    fees: 'Standard gateway fees apply'
  },
  {
    id: 'ozow',
    type: 'ozow',
    name: 'Ozow',
    icon: QrCode,
    description: 'Instant EFT payments',
    fees: 'No additional fees for buyers'
  }
];

interface PaymentMethodsProps {
  selectedMethod: string;
  onMethodSelect: (methodId: string) => void;
  total: number;
}

export const PaymentMethods = ({ selectedMethod, onMethodSelect, total }: PaymentMethodsProps) => {
  const [showCardForm, setShowCardForm] = useState(false);

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">Payment Method</h3>

      <div className="space-y-3">
        {paymentMethods.map((method) => {
          const Icon = method.icon;
          return (
            <div
              key={method.id}
              className={`border rounded-lg p-4 cursor-pointer transition-colors ${
                selectedMethod === method.id
                  ? 'border-pink-400 bg-pink-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => {
                onMethodSelect(method.id);
                setShowCardForm(method.type === 'card');
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    selectedMethod === method.id ? 'bg-pink-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-5 h-5 ${
                      selectedMethod === method.id ? 'text-pink-600' : 'text-gray-600'
                    }`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-800">{method.name}</h4>
                    <p className="text-sm text-gray-600">{method.description}</p>
                    {method.fees && (
                      <p className="text-xs text-green-600">{method.fees}</p>
                    )}
                  </div>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedMethod === method.id
                    ? 'border-pink-400 bg-pink-400'
                    : 'border-gray-300'
                }`}>
                  {selectedMethod === method.id && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Card Form */}
      {showCardForm && selectedMethod === 'card' && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-4">Card Details</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Card Number
              </label>
              <input
                type="text"
                placeholder="1234 5678 9012 3456"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  placeholder="123"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cardholder Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
              />
            </div>
          </div>
        </div>
      )}

      {/* Payment Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Order Total:</span>
          <span className="font-semibold text-gray-800">
            {new Intl.NumberFormat('en-ZA', {
              style: 'currency',
              currency: 'ZAR'
            }).format(total)}
          </span>
        </div>
      </div>
    </div>
  );
};
