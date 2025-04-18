document.addEventListener("DOMContentLoaded", () => {
  // Weather data (fixed values to ensure consistency)
  const weatherData = {
    hourlyForecast: Array.from({ length: 24 }, (_, i) => {
      // Use deterministic values based on hour
      const tempBase = 20 + (i % 10)
      return {
        hour: i,
        icon: "https://placehold.co/50x50",
        temperature: `${tempBase}°C`,
        description: i % 2 === 0 ? "Sunny" : "Partly Cloudy",
      }
    }),
    dailyForecast: [
      { day: "Mon", rainProb: "20%", highTemp: "29°C", lowTemp: "18°C", rainfall: "0mm" },
      { day: "Tue", rainProb: "30%", highTemp: "28°C", lowTemp: "17°C", rainfall: "2mm" },
      { day: "Wed", rainProb: "10%", highTemp: "30°C", lowTemp: "19°C", rainfall: "0mm" },
      { day: "Thu", rainProb: "40%", highTemp: "27°C", lowTemp: "16°C", rainfall: "5mm" },
      { day: "Fri", rainProb: "25%", highTemp: "29°C", lowTemp: "18°C", rainfall: "1mm" },
    ],
  }

  // Attractions data
  const attractions = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    name: `Attraction ${i + 1}`,
    image: "https://placehold.co/250x150",
    link: "#",
  }))

  // Itinerary data
  const itineraryData = {
    day1: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      activity: i >= 8 && i <= 22 ? `Activity at ${i}:00` : "",
      time: i >= 8 && i <= 22 ? `${i}:00 - ${i + 1}:00` : "",
    })).filter((item) => item.activity),
    day2: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      activity: i >= 9 && i <= 21 ? `Activity at ${i}:00` : "",
      time: i >= 9 && i <= 21 ? `${i}:00 - ${i + 1}:00` : "",
    })).filter((item) => item.activity),
    day3: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      activity: i >= 7 && i <= 23 ? `Activity at ${i}:00` : "",
      time: i >= 7 && i <= 23 ? `${i}:00 - ${i + 1}:00` : "",
    })).filter((item) => item.activity),
  }

  // Sidebar toggle
  const sidebarToggle = document.getElementById("sidebar-toggle")
  const sidebar = document.getElementById("sidebar")
  const sidebarOverlay = document.getElementById("sidebar-overlay")

  sidebarToggle.addEventListener("click", function () {
    sidebar.classList.toggle("show")
    sidebarOverlay.classList.toggle("show")
    this.classList.toggle("active")
  })

  sidebarOverlay.addEventListener("click", () => {
    sidebar.classList.remove("show")
    sidebarOverlay.classList.remove("show")
    sidebarToggle.classList.remove("active")
  })

  // Close sidebar with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar.classList.contains("show")) {
      sidebar.classList.remove("show")
      sidebarOverlay.classList.remove("show")
      sidebarToggle.classList.remove("active")
    }
  })

  // Navigation
  const navItems = document.querySelectorAll(".nav-item")
  navItems.forEach((item) => {
    item.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target")
      const targetSection = document.getElementById(targetId)

      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" })

        // Close sidebar on mobile after clicking
        if (window.innerWidth < 768) {
          sidebar.classList.remove("show")
          sidebarOverlay.classList.remove("show")
          sidebarToggle.classList.remove("active")
        }
      }
    })
  })

  // Tabs
  const tabTriggers = document.querySelectorAll(".tab-trigger")
  tabTriggers.forEach((trigger) => {
    trigger.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab")
      const tabContent = document.getElementById(`${tabId}-tab`)

      // Remove active class from all triggers and contents
      const parentTabsList = this.closest(".tabs-list")
      if (parentTabsList) {
        parentTabsList.querySelectorAll(".tab-trigger").forEach((t) => {
          t.classList.remove("active")
        })

        const tabContents = document.querySelectorAll(".tab-content")
        tabContents.forEach((content) => {
          content.classList.remove("active")
        })
      }

      // Add active class to clicked trigger and corresponding content
      this.classList.add("active")
      if (tabContent) {
        tabContent.classList.add("active")
      }
    })
  })

  // Dropdown
  const dropdownToggles = document.querySelectorAll(".dropdown-toggle")
  dropdownToggles.forEach((toggle) => {
    toggle.addEventListener("click", function () {
      const dropdown = this.closest(".dropdown")
      if (dropdown) {
        const menu = dropdown.querySelector(".dropdown-menu")
        if (menu) {
          menu.classList.toggle("show")
        }
      }
    })
  })

  // Close dropdowns when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".dropdown")) {
      const menus = document.querySelectorAll(".dropdown-menu")
      menus.forEach((menu) => {
        menu.classList.remove("show")
      })
    }
  })

  // Back to top button
  const backToTopButton = document.getElementById("back-to-top")

  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) {
      backToTopButton.classList.add("show")
    } else {
      backToTopButton.classList.remove("show")
    }
  })

  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  })

  function renderHourlyForecast() {
    const currentHour = new Date().getHours(); // 取得目前時間的「小時」
  
    // 重新排序 weatherData.hourlyForecast
    const reorderedForecast = [
      ...weatherData.hourlyForecast.slice(currentHour), // 取出「當前小時之後」的部分
      ...weatherData.hourlyForecast.slice(0, currentHour) // 把「之前的部分」補到後面
    ];
  
    //手機滾動視圖
    const hourlyForecastScroll = document.getElementById("hourly-forecast-scroll");
    if (hourlyForecastScroll) {
      hourlyForecastScroll.innerHTML = reorderedForecast
        .map(
          (hour) => `
        <div class="forecast-item">
          <span class="forecast-hour">${hour.hour}:00</span>
          <img src="${hour.icon}" alt="Weather icon" class="forecast-icon">
          <span class="forecast-temp">${hour.temperature}</span>
          <span class="forecast-desc">${hour.description}</span>
        </div>
      `)
        .join("");
    }
  
    // 手機網格視圖
    const hourlyForecastGrid = document.getElementById("hourly-forecast-grid");
    if (hourlyForecastGrid) {
      let gridHTML = "";
  
      for (let i = 0; i < 4; i++) {
        const startIdx = i * 6;
        const chunk = reorderedForecast.slice(startIdx, startIdx + 6);
  
        gridHTML += chunk
          .map(
            (hour) => `
          <div class="forecast-item forecast-item-small">
            <span class="forecast-hour forecast-hour-small">${hour.hour}:00</span>
            <img src="${hour.icon}" alt="Weather icon" class="forecast-icon forecast-icon-small">
            <span class="forecast-temp forecast-temp-small">${hour.temperature}</span>
            <span class="forecast-desc forecast-desc-small">${hour.description}</span>
          </div>
        `)
          .join("");
      }
  
      hourlyForecastGrid.innerHTML = gridHTML;
    }
  
    //  平板視圖
    const hourlyForecastTablet = document.getElementById("hourly-forecast-tablet");
    if (hourlyForecastTablet) {
      const firstHalf = reorderedForecast.slice(0, 12);
      const secondHalf = reorderedForecast.slice(12, 24);
  
      hourlyForecastTablet.innerHTML = `
        <div class="tablet-row">
          ${firstHalf
            .map(
              (hour) => `
            <div class="forecast-item">
              <span class="forecast-hour">${hour.hour}:00</span>
              <img src="${hour.icon}" alt="Weather icon" class="forecast-icon">
              <span class="forecast-temp">${hour.temperature}</span>
              <span class="forecast-desc">${hour.description}</span>
            </div>
          `)
            .join("")}
        </div>
        <div class="tablet-row">
          ${secondHalf
            .map(
              (hour) => `
            <div class="forecast-item">
              <span class="forecast-hour">${hour.hour}:00</span>
              <img src="${hour.icon}" alt="Weather icon" class="forecast-icon">
              <span class="forecast-temp">${hour.temperature}</span>
              <span class="forecast-desc">${hour.description}</span>
            </div>
          `)
            .join("")}
        </div>
      `;
    }
  
    // 🖥️ 桌機視圖
    const hourlyForecastDesktop = document.getElementById("hourly-forecast-desktop");
    if (hourlyForecastDesktop) {
      hourlyForecastDesktop.innerHTML = reorderedForecast
        .map(
          (hour) => `
        <div class="forecast-item">
          <span class="forecast-hour">${hour.hour}:00</span>
          <img src="${hour.icon}" alt="Weather icon" class="forecast-icon">
          <span class="forecast-temp">${hour.temperature}</span>
          <span class="forecast-desc">${hour.description}</span>
        </div>
      `)
        .join("");
    }
  }
  

  // Render daily forecast
  function renderDailyForecast() {
    const dailyForecastEl = document.getElementById("daily-forecast")
    if (dailyForecastEl) {
      dailyForecastEl.innerHTML = weatherData.dailyForecast
        .map(
          (day) => `
        <div class="daily-item">
          <h4 class="daily-day">${day.day}</h4>
          <div class="daily-details">
            <p>Rain: ${day.rainProb}</p>
            <p>High: ${day.highTemp}</p>
            <p>Low: ${day.lowTemp}</p>
            <p>Rainfall: ${day.rainfall}</p>
          </div>
        </div>
      `,
        )
        .join("")
    }
  }

  // Render attractions
  function renderAttractions() {
    const attractionsList = document.getElementById("attractions-list")
    if (attractionsList) {
      attractionsList.innerHTML = attractions
        .map(
          (attraction) => `
        <div class="attraction-item">
          <div class="attraction-image">
            <img src="${attraction.image}" alt="${attraction.name}">
          </div>
          <div class="attraction-content">
            <h3 class="attraction-title">${attraction.name}</h3>
            <a href="${attraction.link}" class="view-button" target="_blank" rel="noopener noreferrer">View Details</a>
          </div>
        </div>
      `,
        )
        .join("")
    }
  }

  // Render itinerary
  function renderItinerary() {
    for (const day in itineraryData) {
      const dayItems = document.getElementById(`${day}-items`)
      if (dayItems) {
        dayItems.innerHTML = itineraryData[day]
          .map(
            (item) => `
          <div class="itinerary-item">
            <div class="itinerary-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div class="itinerary-content">
              <p class="itinerary-activity">${item.activity}</p>
              <p class="itinerary-time">${item.time}</p>
            </div>
          </div>
        `,
          )
          .join("")
      }
    }
  }

  // Initialize all data
  renderHourlyForecast()
  renderDailyForecast()
  renderAttractions()
  renderItinerary()

  // Save data to localStorage to ensure consistency between refreshes
  localStorage.setItem("weatherData", JSON.stringify(weatherData))
})

