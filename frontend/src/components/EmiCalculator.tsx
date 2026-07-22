import React, { useState } from 'react';
import { useCurrency } from '../context/CurrencyContext.js';

export const EmiCalculator: React.FC<{ vehiclePrice: number }> = ({ vehiclePrice }) => {
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [tenureMonths, setTenureMonths] = useState(48);
  const [annualInterestRate, setAnnualInterestRate] = useState(6.5);

  const { formatPrice } = useCurrency();

  const downPayment = (vehiclePrice * downPaymentPercent) / 100;
  const loanAmount = vehiclePrice - downPayment;
  const monthlyRate = annualInterestRate / 12 / 100;

  const monthlyEmi =
    monthlyRate === 0
      ? loanAmount / tenureMonths
      : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
        (Math.pow(1 + monthlyRate, tenureMonths) - 1);

  const totalPayable = monthlyEmi * tenureMonths + downPayment;
  const totalInterest = totalPayable - vehiclePrice;

  return (
    <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-xl space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <span>🧮</span> Auto Financing & Monthly EMI Calculator
        </h3>
        <span className="text-xs font-semibold text-cyan-400">Fixed Rate Estimate</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-300">
            <span>Down Payment: {downPaymentPercent}%</span>
            <span className="text-cyan-400">{formatPrice(downPayment)}</span>
          </div>
          <input
            type="range"
            min={10}
            max={80}
            step={5}
            value={downPaymentPercent}
            onChange={(e) => setDownPaymentPercent(parseFloat(e.target.value))}
            className="w-full accent-cyan-500 bg-slate-950 rounded-lg cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-300">
            <span>Loan Tenure: {tenureMonths} Months</span>
            <span className="text-cyan-400">{tenureMonths / 12} Years</span>
          </div>
          <input
            type="range"
            min={12}
            max={72}
            step={12}
            value={tenureMonths}
            onChange={(e) => setTenureMonths(parseInt(e.target.value))}
            className="w-full accent-cyan-500 bg-slate-950 rounded-lg cursor-pointer"
          />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs font-semibold text-slate-300">
            <span>Interest Rate: {annualInterestRate}% APR</span>
          </div>
          <input
            type="range"
            min={3}
            max={12}
            step={0.5}
            value={annualInterestRate}
            onChange={(e) => setAnnualInterestRate(parseFloat(e.target.value))}
            className="w-full accent-cyan-500 bg-slate-950 rounded-lg cursor-pointer"
          />
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div>
          <span className="text-xs text-slate-500 block">Monthly Installment</span>
          <span className="text-2xl font-black text-cyan-400">
            {formatPrice(monthlyEmi)}/mo
          </span>
        </div>
        <div>
          <span className="text-xs text-slate-500 block">Total Interest Payable</span>
          <span className="text-lg font-bold text-amber-400">
            {formatPrice(totalInterest)}
          </span>
        </div>
        <div>
          <span className="text-xs text-slate-500 block">Total Vehicle Cost</span>
          <span className="text-lg font-bold text-white">
            {formatPrice(totalPayable)}
          </span>
        </div>
      </div>
    </div>
  );
};
