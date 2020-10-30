const STORAGE_ITEM = 'dajo.theme'
const DARK_MODE = 'dark'
const LIGHT_MODE = 'light'

const theme = window && window.localStorage.getItem(STORAGE_ITEM)
const userPrefersDarkMode =
  window &&
  window.matchMedia &&
  window.matchMedia('(prefers-color-scheme: dark)').matches

const themeToggleElt = document && document.getElementById('toggle-theme')
const themeApplyElt = document && document.body

function setTheme (currentTheme, nextTheme) {
  themeApplyElt.dataset.theme = currentTheme
  themeToggleElt.firstElementChild.src = themeToggleElt.firstElementChild.src.replace(currentTheme, nextTheme)
  themeToggleElt.firstElementChild.alt = themeToggleElt.firstElementChild.alt.replace(currentTheme, nextTheme)
  themeToggleElt.setAttribute('aria-label', themeToggleElt.getAttribute('aria-label').replace(currentTheme, nextTheme))
  themeToggleElt.dataset.themeSwitcher = nextTheme
}

// Set theme on page load
if (theme) {
  if (theme === DARK_MODE) {
    setTheme(DARK_MODE, LIGHT_MODE)
  } else if (theme === LIGHT_MODE) {
    setTheme(LIGHT_MODE, DARK_MODE)
  }
} else {
  setTheme(
    userPrefersDarkMode ? DARK_MODE : LIGHT_MODE,
    userPrefersDarkMode ? LIGHT_MODE : DARK_MODE
  )
}

// Toggle theme on click
themeToggleElt &&
  themeToggleElt.addEventListener('click', (event) => {
    const oldTheme = themeApplyElt.dataset.theme
    const newTheme = themeToggleElt.dataset.themeSwitcher
    window.localStorage.setItem(STORAGE_ITEM, newTheme)
    setTheme(newTheme, oldTheme)
  })