const numAttractionsSelect = document.getElementById('num-attractions');
        const excludeCheckboxes = document.querySelectorAll('input[type="checkbox"]');
        const transportRadios = document.querySelectorAll('input[name="transport-mode"]');
        
        // Get summary elements
        const summaryAttractions = document.getElementById('summary-attractions');
        const summaryExcluded = document.getElementById('summary-excluded');
        const summaryTransport = document.getElementById('summary-transport');
        
        // Update summary function
        function updateSummary() {
            // Update number of attractions
            const numAttractions = numAttractionsSelect.value;
            summaryAttractions.textContent = `Number of attractions: ${numAttractions || 'Not selected'}`;
            
            // Update excluded attractions
            const excludedList = [];
            excludeCheckboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    excludedList.push(checkbox.value);
                }
            });
            
            summaryExcluded.textContent = `Excluded attractions: ${excludedList.length > 0 ? excludedList.join(', ') : 'None'}`;
            
            // Update transportation mode
            let transportMode = 'Walking'; // Default
            transportRadios.forEach(radio => {
                if (radio.checked) {
                    transportMode = radio.value.charAt(0).toUpperCase() + radio.value.slice(1);
                }
            });
            
            summaryTransport.textContent = `Transportation mode: ${transportMode}`;
        }
        
        // Add event listeners
        numAttractionsSelect.addEventListener('change', updateSummary);
        
        excludeCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateSummary);
        });
        
        transportRadios.forEach(radio => {
            radio.addEventListener('change', updateSummary);
        });
        
        // Initialize summary
        updateSummary();