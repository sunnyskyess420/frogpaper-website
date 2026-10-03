module.exports = {
  content: [
    "./index.html",
    "./downloads.html",
    "./404.html",
    "./submit-wallpaper.html",
    "./main.js"
  ],
  theme: {
    extend: {
      colors: {
        background: '#0B1220',
        foreground: '#E7EEF7',
        paper: '#E7EEF7',
        'paper-foreground': '#0B1220',
        'paper-muted': '#8DA2BC',
        primary: '#34D399',
        'primary-foreground': '#0B1220',
        secondary: '#1C2B45',
        'secondary-foreground': '#E7EEF7',
        muted: '#0F1828',
        'muted-foreground': '#8DA2BC',
        accent: '#34D399',
        'accent-foreground': '#0B1220',
        copper: '#10B981',
        card: '#121D30',
        'card-foreground': '#E7EEF7',
        border: '#20304A',
        destructive: '#F87171',
      },
      fontFamily: {
        heading: ['ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
        body: ['ui-sans-serif', 'system-ui', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        DEFAULT: '0.75rem',
      },
      maxWidth: {
        content: '1200px',
      },
    },
  },
}
