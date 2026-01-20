// src/pages/property-details/components/MortgageCalculator.jsx
import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import { formatFullINR, formatIndianNumber } from '../../../utils/indianFormatters';

const MortgageCalculator = ({ propertyPrice }) => {
  const [loanAmount, setLoanAmount] = useState(propertyPrice * 0.8); // 20% down
  const [downPayment, setDownPayment] = useState(propertyPrice * 0.2);
  const [interestRate, setInterestRate] = useState(8.5); // Typical Indian home loan rate
  const [loanTerm, setLoanTerm] = useState(20); // Years
  const [processingFee, setProcessingFee] = useState(propertyPrice * 0.005); // 0.5% processing fee

  const [monthlyEMI, setMonthlyEMI] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);

  useEffect(() => {
    // Update loan amount when down payment changes
    setLoanAmount(propertyPrice - downPayment);
  }, [downPayment, propertyPrice]);

  useEffect(() => {
    // Update down payment when loan amount changes
    setDownPayment(propertyPrice - loanAmount);
  }, [loanAmount, propertyPrice]);

  useEffect(() => {
    calculateEMI();
  }, [loanAmount, interestRate, loanTerm]);

  const calculateEMI = () => {
    if (loanAmount <= 0 || interestRate <= 0 || loanTerm <= 0) {
      setMonthlyEMI(0);
      setTotalPayment(0);
      setTotalInterest(0);
      return;
    }

    const monthlyRate = interestRate / 100 / 12;
    const numberOfPayments = loanTerm * 12;
    
    // EMI Formula: P × r × (1 + r)^n / ((1 + r)^n - 1)
    const emi = loanAmount * 
      (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
      (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    const total = emi * numberOfPayments;
    const interest = total - loanAmount;
    
    setMonthlyEMI(emi);
    setTotalPayment(total);
    setTotalInterest(interest);
  };

  const formatCurrency = (amount) => {
    return formatFullINR(amount);
  };

  const formatNumber = (num) => {
    return formatIndianNumber(num);
  };

  const handleDownPaymentPercentageChange = (percentage) => {
    const newDownPayment = (propertyPrice * percentage) / 100;
    setDownPayment(newDownPayment);
  };

  const downPaymentPercentage = ((downPayment / propertyPrice) * 100)?.toFixed(1);

  return (
    <div className="card p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Calculator" size={20} className="text-primary" />
        <h2 className="text-lg font-semibold text-text-primary">EMI Calculator</h2>
      </div>
      <div className="space-y-6">
        {/* Property Price */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Property Price
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">₹</span>
            <input
              type="text"
              value={formatNumber(propertyPrice)}
              readOnly
              className="w-full pl-8 pr-3 py-2 border border-border rounded-md bg-secondary-100 text-text-secondary cursor-not-allowed"
            />
          </div>
        </div>

        {/* Down Payment */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Down Payment ({downPaymentPercentage}%)
          </label>
          <div className="relative mb-3">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">₹</span>
            <input
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(Number(e?.target?.value))}
              className="w-full pl-8 pr-3 py-2 border border-border rounded-md focus:border-primary focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
            />
          </div>
          <div className="flex space-x-2">
            {[10, 20, 30, 40]?.map((percentage) => (
              <button
                key={percentage}
                onClick={() => handleDownPaymentPercentageChange(percentage)}
                className={`px-3 py-1 text-xs rounded-md transition-all duration-200 ${
                  Math.abs(Number(downPaymentPercentage) - percentage) < 0.1
                    ? 'bg-primary text-white' :'bg-secondary-100 text-text-secondary hover:bg-secondary-200'
                }`}
              >
                {percentage}%
              </button>
            ))}
          </div>
        </div>

        {/* Loan Amount */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Loan Amount
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">₹</span>
            <input
              type="number"
              value={loanAmount}
              onChange={(e) => setLoanAmount(Number(e?.target?.value))}
              className="w-full pl-8 pr-3 py-2 border border-border rounded-md focus:border-primary focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
            />
          </div>
        </div>

        {/* Interest Rate */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Interest Rate (% per annum)
          </label>
          <div className="relative mb-3">
            <input
              type="number"
              step="0.1"
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e?.target?.value))}
              className="w-full px-3 py-2 border border-border rounded-md focus:border-primary focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary">%</span>
          </div>
          <input
            type="range"
            min="6"
            max="15"
            step="0.1"
            value={interestRate}
            onChange={(e) => setInterestRate(Number(e?.target?.value))}
            className="w-full"
          />
        </div>

        {/* Loan Term */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Loan Tenure (Years)
          </label>
          <div className="relative mb-3">
            <input
              type="number"
              value={loanTerm}
              onChange={(e) => setLoanTerm(Number(e?.target?.value))}
              className="w-full px-3 py-2 border border-border rounded-md focus:border-primary focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200"
            />
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary">years</span>
          </div>
          <input
            type="range"
            min="5"
            max="30"
            step="1"
            value={loanTerm}
            onChange={(e) => setLoanTerm(Number(e?.target?.value))}
            className="w-full"
          />
        </div>

        {/* Results */}
        <div className="pt-6 border-t border-border space-y-4">
          <div className="bg-primary/10 rounded-lg p-4">
            <p className="text-sm text-text-secondary mb-1">Monthly EMI</p>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(monthlyEMI)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-secondary-100 rounded-lg p-4">
              <p className="text-xs text-text-secondary mb-1">Principal Amount</p>
              <p className="text-lg font-semibold text-text-primary">
                {formatCurrency(loanAmount)}
              </p>
            </div>
            <div className="bg-secondary-100 rounded-lg p-4">
              <p className="text-xs text-text-secondary mb-1">Total Interest</p>
              <p className="text-lg font-semibold text-text-primary">
                {formatCurrency(totalInterest)}
              </p>
            </div>
          </div>

          <div className="bg-secondary-100 rounded-lg p-4">
            <p className="text-sm text-text-secondary mb-1">Total Payment (Principal + Interest)</p>
            <p className="text-xl font-bold text-text-primary">
              {formatCurrency(totalPayment)}
            </p>
          </div>

          {/* Processing Fee Info */}
          <div className="text-xs text-text-secondary bg-secondary-50 p-3 rounded">
            <p className="font-medium mb-1">Additional Costs:</p>
            <p>• Processing Fee (approx.): {formatCurrency(processingFee)}</p>
            <p>• Stamp Duty & Registration charges apply</p>
            <p>• GST applicable on processing fee</p>
          </div>
        </div>

        {/* Disclaimer */}
        <p className="text-xs text-text-secondary italic">
          *This is an indicative EMI calculation. Actual EMI may vary based on lender policies and additional charges.
        </p>
      </div>
    </div>
  );
};

export default MortgageCalculator;