---
title: 'Toggling themes with TailwindCSS'
date: '2020-10-28'
description: 'How to toggle between multiple themes with TailwindCSS'
---

In my [previous post](/using-tailwindcss-with-eleventy), I went over adding TailwindCSS to a new Eleventy project. I found that after adding TailwindCSS, the default styles leave a lot to be desired. However I do think this is a good thing though in that Tailwind doesn't force any styles on you, yet I don't want to spend a lot of time on setting up the base styles. I ended up installing their typography plugin `npm i @tailwindcss/typography` to help with this matter. By adding a `prose` class around content, I'll gain some basic styles instantly. To get it working, I just had to add `require('@tailwindcss/typography')` to the `plugins` array of the `tailwind.config.js`.

The approach I'm going to take to toggle themes relies on CSS variables and a `data-` attribute on the `<body>` element. This approach also scales to as many themes as you need. I'll declare my themes' colors as css variables as well as create variables for things that will change such as the background color and the text color. Themes will then create classes based off of these variables.

```css
:root {
  --imperial-red: #e63946;
  --honeydew: #f1faee;
  --powder-blue: #a8dadc;
  --celadon-blue: #457b9d;
  --prussian-blue: #1d3557;

  --theme--color__link: var(--imperial-red);
  /* set dark theme as default */
  --theme--color__background: var(--prussian-blue);
  --theme--color__text: var(--honeydew);
}

body[data-theme='dark'] {
  --theme--color__background: var(--prussian-blue);
  --theme--color__text: var(--honeydew);
}

body[data-theme='light'] {
  --theme--color__background: var(--honeydew);
  --theme--color__text: var(--prussian-blue);
}
```

Since `postcss-import` doesn't want anything above `@import` statements, and I need Tailwind to be cognizant of these variables, I put this in a `themes.css` file and import that before importing Tailwind in `tailwind.css`. I can then create classes by extending Tailwind with custom classes in my `tailwind.config.js`. The changes below will generate classes like `text-link` and `bg-theme`.

```js
theme: {
  extend: {
    colors: {
      theme: 'var(--theme--color__text)',
      link: 'var(--theme--color__link)',
      background: 'var(--theme--color__background)'
    },
    textColor: {
      theme: 'var(--theme--color__text)',
      link: 'var(--theme--color__link)'
    },
    backgroundColor: {
      theme: 'var(--theme--color__background)',
      link: 'var(--theme--color__link)'
    }
  }
}
```

Since I am also using the typography plugin, I have to override their colors with my theme colors in `tailwind.config.js` as well.

```js
theme: {
  extend: {...},
  typography: {
    default: {
      css: {
        color: 'var(--theme--color__text)',
        a: {
          color: 'var(--theme--color__link)'
        },
        button: {
          color: 'var(--theme--color__link)'
        },
        strong: {
          color: 'var(--theme--color__link)'
        },
        hr: {
          borderColor: 'var(--theme--color__link)'
        },
        h1: {
          color: 'var(--theme--color__text)'
        },
        h2: {
          color: 'var(--theme--color__text)'
        },
        h3: {
          color: 'var(--theme--color__text)'
        },
        h4: {
          color: 'var(--theme--color__text)'
        },
        h5: {
          color: 'var(--theme--color__text)'
        },
        h6: {
          color: 'var(--theme--color__text)'
        },
        'ol li:before': {
          color: 'var(--theme--color__link)'
        },
        'ul li:before': {
          backgroundColor: 'var(--theme--color__link)'
        },
        blockquote: {
          borderLeftColor: 'var(--theme--color__link)',
          color: 'var(--theme--color__text)'
        },
        pre: {
          color: 'var(--theme--color__background)',
          backgroundColor: 'var(--theme--color__text)'
        },
        code: {
          color: 'var(--theme--color__link)'
        },
        thead: {
          color: 'var(--theme--color__link)'
        }
      }
    }
  }
}
```

Now all I need is a way to toggle the themes. Inside of my header I added a button with an id to select it and a `data-` attribute to know which theme to switch to. I'll use an event handler to listen to clicks on the button and change the `<body>`'s `data-theme` attribute. In addition, I'll save the theme choice to `localStorage` with a `dajo.theme` variable to set the theme choice on page load to keep the theme consistent as users navigate through different pages. I also tried to compensate for a user's preference of dark mode. In the end, I put the following in a `src/scripts/index.js` file and loaded that in my default layout.

```js
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

function setTheme(currentTheme, nextTheme) {
  themeApplyElt.dataset.theme = currentTheme
  themeToggleElt.src = themeToggleElt.src.replace(currentTheme, nextTheme)
  themeToggleElt.alt = themeToggleElt.alt.replace(currentTheme, nextTheme)
  themeToggleElt.nextElementSibling.innerText = themeToggleElt.nextElementSibling.innerText.replace(
    currentTheme,
    nextTheme
  )
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
    const newTheme = event.target.dataset.themeSwitcher
    window.localStorage.setItem(STORAGE_ITEM, newTheme)
    setTheme(newTheme, oldTheme)
  })
```

Toggling the button content doesn't scale to multiple themes but everything else about this approach will work for three or more themes.
