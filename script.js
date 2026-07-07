const storageKey = "portfolio-theme"
const themeToggle = document.getElementById("themeToggle")
const root = document.documentElement
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

const themes = ["light", "dark", "nord", "sepia", "rose", "forest"]
let currentTheme =
  localStorage.getItem(storageKey) || (prefersDark ? "dark" : "light")

function applyTheme(theme) {
  document.body.setAttribute("data-theme", theme)
  currentTheme = theme
  localStorage.setItem(storageKey, theme)
}

function cycleTheme() {
  const index = themes.indexOf(currentTheme)
  const nextTheme = themes[(index + 1) % themes.length]
  applyTheme(nextTheme)
}

applyTheme(currentTheme)

themeToggle?.addEventListener("click", cycleTheme)

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible")
        observer.unobserve(entry.target)
      }
    })
  },
  { threshold: 0.18 },
)

document
  .querySelectorAll(".reveal")
  .forEach((element) => observer.observe(element))

const counters = document.querySelectorAll("[data-counter]")
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return

      const target = entry.target
      const value = Number(target.getAttribute("data-counter"))
      const suffix = target.textContent.includes("+") ? "+" : ""
      const duration = 900
      const startTime = performance.now()

      const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        const nextValue = Math.round(eased * value)
        target.textContent = `${nextValue}${suffix}`
        if (progress < 1) requestAnimationFrame(tick)
      }

      requestAnimationFrame(tick)
      counterObserver.unobserve(target)
    })
  },
  { threshold: 0.6 },
)

counters.forEach((counter) => counterObserver.observe(counter))

document.getElementById("year").textContent = new Date().getFullYear()
