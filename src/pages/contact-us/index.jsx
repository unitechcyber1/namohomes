import React, { useState } from "react";
import Icon from "../../components/AppIcon";
import Header from "../../components/ui/Header";
import Footer from "../homepage/components/Footer";
import SEO from "../../components/SEO";
import FooterSeoContent from "../../components/FooterSeoContent";
import { sendContactLead } from "../../service/contactService";

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[\d\s\-\+\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    if (!formData.message.trim()) newErrors.message = "Message is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await sendContactLead({
        source: "contact-us",
        ...formData,
      });
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO />
      <Header />

      <main className="pt-16 lg:pt-18">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="max-w-3xl mb-8">
            <p className="text-sm font-medium text-primary mb-2 uppercase tracking-wide">
              Get in touch
            </p>
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-text-primary mb-4">
              Contact NamoHomes
            </h1>
            <p className="text-text-secondary text-sm md:text-base">
              Have questions about a property, partnership, or our services?
              Send us a message and our team will get back to you within one
              business day.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact form */}
            <div className="lg:col-span-2">
              <div className="card bg-surface border border-border rounded-xl shadow-elevation-1">
                {isSubmitted ? (
                  <div className="p-6 md:p-8 text-center">
                    <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
                      <Icon name="Check" size={32} className="text-white" />
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-2">
                      Thank you for reaching out!
                    </h2>
                    <p className="text-text-secondary">
                      We have received your message and will contact you soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 ${
                            errors.name
                              ? "border-error"
                              : "border-border focus:border-primary"
                          }`}
                          placeholder="Enter your full name"
                        />
                        {errors.name && (
                          <p className="mt-1 text-sm text-error">{errors.name}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-text-primary mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 ${
                            errors.email
                              ? "border-error"
                              : "border-border focus:border-primary"
                          }`}
                          placeholder="your.email@example.com"
                        />
                        {errors.email && (
                          <p className="mt-1 text-sm text-error">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 ${
                          errors.phone
                            ? "border-error"
                            : "border-border focus:border-primary"
                        }`}
                        placeholder="+91 98730 40405"
                      />
                      {errors.phone && (
                        <p className="mt-1 text-sm text-error">{errors.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-text-primary mb-2">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 resize-none ${
                          errors.message
                            ? "border-error"
                            : "border-border focus:border-primary"
                        }`}
                        placeholder="Tell us how we can help you..."
                      />
                      {errors.message && (
                        <p className="mt-1 text-sm text-error">{errors.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md text-sm font-semibold transition-all duration-200 ${
                        isSubmitting
                          ? "bg-secondary text-text-secondary cursor-not-allowed"
                          : "bg-primary text-white hover:bg-primary-700"
                      }`}
                    >
                      {isSubmitting ? (
                        <>
                          <Icon
                            name="Loader2"
                            size={16}
                            className="animate-spin"
                          />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Icon name="Send" size={16} />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Company info */}
            <aside className="space-y-6">
              <div className="card bg-surface border border-border rounded-xl p-6 shadow-elevation-1">
                <h2 className="text-lg font-semibold text-text-primary mb-4">
                  Office Address
                </h2>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  Phase 1 Metro Station,
                  <br />
                  Golf Course Road,
                  <br />
                  Gurugram, Haryana 122002
                </p>
                <div className="space-y-2 text-sm text-text-secondary">
                  <p className="flex items-center gap-2">
                    <Icon name="Phone" size={16} />
                    <a href="tel:+919873040405" className="hover:text-primary">
                      +91 98730 40405
                    </a>
                  </p>
                  <p className="flex items-center gap-2">
                    <Icon name="Mail" size={16} />
                    <a
                      href="mailto:namohomes@outlook.com"
                      className="hover:text-primary"
                    >
                      namohomes@outlook.com
                    </a>
                  </p>
                  <p className="flex items-center gap-2">
                    <Icon name="Globe" size={16} />
                    <span>www.namohomes.com</span>
                  </p>
                </div>
              </div>

              <div className="card bg-secondary-50 border border-border rounded-xl p-6">
                <h3 className="text-sm font-semibold text-text-primary mb-2">
                  Working Hours
                </h3>
                <p className="text-sm text-text-secondary">
                  Monday – Saturday: 9:30 AM – 7:00 PM
                  <br />
                  Sunday: By appointment only
                </p>
              </div>
            </aside>
          </div>
        </div>
      </main>
      <FooterSeoContent />
      <Footer />
    </div>
  );
};

export default ContactUsPage;

