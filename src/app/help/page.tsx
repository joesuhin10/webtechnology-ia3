'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart-context';
import {
  HelpCircle,
  ChevronDown,
  MessageSquare,
  Truck,
  CreditCard,
  RotateCcw,
  Package,
  Send,
  Building2,
} from 'lucide-react';

const FAQS = [
  {
    q: 'How long does stationery delivery take?',
    a: 'Standard surface delivery across India takes 2 to 3 business days via our logistics partners BlueDart and DTDC. We also offer Next-Day Priority Express delivery for urgent pre-exam stationery orders placed before 3:00 PM.',
    category: 'Delivery',
  },
  {
    q: 'How can I track my stationery order?',
    a: 'Once your order is dispatched, you receive an SMS and WhatsApp tracking update. You can also visit /track/[orderId] or click "Track Live Delivery" in your Account Orders dashboard to view real-time transit milestones.',
    category: 'Orders',
  },
  {
    q: 'How do I return an item or request a refund?',
    a: 'We offer a 7-day hassle-free return guarantee for damaged, defective, or incorrect stationery items. Simply navigate to your Account > My Orders > click "Return Item", specify the reason, and our courier will pick it up at no cost.',
    category: 'Returns',
  },
  {
    q: 'Do you offer Cash on Delivery (COD)?',
    a: 'Yes! Cash on Delivery is available across 19,000+ Indian pincodes. You can also pay via instant UPI QR scan to the delivery agent upon receiving your package.',
    category: 'Payment',
  },
  {
    q: 'How can I cancel an order?',
    a: 'You can cancel any pending order with a single click from your Account dashboard before it is packed. When you cancel, any redeemed SmartPoints and coupon codes are immediately restored to your balance.',
    category: 'Orders',
  },
  {
    q: 'How do I apply a discount coupon code?',
    a: 'On the Cart page or Checkout review screen, enter your promo code (e.g. STUDENT15 or WELCOME10) in the "Apply Promo Coupon" box and click Apply. The discount will instantly deduct from your cart total.',
    category: 'Coupons',
  },
  {
    q: 'How do I place bulk orders for schools or offices?',
    a: 'Visit our dedicated Bulk Orders page (/bulk-orders) to submit your required product quantities. We offer tiered wholesale volume pricing up to 25% off MRP, customized student kit packing, and official GST invoices.',
    category: 'Bulk Orders',
  },
];

export default function HelpPage() {
  const { addToast } = useCart();
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [chatMessages, setChatMessages] = useState<{ sender: 'bot' | 'user'; text: string }[]>([
    {
      sender: 'bot',
      text: 'Hello! I am SmartStation Bot 🤖. Ask me anything about your pens, notebooks, orders or exam kits.',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setChatMessages((prev) => [...prev, { sender: 'user', text: userText }]);
    setChatInput('');

    setTimeout(() => {
      let botReply =
        'Thank you for reaching out! Our stationery experts are active 9 AM – 9 PM. For immediate tracking updates, visit your Account Orders page.';
      const lower = userText.toLowerCase();

      if (lower.includes('deliver') || lower.includes('shipping') || lower.includes('time')) {
        botReply =
          'Standard delivery takes 2-3 business days across India. Express next-day delivery is also available at checkout!';
      } else if (lower.includes('track') || lower.includes('order')) {
        botReply =
          'You can track your order live anytime by entering your Order ID on our Track Order screen.';
      } else if (lower.includes('return') || lower.includes('refund')) {
        botReply =
          'We have a 7-day hassle-free replacement policy! Request a return from your Account > My Orders screen.';
      } else if (lower.includes('coupon') || lower.includes('discount')) {
        botReply =
          'Use code STUDENT15 for 15% off orders above ₹499, or WELCOME10 for 10% off your first purchase!';
      }

      setChatMessages((prev) => [...prev, { sender: 'bot', text: botReply }]);
    }, 600);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-3 py-1 rounded-full mb-3 inline-block">
            Support & Help Desk
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1D3557] tracking-tight">
            How can we help your study desk?
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Find quick answers to common stationery ordering questions or chat live with our support bot.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* FAQ Accordion (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs">
            <h2 className="text-lg font-extrabold text-slate-900 mb-6 flex items-center gap-2">
              <HelpCircle className="w-5 h-5 text-amber-600" />
              <span>Frequently Asked Questions</span>
            </h2>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div
                    key={idx}
                    className="border border-slate-200/80 rounded-2xl overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-slate-900 hover:bg-slate-50 transition-colors"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform ${
                          isOpen ? 'rotate-180 text-amber-600' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="p-4 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Live Support Chat Drawer simulation (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col h-[520px]">
            {/* Chat Header */}
            <div className="bg-[#1D3557] text-white p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 font-bold flex items-center justify-center text-sm">
                🤖
              </div>
              <div>
                <p className="text-xs font-bold">SmartStation Assistant</p>
                <p className="text-[10px] text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Online · Answers instantly
                </p>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 text-xs">
              {chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-slate-900 text-white rounded-br-none'
                        : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-2xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChat} className="p-3 bg-white border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Ask about delivery, coupons, kits..."
                className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-amber-500"
              />
              <button
                type="submit"
                className="p-2 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-xl transition-colors"
                title="Send"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
