"use client"

import { useEffect, useState } from "react"
import { ChevronUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  // Function to check scroll position and update button visibility
  const toggleVisibility = () => {
    if (window.scrollY > 200) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }

  // Function to scroll back to top with smooth behavior
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // Add scroll event listener when component mounts
  useEffect(() => {
    window.addEventListener("scroll", toggleVisibility)

    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener("scroll", toggleVisibility)
    }
  }, [])

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 transition-opacity duration-300 ${
        isVisible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="primary"
              size="icon"
              className="h-12 w-12 rounded-full shadow-lg"
              onClick={scrollToTop}
              aria-label="Back to top"
            >
              <ChevronUp className="h-6 w-6" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>返回頂端</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

