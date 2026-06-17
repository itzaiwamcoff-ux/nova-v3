# Nova — Modern News Website

Where news comes to life. A fully functional, production-ready news website with glass morphism design, authentication, admin dashboard, and extensive animations.

## Features

### 📰 Content
- **Home** — Featured stories with hero banner and card-based article display
- **Topics** — Filterable news by category (Technology, Science, Business, Politics, Health, World)
- **Article Detail** — Full article view with rich text content and metadata
- **Comments** — Per-article commenting system with animated entries and timing

### 🔐 Authentication
- **Sign Up** — Full registration with animated modal form
- **Sign In** — Secure login with credential validation
- **Profile Dropdown** — User info, admin access, and sign out
- **Default Admin** — `admin@gmail.com` / `admin123`

### 🛡️ Admin Dashboard
- Add new articles with title, category, content, excerpt, and image
- Delete existing articles with confirmation dialog
- Admin-only access protected by authentication

### 🎨 Design
- **Glass Morphism** — Frosted glass effects on all major components
- **Dark/Light Mode** — Theme switcher with system preference detection
- **Custom Nova Logo** — Integrated "N" and book elements in SVG
- **Extensive Animations** — Smooth transitions for tabs, modals, cards, comments, and interactions
- **Responsive** — Fully adaptive across desktop, tablet, and mobile

### 🧩 Technical
- **Zero Dependencies** — Pure HTML, CSS, and JavaScript
- **localStorage** — Persistent data storage
- **Modern CSS** — CSS custom properties, backdrop-filter, animations
- **Modular JS** — Clean separation of data, auth, and app layers

## Quick Start

1. Open `index.html` in any modern browser
2. Browse articles immediately (no setup needed)
3. Sign in with `admin@gmail.com` / `admin123` for admin access
4. Or create your own account to comment

## File Structure

```
nova-news/
├── index.html        # Main HTML with all markup
├── css/
│   └── styles.css    # Complete styles (glass morphism, themes, animations)
└── js/
    ├── data.js       # Data layer (localStorage CRUD)
    ├── auth.js       # Authentication module (sign in/up, session)
    └── app.js        # Application logic (tabs, render, comments, admin)
```

## Color System

| Token | Dark Mode | Light Mode | Usage |
|-------|-----------|------------|-------|
| Primary BG | `#303030` | `#f0f2f5` | Background |
| Glass BG | rgba(48,48,48,0.55) | rgba(255,255,255,0.55) | Glass components |
| Accent | `#45B83E` | `#45B83E` | Interactive elements |
| Modal BG | `#555555` | `#555555` | Sign up background |

## Browser Support

- Chrome/Edge 95+
- Firefox 100+
- Safari 15+
- All modern browsers with `backdrop-filter` support

---

Built with ❤️ by Nova
