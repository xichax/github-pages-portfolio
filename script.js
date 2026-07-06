const root = document.documentElement
const themeButtons = document.querySelectorAll(".theme-dot")
const savedTheme = localStorage.getItem("portfolio-theme")
const systemPrefersDark = window.matchMedia(
  "(prefers-color-scheme: dark)",
).matches
const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light")

function applyTheme(theme) {
  root.setAttribute("data-theme", theme)
  themeButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.themeOption === theme)
  })
  localStorage.setItem("portfolio-theme", theme)
}

applyTheme(initialTheme)

themeButtons.forEach((button) => {
  button.addEventListener("click", () => applyTheme(button.dataset.themeOption))
})

const revealItems = document.querySelectorAll(".reveal")
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches

if (prefersReducedMotion) {
  revealItems.forEach((item) => item.classList.add("is-visible"))
} else {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible")
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -40px 0px",
    },
  )

  revealItems.forEach((item) => revealObserver.observe(item))
}

const counters = document.querySelectorAll(".stat-number")

function animateCounter(counter) {
  if (counter.dataset.animated === "true") {
    return
  }

  counter.dataset.animated = "true"
  const target = Number(counter.dataset.target || 0)
  const suffix = counter.dataset.suffix || ""
  const startTime = performance.now()
  const duration = 1400

  const step = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1)
    const eased = 1 - Math.pow(1 - progress, 3)
    const value = Math.round(target * eased)
    counter.textContent = `${value}${suffix}`

    if (progress < 1) {
      requestAnimationFrame(step)
    } else {
      counter.textContent = `${target}${suffix}`
    }
  }

  requestAnimationFrame(step)
}

if (!prefersReducedMotion) {
  const counterObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target)
          observer.unobserve(entry.target)
        }
      })
    },
    { threshold: 0.6 },
  )

  counters.forEach((counter) => counterObserver.observe(counter))
}
