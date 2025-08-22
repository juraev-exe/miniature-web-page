# Riverside Academy - School Website

A complete multi-page, responsive school website built with HTML, CSS, and JavaScript. This project demonstrates modern web development practices with a focus on accessibility, performance, and user experience.

## 🌟 Features

### Responsive Design
- **Mobile-first approach** with breakpoints at 480px, 768px, and 1024px
- **CSS variables-based theme system** for consistent styling
- **Flexible grid layouts** that adapt to all screen sizes
- **Touch-friendly navigation** for mobile devices

### Interactive Components
- **Calendar system** with event management and keyboard navigation
- **Login system** with client-side validation and authentication simulation
- **Modal dialogs** for event details and user interactions
- **Responsive navigation** with hamburger menu for mobile

### Accessibility Features
- **Semantic HTML** structure with proper heading hierarchy
- **ARIA labels and roles** for screen reader compatibility
- **Keyboard navigation** support for all interactive elements
- **Focus management** and skip links for better usability
- **High contrast support** and reduced motion preferences

### Performance Optimized
- **Combined CSS and JS under 200KB** minified
- **No external dependencies** or build tools required
- **Optimized images** and efficient code structure
- **Progressive enhancement** approach

## 📁 Project Structure

```
riverside-academy/
├── index.html              # Homepage with welcome message and navigation
├── about.html              # Mission, history timeline, and staff profiles
├── admissions.html         # Application process and requirements
├── events.html             # Interactive calendar and event listings
├── login.html              # Student login form with validation
├── student-portal.html     # Student dashboard placeholder
├── css/
│   └── styles.css          # Complete CSS framework with responsive design
├── js/
│   ├── main.js            # Navigation, login, and general functionality
│   └── calendar.js        # Interactive calendar component
├── assets/
│   ├── images/            # Placeholder for images
│   └── logos/
│       └── logo.svg       # School logo
├── events.json            # Sample events data (12 events across 3 months)
└── README.md              # This documentation file
```

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge - latest 2 versions)
- Local web server for optimal functionality (optional but recommended)

### Setup Instructions

1. **Clone or download** the repository
   ```bash
   git clone <repository-url>
   cd miniature-web-page
   ```

2. **Start a local web server** (recommended)
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Open in browser**
   - Navigate to `http://localhost:8000` (if using local server)
   - Or open `index.html` directly in your browser

### Live Preview
The website can be viewed by opening any HTML file directly in a modern web browser. However, some features (like loading events.json) work better with a local server.

## 📅 Calendar System

### Adding Events
Events are stored in `events.json` and loaded dynamically by the calendar component.

**Event Format:**
```json
{
  "id": 1,
  "date": "2024-12-25",
  "title": "Event Title",
  "time": "14:00",
  "description": "Event description text"
}
```

**To add new events:**
1. Open `events.json`
2. Add your event object to the array
3. Use ISO date format (YYYY-MM-DD) for the date field
4. Use 24-hour format (HH:MM) for the time field
5. Assign a unique ID number

### Calendar Features
- **Interactive navigation** with previous/next month buttons
- **Keyboard accessibility** (arrow keys, Enter, Page Up/Down, Home/End, Escape)
- **Event highlighting** - dates with events are visually distinguished
- **Modal displays** showing event details when dates are clicked
- **Screen reader support** with proper ARIA labels and announcements

## 🔐 Login System

### Demo Credentials
The login system includes three demo accounts for testing:

| Role | Username | Password |
|------|----------|----------|
| Student | student1 | password123 |
| Teacher | teacher1 | teacher456 |
| Administrator | admin | admin789 |

### Features
- **HTML5 validation** with real-time feedback
- **Client-side authentication** simulation
- **Session management** using sessionStorage
- **Password visibility toggle**
- **Responsive error handling**
- **Accessibility compliance** with proper labels and ARIA attributes

