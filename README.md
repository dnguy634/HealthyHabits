# Healthy Habits

A fitness coaching web app that generates personalized weekly meal plans and workout routines based on a user's goal — bulk, cut, or maintain. The AI coach is powered by Anthropic's Claude API and responds conversationally to nutrition and training questions.

Live site: https://dnguy634.github.io/HealthyHabits/

## Stack

Vanilla HTML, CSS, and JavaScript. No build tools, no framework, no dependencies. The only external requests are Google Fonts and the Anthropic API.

## API key

The AI coach chat needs an Anthropic API key. Everything else (meal plans, workout routines) works without one.

1. Get a key at https://console.anthropic.com
2. Open `script.js` and replace `'YOUR_ANTHROPIC_API_KEY'` with your key
3. Open `index.html` in your browser

> **Note:** The key is called directly from the browser, so it's visible to anyone who views the page source. Use it for local testing only. Don't commit your real key or deploy it to a public site.


## Project structure

```
healthy-habits/
├── index.html      # markup and content
├── styles.css      # layout, theming, animations
├── script.js       # chat logic, API calls, UI interactions
└── README.md
```


