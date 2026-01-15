import { useState, useEffect } from "react";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroImages = [
    {
      url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
      alt: "Modern luxury home exterior",
    },
    {
      url: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg",
      alt: "Beautiful residential neighborhood",
    },
  ];

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
      
      {/* Background Images */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image.url}
              alt={image.alt}
              className="h-full w-full object-cover"
            />
          </div>
        ))}

        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full items-center">
        <div className="mx-auto max-w-7xl px-4 text-center text-white">
          <h1 className="mb-6 text-4xl font-bold md:text-5xl lg:text-6xl">
            Find Your Dream Property in India
          </h1>

          <p className="mx-auto mb-10 max-w-3xl text-lg text-white/90 md:text-xl">
            Discover flats, houses, villas and commercial properties across
            major Indian cities. Your perfect home is just a search away.
          </p>

          {/* CTA */}
          <div className="flex justify-center gap-4">
            <button className="rounded-lg bg-indigo-600 px-8 py-3 font-semibold text-white hover:bg-indigo-700 transition">
              Explore Properties
            </button>
            <button className="rounded-lg border border-white/60 px-8 py-3 font-semibold text-white hover:bg-white hover:text-black transition">
              List Your Property
            </button>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-6 left-1/2 z-20 flex -translate-x-1/2 gap-2">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-3 w-3 rounded-full transition ${
              index === currentSlide
                ? "bg-white scale-110"
                : "bg-white/50 hover:bg-white"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
