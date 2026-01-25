import React, { useState } from 'react';
// import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';
import { MessageCircle, Phone, Send, CheckCircle, ArrowRight } from 'lucide-react';
import  Button  from '../../../components/ui/button';
import  Input  from '../../../components/ui/input';
import  Textarea from '../../../components/ui/textarea';
import { toast } from 'sonner';

export default function LeadCapture() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const urlParams = new URLSearchParams(window.location.search);
    
    // await base44.entities.Lead.create({
    //   ...formData,
    //   source: 'website',
    //   utm_source: urlParams.get('utm_source') || '',
    //   utm_medium: urlParams.get('utm_medium') || '',
    //   utm_campaign: urlParams.get('utm_campaign') || '',
    //   page_url: window.location.href
    // });
    
    setLoading(false);
    setSubmitted(true);
    toast.success('Thank you! We will contact you soon.');
  };

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=80"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 to-slate-900/85" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-amber-400 font-medium mb-4 block">Get Started Today</span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Find Your
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-500">
                Perfect Property?
              </span>
            </h2>
            <p className="text-lg text-slate-300 mb-8">
              Share your requirements and our property experts will help you find the best options matching your needs and budget.
            </p>

            {/* Quick Contact Options */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="https://wa.me/919873040405?text=Hi, I'm interested in properties on NamoHomes"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-4 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                WhatsApp Us
              </a>
              <a 
                href="tel:+919873040405"
                className="flex items-center justify-center gap-2 px-6 py-4 bg-white/10 hover:bg-white/20 text-white rounded-xl font-medium transition-colors border border-white/20"
              >
                <Phone className="w-5 h-5" />
                +91 98730 40405
              </a>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white rounded-2xl p-8 shadow-2xl">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h3>
                  <p className="text-slate-600 mb-6">
                    Our team will contact you within 24 hours.
                  </p>
                  <Button 
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({ name: '', phone: '', email: '', message: '' });
                    }}
                    variant="outline"
                  >
                    Submit Another Enquiry
                  </Button>
                </div>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">Quick Enquiry</h3>
                  <p className="text-slate-600 mb-6">Fill in your details and we'll get back to you.</p>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <Input 
                      placeholder="Your Name *"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="h-12"
                    />
                    <Input 
                      placeholder="Phone Number *"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                      className="h-12"
                    />
                    <Input 
                      placeholder="Email Address"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="h-12"
                    />
                    <Textarea 
                      placeholder="Your Requirements (Optional)"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      rows={3}
                    />
                    <Button 
                      type="submit" 
                      disabled={loading}
                      className="w-full h-12 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Submitting...
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Send className="w-5 h-5" />
                          Submit Enquiry
                        </span>
                      )}
                    </Button>
                  </form>
                  
                  <p className="text-xs text-slate-500 text-center mt-4">
                    By submitting, you agree to our privacy policy.
                  </p>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}