"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { ChevronDown } from "lucide-react"

const CATEGORIES = [
  "Residential",
  "Military",
  "Mechanical Works",
  "PEB Buildings",
  "Highways",
  "Educational",
  "Sports",
  "Religious",
]

export function ProjectsNav({ scrolled }: { scrolled?: boolean }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative group" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className={`text-sm font-bold hover:text-primary transition-colors flex items-center gap-1 tracking-wide font-heading uppercase ${scrolled ? "text-foreground dark:text-white" : "text-white"}`}
      >
        PROJECTS UNDERTAKEN
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Desktop Dropdown */}
      <div
        className={`hidden md:block absolute left-0 mt-4 w-56 bg-card border border-white/10 rounded-sm shadow-xl transition-all duration-300 transform origin-top ${isDropdownOpen ? "opacity-100 scale-100 visible" : "opacity-0 scale-95 invisible"
          }`}
      >
        {CATEGORIES.map((category) => (
          <Link
            key={category}
            href={`/projects/category/${encodeURIComponent(category)}`}
            className="block px-6 py-3 text-sm text-gray-300 hover:text-primary hover:bg-white/5 transition-colors font-sans border-b border-white/5 last:border-0"
            onClick={() => setIsDropdownOpen(false)}
          >
            {category}
          </Link>
        ))}
      </div>

      {/* Mobile Dropdown */}
      {isDropdownOpen && (
        <div className="md:hidden mt-2 ml-4 border-l border-white/10 pl-4 space-y-1">
          {CATEGORIES.map((category) => (
            <Link
              key={category}
              href={`/projects/category/${encodeURIComponent(category)}`}
              className="block py-2 text-sm text-gray-400 hover:text-primary transition-colors font-sans"
              onClick={() => setIsDropdownOpen(false)}
            >
              {category}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