### Security Note
⚠️ **This is a demonstration system only.** In production, implement:
- Server-side authentication
- Secure password hashing
- HTTPS encryption
- Proper session management
- CSRF protection

## ♿ Accessibility Checklist

### ✅ Implemented Features
- [x] **Semantic HTML** - Proper use of headings, sections, nav, main, aside
- [x] **ARIA roles and labels** - Enhanced screen reader support
- [x] **Keyboard navigation** - All interactive elements accessible via keyboard
- [x] **Focus management** - Visible focus indicators and logical tab order
- [x] **Color contrast** - Meets WCAG 2.1 AA standards (4.5:1 ratio)
- [x] **Alternative text** - Images have descriptive alt attributes
- [x] **Form labels** - All form inputs properly labeled
- [x] **Skip links** - Direct navigation to main content
- [x] **Screen reader announcements** - Dynamic content changes announced
- [x] **Responsive design** - Works at 375px minimum width
- [x] **Reduced motion** - Respects user motion preferences

### Testing Recommendations
1. **Lighthouse Audit** - Target: Accessibility score ≥ 80
2. **Screen Reader Testing** - Test with NVDA, JAWS, or VoiceOver
3. **Keyboard Navigation** - Navigate without using a mouse
4. **Color Blindness** - Test with color blindness simulators
5. **Mobile Testing** - Verify functionality on touch devices

## 🎨 Customization

### Theme Colors
The website uses CSS custom properties for easy theme customization:

```css
:root {
  --color-primary: #2563eb;      /* Blue */
  --color-secondary: #0f766e;    /* Teal */
  --color-accent: #dc2626;       /* Red */
  --color-background: #ffffff;   /* White */
  --color-text: #1f2937;         /* Dark gray */
}
```

### Typography
Font system based on CSS custom properties:
```css
:root {
  --font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  --font-family-heading: Georgia, 'Times New Roman', serif;
  --font-size-base: 1rem;
  --line-height-base: 1.5;
}
```

### Responsive Breakpoints
- **Mobile**: < 480px
- **Small devices**: 480px - 767px
- **Medium devices**: 768px - 1023px
- **Large devices**: ≥ 1024px

## 🧪 Testing

### Browser Compatibility
Tested and compatible with:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Mobile Testing
- iOS Safari
- Android Chrome
- Responsive design tested at various viewport sizes
- Touch interaction optimization

### Accessibility Testing
- **Lighthouse accessibility audit**
- **WAVE (Web Accessibility Evaluation Tool)**
- **Keyboard navigation testing**
- **Screen reader testing** (NVDA, VoiceOver)

## 📊 Performance

### Size Metrics
- **CSS**: ~16KB minified
- **JavaScript**: ~28KB minified  
- **Total assets**: < 200KB (excluding images)

### Optimization Features
- Efficient CSS with minimal redundancy
- Vanilla JavaScript (no external libraries)
- Optimized images and SVG graphics
- Semantic HTML for faster parsing

## 🤝 Contributing

### Code Style
- Use semantic HTML elements
- Follow CSS custom property naming conventions
- Implement accessible JavaScript patterns
- Maintain responsive design principles

### Adding New Pages
1. Create HTML file with proper structure
2. Include semantic navigation
3. Add accessibility features
4. Test at all breakpoints
5. Update navigation menus

## 📞 Support

For questions or issues related to this demonstration:
- Review the code comments for implementation details
- Check browser compatibility requirements
- Verify local server setup for full functionality

## 🔧 Technical Notes

### Framework Decision
This project uses **vanilla HTML, CSS, and JavaScript** by design:
- No build tools required
- Direct browser compatibility
- Educational value for learning fundamentals
- Minimal dependencies and maximum portability

### Future Enhancements
For production use, consider adding:
- Backend integration for real data
- User authentication system
- Content management system
- Advanced form processing
- Real-time notifications
- Database integration

---

**© 2024 Riverside Academy Demo Website**  
Built with accessibility, performance, and user experience in mind.