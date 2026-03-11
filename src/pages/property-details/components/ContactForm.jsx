// src/pages/property-details/components/ContactForm.jsx
import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import { sendContactLead } from "../../../service/contactService";

const ContactForm = ({ property, agent, variant = "modal", onClose }) => {
  const isModal = variant === "modal";
  const idPrefix = isModal ? "contact-modal" : "contact-inline";

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `I'm interested in ${property?.title} at ${property?.address}. Please contact me to schedule a viewing or provide more information.`,
    contactMethod: "email",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

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

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await sendContactLead({
        source: "property-details",
        propertyId: property?._id,
        propertyTitle: property?.title,
        propertyAddress: property?.address,
        agentName: agent?.name,
        ...formData,
      });

      setIsSubmitted(true);

      if (isModal && onClose) {
        setTimeout(() => onClose(), 3000);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setErrors((prev) => ({
        ...prev,
        submit: "Something went wrong. Please try again.",
      }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && onClose) onClose();
  };

  const formContent = (
    <>
      {isSubmitted ? (
        <div className="p-6 md:p-8 text-center">
          <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Check" size={32} className="text-white" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-2">
            Message Sent Successfully!
          </h2>
          <p className="text-text-secondary mb-6">
            Thank you for your interest. {agent?.name} will contact you within 24 hours.
          </p>
          {onClose && (
            <button
              onClick={onClose}
              className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-700 transition-all duration-200"
            >
              Close
            </button>
          )}
        </div>
      ) : (
        <>
          <div className={`flex items-center justify-between p-4 md:p-6 border-b border-border ${!isModal ? "rounded-t-lg" : ""}`}>
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-text-primary mb-1">
                Interested in This Property?
              </h2>
              <p className="text-text-secondary text-sm">
                Fill in your details to receive a personalized quote and expert assistance.
              </p>
            </div>
            {isModal && onClose && (
              <button
                onClick={onClose}
                className="flex-shrink-0 w-8 h-8 rounded-full hover:bg-secondary-100 transition flex items-center justify-center"
                aria-label="Close form"
              >
                <Icon name="X" size={20} />
              </button>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-4 md:p-6 space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label htmlFor={`${idPrefix}-name`} className="block text-sm font-medium text-text-primary mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id={`${idPrefix}-name`}
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 ${
                    errors.name ? "border-error" : "border-border focus:border-primary"
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && <p className="mt-1 text-sm text-error">{errors.name}</p>}
              </div>
              <div>
                <label htmlFor={`${idPrefix}-email`} className="block text-sm font-medium text-text-primary mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id={`${idPrefix}-email`}
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 ${
                    errors.email ? "border-error" : "border-border focus:border-primary"
                  }`}
                  placeholder="your.email@example.com"
                />
                {errors.email && <p className="mt-1 text-sm text-error">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label htmlFor={`${idPrefix}-phone`} className="block text-sm font-medium text-text-primary mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                id={`${idPrefix}-phone`}
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all duration-200 ${
                  errors.phone ? "border-error" : "border-border focus:border-primary"
                }`}
                placeholder="+91 9999999999"
              />
              {errors.phone && <p className="mt-1 text-sm text-error">{errors.phone}</p>}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 flex items-center justify-center space-x-2 px-6 py-3 rounded-md transition-all duration-200 ${
                  isSubmitting
                    ? "bg-secondary text-text-secondary cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primary-700"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <Icon name="Loader2" size={16} className="animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Icon name="Send" size={16} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-xs text-text-secondary bg-secondary-100 p-3 rounded-md">
              <Icon name="Info" size={12} className="inline mr-1" />
              Your information will only be shared with the listing agent and will not be used for marketing purposes.
            </div>
          </form>
        </>
      )}
    </>
  );

  const loadingOverlay = isSubmitting && (
    <div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 rounded-lg bg-surface/80 backdrop-blur-sm"
      aria-live="polite"
      aria-busy="true"
    >
      <Icon name="Loader2" size={40} className="animate-spin text-primary" />
      <span className="text-sm font-medium text-text-primary">Sending your message...</span>
    </div>
  );

  if (isModal) {
    return (
      <div
        className="fixed inset-0 bg-black/50 z-modal flex items-center justify-center p-4"
        onClick={handleOverlayClick}
      >
        <div className="relative bg-surface rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {formContent}
          {loadingOverlay}
        </div>
      </div>
    );
  }

  return (
    <div className="card overflow-hidden bg-surface relative">
      {formContent}
      {loadingOverlay}
    </div>
  );
};

export default ContactForm;
