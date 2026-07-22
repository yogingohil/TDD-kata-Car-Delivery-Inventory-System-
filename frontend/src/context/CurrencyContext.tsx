import React, { createContext, useContext, useState } from 'react';

export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'INR';

interface CurrencyContextType {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  formatPrice: (priceInUSD: number) => string;
}

const rates: Record<CurrencyCode, { rate: number; symbol: string }> = {
  USD: { rate: 1.0, symbol: '$' },
  EUR: { rate: 0.92, symbol: '€' },
  GBP: { rate: 0.78, symbol: '£' },
  INR: { rate: 83.5, symbol: '₹' },
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState<CurrencyCode>('USD');

  const formatPrice = (priceInUSD: number): string => {
    const { rate, symbol } = rates[currency];
    const converted = Math.round(priceInUSD * rate);
    return `${symbol}${converted.toLocaleString()}`;
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) throw new Error('useCurrency must be used within CurrencyProvider');
  return context;
};
