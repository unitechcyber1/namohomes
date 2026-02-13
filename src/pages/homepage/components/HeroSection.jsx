import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import SearchInterface from '../../../components/ui/SearchInterface';
import Image from '../../../components/AppImage';
import { INDIAN_SEARCH_TAGS } from '../../../utils/indianFormatters';
import residentialImg from '../../../assets/residential-image.jpg';
import commercialImg from '../../../assets/commercial-image.jpg';

const HeroSection = ({ onSearch }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroImages = [
    { url: commercialImg, alt: "Modern luxury home exterior" },
    { url: residentialImg, alt: "Beautiful residential neighborhood" },
    {
      url: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg?auto=compress&cs=tinysrgb&w=2070&q=80",
      alt: "Contemporary home with garden"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  return (
    <section className="relative h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden">
      {/* Background Image Carousel */}
      <div className="absolute inset-0">
        {heroImages?.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0 }}
            animate={{ opacity: index === currentSlide ? 1 : 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <Image
              src={image?.url}
              alt={image?.alt}
              className="w-full h-full object-cover"
            />
          </motion.div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          
          {/* Heading */}
          <motion.div
            className="text-center text-white mb-8 lg:mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 lg:mb-6 font-heading"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2 }}
            >
              Find Your Dream Property in Gurgaon
            </motion.h1>

            <motion.p
              className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4 }}
            >
              Discover flats, houses, villas and commercial properties in Gurgaon.
              Your perfect home is just a search away.
            </motion.p>
          </motion.div>

          {/* Search */}
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.6 }}
          >
            <SearchInterface variant="hero" onSearch={onSearch} />
          </motion.div>

          {/* Tags */}
          <motion.div
            className="flex flex-wrap justify-center gap-3 mt-8"
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: { staggerChildren: 0.07, delayChildren: 0.8 }
              }
            }}
          >
            {INDIAN_SEARCH_TAGS?.map((tag) => (
              <motion.button
                key={tag}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 }
                }}
                onClick={() => onSearch({ query: tag })}
                className="px-4 py-2 bg-white/20 backdrop-blur-sm text-white rounded-full text-sm
                         hover:bg-white/30 transition-all border border-white/30"
              >
                {tag}
              </motion.button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Indicators */}
      <motion.div
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        {heroImages?.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentSlide ? 'bg-white scale-110' : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </motion.div>
    </section>
  );
};

export default HeroSection;
