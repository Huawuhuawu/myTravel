"use client"

import { useRef, useState, useEffect } from "react"
import { Facebook, Instagram, MapPin, Twitter } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { BackToTop } from "@/components/back-to-top"
import { Topbar } from "@/components/topbar"
import { Sidebar } from "@/components/sidebar"

// Generate stable weather data
function generateWeatherData() {
  // Use fixed seed values instead of random
  const currentWeather = {
    temperature: "28°C",
    rainfall: "0mm",
    windSpeed: "12km/h",
  }

  const hourlyForecast = Array.from({ length: 24 }, (_, i) => {
    // Use deterministic values based on hour
    const tempBase = 20 + (i % 10)
    return {
      hour: i,
      icon: "/placeholder.svg?height=50&width=50",
      temperature: `${tempBase}°C`,
      description: i % 2 === 0 ? "Sunny" : "Partly Cloudy",
    }
  })

  const dailyForecast = [
    { day: "Mon", rainProb: "20%", highTemp: "29°C", lowTemp: "18°C", rainfall: "0mm" },
    { day: "Tue", rainProb: "30%", highTemp: "28°C", lowTemp: "17°C", rainfall: "2mm" },
    { day: "Wed", rainProb: "10%", highTemp: "30°C", lowTemp: "19°C", rainfall: "0mm" },
    { day: "Thu", rainProb: "40%", highTemp: "27°C", lowTemp: "16°C", rainfall: "5mm" },
    { day: "Fri", rainProb: "25%", highTemp: "29°C", lowTemp: "18°C", rainfall: "1mm" },
  ]

  return { currentWeather, hourlyForecast, dailyForecast }
}

// Generate stable attraction data
function generateAttractions() {
  return Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    name: `Attraction ${i + 1}`,
    image: `/placeholder.svg?height=150&width=250`,
    link: "#",
  }))
}

// Generate stable itinerary data
function generateItineraryData() {
  return {
    day1: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      activity: i >= 8 && i <= 22 ? `Activity at ${i}:00` : "",
      time: i >= 8 && i <= 22 ? `${i}:00 - ${i + 1}:00` : "",
    })),
    day2: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      activity: i >= 9 && i <= 21 ? `Activity at ${i}:00` : "",
      time: i >= 9 && i <= 21 ? `${i}:00 - ${i + 1}:00` : "",
    })),
    day3: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      activity: i >= 7 && i <= 23 ? `Activity at ${i}:00` : "",
      time: i >= 7 && i <= 23 ? `${i}:00 - ${i + 1}:00` : "",
    })),
  }
}

