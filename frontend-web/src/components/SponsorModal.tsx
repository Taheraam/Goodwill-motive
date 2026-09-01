'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/stores/auth.store';
import { UtensilsIcon, SparklesIcon, HeartHandshakeIcon, ShieldIcon } from '@/lib/icons';
import { toast } from 'sonner';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

interface SponsorModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId?: string;
  campaignName?: string;
  onSuccess?: () => void;
}

const PRESET_TIERS = [
  { amount: 250, meals: 10, label: 'Starter Relief', popular: false },
  { amount: 500, meals: 20, label: 'Community Sustenance', popular: true },
  { amount: 1250, meals: 50, label: 'Family Box Impact', popular: false },
  { amount: 2500, meals: 100, label: 'Hero Patron', popular: false },
];

export default function SponsorModal({
  isOpen,
  onClose,
  campaignId,
  campaignName,
  onSuccess,
}: SponsorModalProps) {
  const { user } = useAuthStore();
  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState(false);
  const [donorName, setDonorName] = useState(user?.username || '');
  const [donorEmail, setDonorEmail] = useState(user?.email || '');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [receiptDetails, setReceiptDetails] = useState<any>(null);

  useEffect(() => {
    if (user) {
      if (!donorName) setDonorName(user.username);
      if (!donorEmail) setDonorEmail(user.email);
    }
  }, [user]);

  // Load Razorpay checkout script
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  if (!isOpen) return null;

  const currentAmount = isCustom ? (parseInt(customAmount, 10) || 0) : selectedAmount;
  const currentMeals = Math.max(1, Math.round(currentAmount / 25));

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAmount < 25) {
      toast.error('Minimum sponsorship is ₹25 (1 Meal)');
      return;
    }

    setLoading(true);
    try {
      // 1. Create Order on Backend
      const { data: orderData } = await api.post('/payments/create-order', {
        amount: currentAmount,
        currency: 'INR',
        campaignId,
        mealsSponsored: currentMeals,
        donorName: donorName || 'Generous Donor',
        donorEmail: donorEmail || undefined,
      });

      // Check if standard Razorpay is ready
      if (window.Razorpay && orderData.keyId && !orderData.keyId.includes('mock')) {
        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'Goodwill Motive Foundation',
          description: `Sponsorship of ${currentMeals} Meals for ${campaignName || 'Emergency Relief'}`,
          order_id: orderData.orderId,
          prefill: {
            name: donorName,
            email: donorEmail,
          },
          theme: { color: '#1B4332' },
          handler: async (response: any) => {
            await verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              donorName,
              donorEmail,
            });
          },
          modal: {
            ondismiss: () => {
              setLoading(false);
              toast.info('Payment cancelled');
            },
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        // Development Sandbox Flow (Direct Instant Verification)
        const mockPaymentId = `pay_mock_${Date.now()}`;
        await verifyPayment({
          razorpayOrderId: orderData.orderId,
          razorpayPaymentId: mockPaymentId,
          razorpaySignature: 'dev_mock_signature',
          donorName,
          donorEmail,
        });
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to initialize payment');
      setLoading(false);
    }
  };

  const verifyPayment = async (verificationPayload: any) => {
    try {
      const { data } = await api.post('/payments/verify', verificationPayload);
      setIsSuccess(true);
      setReceiptDetails({
        amount: currentAmount,
        meals: currentMeals,
        paymentId: verificationPayload.razorpayPaymentId,
        orderId: verificationPayload.razorpayOrderId,
      });
      toast.success(`🎉 Thank you! ${currentMeals} meals sponsored!`);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Payment verification failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setIsSuccess(false);
    setReceiptDetails(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#FAFBF7] border border-[rgba(64,145,108,0.2)] rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Background glow decoration */}
        <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#40916C]/15 rounded-full blur-3xl pointer-events-none" />

        {isSuccess ? (
          <div className="text-center py-4 space-y-5 animate-fade-in-scale">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#1B4332] to-[#40916C] text-white flex items-center justify-center mx-auto shadow-xl shadow-[#40916C]/30 animate-bounce">
              <UtensilsIcon size={36} />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-[#D8F3DC] text-[#1B4332] text-xs font-bold uppercase tracking-wider">
                Impact Verified
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#1B4332]">
                You Just Funded {receiptDetails?.meals} Meals! 🥣
              </h2>
              <p className="text-sm text-[#40916C]/80">
                Your direct contribution of ₹{receiptDetails?.amount} has been logged to the transparent public ledger.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white/80 border border-[rgba(64,145,108,0.15)] text-left text-xs space-y-2 font-mono text-[#1B4332]">
              <div className="flex justify-between">
                <span className="text-gray-500">Transaction ID:</span>
                <span className="font-bold">{receiptDetails?.paymentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Order ID:</span>
                <span>{receiptDetails?.orderId}</span>
              </div>
              {donorEmail && (
                <div className="flex justify-between text-[#40916C]">
                  <span>Receipt Dispatched To:</span>
                  <span className="font-bold">{donorEmail}</span>
                </div>
              )}
            </div>

            <button
              onClick={handleReset}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#1B4332] to-[#40916C] text-white font-bold text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-98 transition-all"
            >
              Done & Return to App
            </button>
          </div>
        ) : (
          <form onSubmit={handleDonate} className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#D8F3DC] text-[#1B4332] text-[10px] font-bold uppercase tracking-wider">
                    Direct Impact Sponsorship
                  </span>
                </div>
                <h2 className="text-2xl font-display font-bold text-[#1B4332]">
                  Sponsor Nutritious Meals
                </h2>
                <p className="text-xs text-[#40916C]/70 mt-0.5">
                  {campaignName ? `Supporting: ${campaignName}` : '100% of funds go towards ground NGO meal distribution'}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 text-sm font-bold transition-all"
              >
                ✕
              </button>
            </div>

            {/* Meal Count Indicator Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#1B4332] to-[#2D6A4F] text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center">
                  <UtensilsIcon size={24} className="text-[#FFD54F]" />
                </div>
                <div>
                  <p className="text-xs text-white/75 font-semibold uppercase tracking-wider">Your Impact</p>
                  <p className="text-2xl font-display font-bold text-white">
                    {currentMeals} Nutritious Meals
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-white/70">Amount</p>
                <p className="text-xl font-display font-bold text-[#FFD54F]">₹{currentAmount}</p>
              </div>
            </div>

            {/* Quick Tiers */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#1B4332] uppercase tracking-wider">
                Select Impact Tier
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {PRESET_TIERS.map((tier) => {
                  const active = !isCustom && selectedAmount === tier.amount;
                  return (
                    <button
                      key={tier.amount}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(tier.amount);
                        setIsCustom(false);
                      }}
                      className={`relative p-3 rounded-2xl border text-left transition-all ${
                        active
                          ? 'border-[#40916C] bg-[#D8F3DC]/40 shadow-sm ring-2 ring-[#40916C]/20'
                          : 'border-[rgba(64,145,108,0.15)] bg-white/70 hover:bg-white'
                      }`}
                    >
                      {tier.popular && (
                        <span className="absolute -top-2 right-3 px-2 py-0.5 rounded-full bg-[#FFD54F] text-[#1B4332] text-[9px] font-bold uppercase">
                          Popular
                        </span>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="font-display font-bold text-base text-[#1B4332]">₹{tier.amount}</span>
                        <span className="text-xs font-bold text-[#40916C]">{tier.meals} Meals</span>
                      </div>
                      <p className="text-[10px] text-gray-500 font-medium mt-0.5">{tier.label}</p>
                    </button>
                  );
                })}
              </div>

              {/* Custom amount toggle */}
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => setIsCustom(!isCustom)}
                  className="text-xs font-bold text-[#40916C] hover:underline flex items-center gap-1"
                >
                  {isCustom ? '← Pick preset amount' : 'Or enter custom amount (₹)'}
                </button>
                {isCustom && (
                  <div className="mt-2">
                    <input
                      type="number"
                      min={25}
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="Enter amount in ₹ (e.g. 1000)"
                      className="w-full px-4 py-2.5 rounded-xl border border-[rgba(64,145,108,0.2)] bg-white text-[#1B4332] font-semibold text-sm outline-none focus:border-[#40916C] focus:ring-2 focus:ring-[#40916C]/10"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Donor Information */}
            <div className="space-y-3 pt-2 border-t border-[rgba(64,145,108,0.1)]">
              <label className="text-xs font-bold text-[#1B4332] uppercase tracking-wider">
                Donor & Receipt Information
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <input
                  type="text"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  placeholder="Full Name"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[rgba(64,145,108,0.15)] bg-white/70 text-xs font-medium text-[#1B4332] outline-none focus:border-[#40916C]"
                />
                <input
                  type="email"
                  value={donorEmail}
                  onChange={(e) => setDonorEmail(e.target.value)}
                  placeholder="Email for Certificate"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[rgba(64,145,108,0.15)] bg-white/70 text-xs font-medium text-[#1B4332] outline-none focus:border-[#40916C]"
                />
              </div>
            </div>

            {/* Security Guarantee */}
            <div className="flex items-center gap-2 text-[11px] text-[#40916C]/80 font-medium">
              <ShieldIcon size={14} className="text-[#40916C]" />
              <span>Secured by Razorpay • Instant Digital Certificate & Email Receipt</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || currentAmount < 25}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#1B4332] to-[#40916C] text-white font-display font-bold text-base shadow-lg shadow-[#40916C]/25 hover:shadow-xl hover:scale-[1.01] active:scale-99 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Connecting Gateway...
                </>
              ) : (
                <>
                  <HeartHandshakeIcon size={20} />
                  Sponsor {currentMeals} Meals (₹{currentAmount})
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
