import React, { useState } from "react";
import Image from "next/image";

interface PaymentMethodProps {
  onPaymentMethodChange: (method: string) => void;
}
export const PaymentMethods = ({
  onPaymentMethodChange,
}: PaymentMethodProps) => {
  const [selectedMethod, setSelectedMethod] = useState<string>("gcash");
  const handleMethodChange = (method: string) => {
    setSelectedMethod(method);
    onPaymentMethodChange(method);
  };
  const paymentMethods = [
    
    {
      id: "paymaya",
      name: "PayMaya",
      logo: "/img/paymaya.jpg",
      description: "Pay with your PayMaya account",
    },
    
    {
      id: "credit",
      name: "Credit Card",
      logo: "/img/visa.jpg",
      description: "Pay with Visa, Mastercard, etc.",
    },
  ];
  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-black mb-4">Payment Method</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            onClick={() => handleMethodChange(method.id)}
            className={`relative  border-2 rounded-lg p-4 cursor-pointer transition-all duration-300 ${selectedMethod === method.id ? "border-[#675d50] shadow-lg shadow-cyan-500/20" : "border-gray-700 hover:border-gray-500"}`}
          >
            <div className="flex items-center space-x-3">
              {method.logo ? (
                <div className="h-20 w-20 bg-white rounded-md flex items-center justify-center p-1">
                  <Image
                    src={method.logo}
                    alt={method.name}
                    width={80}
                    height={40}
                    className="object-contain h-10 w-auto"
                  />
                </div>
              ) : (
                method.logo
              )}
              <div className="flex-1">
                <h4 className="font-medium text-white">{method.name}</h4>
                <p className="text-sm text-gray-400 pl-5 pb-5">
                  {method.description}
                </p>
              </div>
              {selectedMethod === method.id && (
                <div className="absolute top-2 right-2 h-6 w-6 bg-[#675d50] rounded-full flex items-center justify-center"></div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {selectedMethod === "paymaya" && (
        <div className="mt-6 p-4 border border-gray-700 rounded-lg">
          <h4 className="text-black font-medium mb-1">PayMaya Details</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                PayMaya Number
              </label>
              <input
                type="text"
                placeholder="09XX XXX XXXX"
                className="w-full border border-gray-700 rounded-md py-2 px-3 text-gray-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>
      )}
      
      {selectedMethod === "credit" && (
        <div className="mt-6 p-4  border border-gray-700 rounded-lg">
          <h4 className="text-black font-medium mb-2">Card Details</h4>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Card Number
              </label>
              <input
                type="text"
                placeholder="XXXX XXXX XXXX XXXX"
                className="w-full  border border-gray-700 rounded-md py-2 px-3 text-gray-400 focus:outline-none focus:border-cyan-500 "
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Expiry Date
                </label>
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-full  border border-gray-700 rounded-md py-2 px-3 text-gray-400 focus:outline-none focus:border-cyan-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">CVC</label>
                <input
                  type="text"
                  placeholder="XXX"
                  className="w-full  border border-gray-700 rounded-md py-2 px-3 text-gray-400 focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Cardholder Name
              </label>
              <input
                type="text"
                placeholder="Name on card"
                className="w-full  border border-gray-700 rounded-md py-2 px-3 text-gray-400 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