export default function Home() {
  // State for sidebar visibility
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Use localStorage to persist data between refreshes
  const [weatherData, setWeatherData] = useState(() => {
    // Check if we're in the browser and if data exists in localStorage
    if (typeof window !== "undefined") {
      const savedData = localStorage.getItem("weatherData")
      if (savedData) {
        return JSON.parse(savedData)
      }
    }
    return generateWeatherData()
  })

  const [attractions] = useState(generateAttractions)
  const [itineraryData] = useState(generateItineraryData)

  // Save weather data to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("weatherData", JSON.stringify(weatherData))
    }
  }, [weatherData])

  // Refs for smooth scrolling
  const weatherRef = useRef<HTMLDivElement>(null)
  const attractionsRef = useRef<HTMLDivElement>(null)
  const itineraryRef = useRef<HTMLDivElement>(null)
  const notesRef = useRef<HTMLDivElement>(null)

  const navItems = [
    { name: "Weather Check", ref: weatherRef },
    { name: "Attraction Recommendations", ref: attractionsRef },
    { name: "Itinerary Planning", ref: itineraryRef },
    { name: "Travel Notes", ref: notesRef },
  ]

  // Destructure weather data for easier access
  const { currentWeather, hourlyForecast, dailyForecast } = weatherData

  return (
    <div className="flex min-h-screen flex-col">
      <Topbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} isSidebarOpen={sidebarOpen} />
      <div className="flex flex-1 pt-16">
        <Sidebar items={navItems} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {/* Weather Check Section */}
          <section ref={weatherRef} id="weather" className="mb-12 scroll-mt-16 pt-4">
            <h2 className="mb-6 text-2xl font-bold">Weather Check</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Card className="p-4">
                <h3 className="mb-2 font-medium">Temperature</h3>
                <p className="text-2xl font-bold">{currentWeather.temperature}</p>
              </Card>
              <Card className="p-4">
                <h3 className="mb-2 font-medium">Rainfall</h3>
                <p className="text-2xl font-bold">{currentWeather.rainfall}</p>
              </Card>
              <Card className="p-4">
                <h3 className="mb-2 font-medium">Wind Speed</h3>
                <p className="text-2xl font-bold">{currentWeather.windSpeed}</p>
              </Card>
            </div>

            <h3 className="mb-4 mt-8 text-xl font-medium">24-Hour Forecast</h3>
            <div className="mb-8">
              {/* Mobile view (scrollable or grid toggle) */}
              <div className="block md:hidden">
                <Tabs defaultValue="scroll" className="w-auto">
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">24-hour forecast</span>
                    <TabsList className="h-8 w-auto">
                      <TabsTrigger value="scroll" className="h-7 px-2 text-xs">
                        Scroll
                      </TabsTrigger>
                      <TabsTrigger value="grid" className="h-7 px-2 text-xs">
                        Grid
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="scroll" className="mt-0">
                    <div className="overflow-x-auto">
                      <div className="flex min-w-max gap-2 pb-2">
                        {hourlyForecast.map((hour) => (
                          <div key={hour.hour} className="flex w-[4.5rem] flex-col items-center rounded-lg border p-2">
                            <span className="text-sm font-medium">{hour.hour}:00</span>
                            <Image src={hour.icon || "/placeholder.svg"} alt="Weather icon" width={40} height={40} />
                            <span className="text-sm">{hour.temperature}</span>
                            <span className="text-xs text-muted-foreground">{hour.description}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="grid" className="mt-0">
                    <div className="grid grid-cols-6 gap-1">
                      {hourlyForecast.slice(0, 6).map((hour) => (
                        <div key={hour.hour} className="flex flex-col items-center rounded-lg border p-1">
                          <span className="text-xs font-medium">{hour.hour}:00</span>
                          <Image src={hour.icon || "/placeholder.svg"} alt="Weather icon" width={30} height={30} />
                          <span className="text-xs">{hour.temperature}</span>
                          <span className="text-[10px] text-muted-foreground">{hour.description}</span>
                        </div>
                      ))}
                      {hourlyForecast.slice(6, 12).map((hour) => (
                        <div key={hour.hour} className="flex flex-col items-center rounded-lg border p-1">
                          <span className="text-xs font-medium">{hour.hour}:00</span>
                          <Image src={hour.icon || "/placeholder.svg"} alt="Weather icon" width={30} height={30} />
                          <span className="text-xs">{hour.temperature}</span>
                          <span className="text-[10px] text-muted-foreground">{hour.description}</span>
                        </div>
                      ))}
                      {hourlyForecast.slice(12, 18).map((hour) => (
                        <div key={hour.hour} className="flex flex-col items-center rounded-lg border p-1">
                          <span className="text-xs font-medium">{hour.hour}:00</span>
                          <Image src={hour.icon || "/placeholder.svg"} alt="Weather icon" width={30} height={30} />
                          <span className="text-xs">{hour.temperature}</span>
                          <span className="text-[10px] text-muted-foreground">{hour.description}</span>
                        </div>
                      ))}
                      {hourlyForecast.slice(18, 24).map((hour) => (
                        <div key={hour.hour} className="flex flex-col items-center rounded-lg border p-1">
                          <span className="text-xs font-medium">{hour.hour}:00</span>
                          <Image src={hour.icon || "/placeholder.svg"} alt="Weather icon" width={30} height={30} />
                          <span className="text-xs">{hour.temperature}</span>
                          <span className="text-[10px] text-muted-foreground">{hour.description}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Tablet view (2 rows of 12) */}
              <div className="hidden md:block lg:hidden">
                <div className="grid grid-cols-12 gap-1">
                  {hourlyForecast.slice(0, 12).map((hour) => (
                    <div key={hour.hour} className="flex flex-col items-center rounded-lg border p-2">
                      <span className="text-sm font-medium">{hour.hour}:00</span>
                      <Image src={hour.icon || "/placeholder.svg"} alt="Weather icon" width={40} height={40} />
                      <span className="text-sm">{hour.temperature}</span>
                      <span className="text-xs text-muted-foreground">{hour.description}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-1 grid grid-cols-12 gap-1">
                  {hourlyForecast.slice(12, 24).map((hour) => (
                    <div key={hour.hour} className="flex flex-col items-center rounded-lg border p-2">
                      <span className="text-sm font-medium">{hour.hour}:00</span>
                      <Image src={hour.icon || "/placeholder.svg"} alt="Weather icon" width={40} height={40} />
                      <span className="text-sm">{hour.temperature}</span>
                      <span className="text-xs text-muted-foreground">{hour.description}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop view (single row) */}
              <div className="hidden lg:block">
                <div className="grid grid-cols-24 gap-1">
                  {hourlyForecast.map((hour) => (
                    <div key={hour.hour} className="flex flex-col items-center rounded-lg border p-2">
                      <span className="text-sm font-medium">{hour.hour}:00</span>
                      <Image src={hour.icon || "/placeholder.svg"} alt="Weather icon" width={45} height={45} />
                      <span className="text-sm">{hour.temperature}</span>
                      <span className="text-xs text-muted-foreground">{hour.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <h3 className="mb-4 text-xl font-medium">5-Day Forecast</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-5">
              {dailyForecast.map((day, index) => (
                <Card key={index} className="p-4">
                  <h4 className="mb-2 font-medium">{day.day}</h4>
                  <div className="space-y-1 text-sm">
                    <p>Rain: {day.rainProb}</p>
                    <p>High: {day.highTemp}</p>
                    <p>Low: {day.lowTemp}</p>
                    <p>Rainfall: {day.rainfall}</p>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Attraction Recommendations Section */}
          <section ref={attractionsRef} id="attractions" className="mb-12 scroll-mt-16 pt-4">
            <h2 className="mb-6 text-2xl font-bold">Attraction Recommendations</h2>
            <div className="space-y-4">
              {attractions.map((attraction) => (
                <div key={attraction.id} className="flex flex-col gap-4 rounded-lg border p-4 sm:flex-row">
                  <div className="shrink-0">
                    <Image
                      src={attraction.image || "/placeholder.svg"}
                      alt={attraction.name}
                      width={250}
                      height={150}
                      className="rounded-lg"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <h3 className="text-xl font-medium">{attraction.name}</h3>
                    <Button asChild variant="outline" className="w-fit">
                      <a href={attraction.link} target="_blank" rel="noopener noreferrer">
                        View Details
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Itinerary Planning Section */}
          <section ref={itineraryRef} id="itinerary" className="mb-12 scroll-mt-16 pt-4">
            <h2 className="mb-6 text-2xl font-bold">Itinerary Planning</h2>
            <Tabs defaultValue="day1">
              <TabsList className="mb-4">
                <TabsTrigger value="day1">Day 1</TabsTrigger>
                <TabsTrigger value="day2">Day 2</TabsTrigger>
                <TabsTrigger value="day3">Day 3</TabsTrigger>
              </TabsList>

              {["day1", "day2", "day3"].map((day, dayIndex) => (
                <TabsContent key={day} value={day} className="overflow-x-auto">
                  <div className="min-w-max">
                    {itineraryData[day as keyof typeof itineraryData]
                      .filter((item) => item.activity)
                      .map((item, i) => (
                        <div key={i} className="mb-2 flex items-start gap-2 rounded-lg border p-3">
                          <MapPin className="mt-1 h-5 w-5 shrink-0 text-primary" />
                          <div className="flex-1">
                            <p className="font-medium">{item.activity}</p>
                            <p className="text-sm text-muted-foreground">{item.time}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </section>

          {/* Travel Notes Section */}
          <section ref={notesRef} id="notes" className="mb-12 scroll-mt-16 pt-4">
            <h2 className="mb-6 text-2xl font-bold">Travel Notes</h2>
            <Textarea placeholder="Share your thoughts here" className="mb-4 min-h-32" />
            <div className="flex gap-2">
              <Button variant="outline" size="icon">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Share on Facebook</span>
              </Button>
              <Button variant="outline" size="icon">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Share on Instagram</span>
              </Button>
              <Button variant="outline" size="icon">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Share on X (Twitter)</span>
              </Button>
            </div>
          </section>
        </main>
      </div>

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  )
}

