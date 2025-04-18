"use client"

import type React from "react"

import { useEffect } from "react"
import { Plane } from "lucide-react"

interface SidebarProps {
  items: {
    name: string
    ref: React.RefObject<HTMLElement>
  }[]
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
}

export function Sidebar({ items, isOpen, setIsOpen }: SidebarProps) {
  // Function to handle smooth scrolling
  const scrollToSection = (ref: React.RefObject<HTMLElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" })
      // Close sidebar on mobile after clicking a navigation item
      if (window.innerWidth < 768) {
        setIsOpen(false)
      }
    }
  }

  // Close sidebar when pressing escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [setIsOpen])

  // Prevent scrolling when sidebar is open on mobile
  useEffect(() => {
    if (isOpen && window.innerWidth < 768) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 z-10 bg-black/50 transition-opacity duration-300 md:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsOpen(false)}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-16 left-0 z-20 h-[calc(100vh-4rem)] w-64 transform border-r bg-background p-4 transition-all duration-300 ease-in-out md:sticky md:translate-x-0 ${
          isOpen ? "translate-x-0 shadow-lg" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="mb-4 flex items-center gap-2">
            <Plane className="h-5 w-5 text-primary" />
            <span className="font-medium">Navigation</span>
          </div>
          <nav className="space-y-1">
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => scrollToSection(item.ref)}
                className="w-full rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                {item.name}
              </button>
            ))}
          </nav>
        </div>
      </aside>
    </>
  )
}

