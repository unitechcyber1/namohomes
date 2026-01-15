// react
import { useState } from "react"
import { Menu, X } from "lucide-react"

// assets
import logo from "../assets/logo.png"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur ">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-13 sm:h-14 items-center justify-between">
          
          {/* Logo */}
          <a href="/" className="flex items-center">
            <img
              src={logo}
              alt="NamoHomes"
              className="h-8 sm:h-10 w-auto object-contain"
            />
          </a>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="/" className="text-gray-700 hover:text-indigo-600 transition">
              New Launch Projects
            </a>
            <a href="#cities" className="text-gray-700 hover:text-indigo-600 transition">
              SCO Plots
            </a>
            <a href="#how-it-works" className="text-gray-700 hover:text-indigo-600 transition">
              Best Projects
            </a>
            <a href="#contact" className="text-gray-700 hover:text-indigo-600 transition">
              Contact Us
            </a>

          
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t py-4">
            <div className="flex flex-col gap-4 text-sm font-medium">
              <a href="/" className="text-gray-700 hover:text-indigo-600">
                Home
              </a>
              <a href="#cities" className="text-gray-700 hover:text-indigo-600">
                Cities
              </a>
              <a href="#how-it-works" className="text-gray-700 hover:text-indigo-600">
                How It Works
              </a>
              <a href="#contact" className="text-gray-700 hover:text-indigo-600">
                Contact
              </a>

            
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
