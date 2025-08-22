/**
 * Interactive Calendar Component
 * Handles event display, navigation, and accessibility features
 */

// ===========================
// CALENDAR CLASS
// ===========================
class Calendar {
  constructor(containerId, events = []) {
    this.container = document.getElementById(containerId);
    this.events = events;
    this.currentDate = new Date();
    this.selectedDate = null;
    this.focusedDate = new Date();
    
    this.monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    this.dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    this.init();
  }
  
  init() {
    if (!this.container) {
      console.error('Calendar container not found');
      return;
    }
    
    this.render();
    this.bindEvents();
    this.setupKeyboardNavigation();
  }
  
  render() {
    this.container.innerHTML = `
      <div class="calendar">
        <div class="calendar-header">
          <button type="button" class="calendar-nav-btn" id="prevMonth" aria-label="Previous month">
            ‹
          </button>
          <h2 class="calendar-title" id="calendarTitle" aria-live="polite">
            ${this.monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}
          </h2>
          <button type="button" class="calendar-nav-btn" id="nextMonth" aria-label="Next month">
            ›
          </button>
        </div>
        <div class="calendar-grid" role="grid" aria-labelledby="calendarTitle">
          ${this.renderDayHeaders()}
          ${this.renderDays()}
        </div>
      </div>
      
      <div id="eventModal" class="modal" role="dialog" aria-labelledby="eventModalTitle" aria-hidden="true">
        <div class="modal-content" tabindex="-1">
          <button type="button" class="modal-close" aria-label="Close event details">&times;</button>
          <div id="eventModalContent">
            <!-- Event details will be inserted here -->
          </div>
        </div>
      </div>
    `;
  }
  
  renderDayHeaders() {
    return this.dayNames.map(day => 
      `<div class="calendar-day-header" role="columnheader">${day}</div>`
    ).join('');
  }
  
  renderDays() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    let daysHtml = '';
    const today = new Date();
    
    // Generate 6 weeks (42 days) to ensure consistent grid
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      const isCurrentMonth = date.getMonth() === month;
      const isToday = this.isSameDate(date, today);
      const isFocused = this.isSameDate(date, this.focusedDate);
      const events = this.getEventsForDate(date);
      const hasEvents = events.length > 0;
      
      const classes = [
        'calendar-day',
        !isCurrentMonth ? 'other-month' : '',
        hasEvents ? 'has-events' : '',
        isToday ? 'today' : ''
      ].filter(Boolean).join(' ');
      
      const ariaLabel = this.getDateAriaLabel(date, events, isToday);
      
      daysHtml += `
        <button type="button" 
                class="${classes}" 
                data-date="${this.formatDateString(date)}"
                aria-label="${ariaLabel}"
                tabindex="${isFocused ? '0' : '-1'}"
                role="gridcell">
          ${date.getDate()}
        </button>
      `;
    }
    
    return daysHtml;
  }
  
  bindEvents() {
    // Previous month button
    const prevBtn = this.container.querySelector('#prevMonth');
    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.previousMonth());
    }
    
    // Next month button
    const nextBtn = this.container.querySelector('#nextMonth');
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.nextMonth());
    }
    
    // Day clicks
    this.container.addEventListener('click', (event) => {
      if (event.target.classList.contains('calendar-day')) {
        const dateString = event.target.getAttribute('data-date');
        const date = new Date(dateString);
        this.selectDate(date);
        this.showEventsForDate(date);
      }
    });
  }
  
  setupKeyboardNavigation() {
    this.container.addEventListener('keydown', (event) => {
      if (!event.target.classList.contains('calendar-day')) return;
      
      const currentDate = new Date(event.target.getAttribute('data-date'));
      let newDate = new Date(currentDate);
      let handled = false;
      
      switch (event.key) {
        case 'ArrowLeft':
          newDate.setDate(newDate.getDate() - 1);
          handled = true;
          break;
        case 'ArrowRight':
          newDate.setDate(newDate.getDate() + 1);
          handled = true;
          break;
        case 'ArrowUp':
          newDate.setDate(newDate.getDate() - 7);
          handled = true;
          break;
        case 'ArrowDown':
          newDate.setDate(newDate.getDate() + 7);
          handled = true;
          break;
        case 'Home':
          newDate.setDate(1);
          handled = true;
          break;
        case 'End':
          newDate = new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0);
          handled = true;
          break;
        case 'PageUp':
          newDate.setMonth(newDate.getMonth() - (event.shiftKey ? 12 : 1));
          handled = true;
          break;
        case 'PageDown':
          newDate.setMonth(newDate.getMonth() + (event.shiftKey ? 12 : 1));
          handled = true;
          break;
        case 'Enter':
        case ' ':
          this.selectDate(currentDate);
          this.showEventsForDate(currentDate);
          handled = true;
          break;
      }
      
      if (handled) {
        event.preventDefault();
        this.focusDate(newDate);
      }
    });
  }
  
  focusDate(date) {
    // Change month if necessary
    if (date.getMonth() !== this.currentDate.getMonth() || 
        date.getFullYear() !== this.currentDate.getFullYear()) {
      this.currentDate = new Date(date);
      this.render();
      this.bindEvents();
      this.setupKeyboardNavigation();
    }
    
    this.focusedDate = new Date(date);
    
    // Update tabindex and focus
    const allDays = this.container.querySelectorAll('.calendar-day');
    allDays.forEach(day => {
      day.setAttribute('tabindex', '-1');
    });
    
    const targetDay = this.container.querySelector(`[data-date="${this.formatDateString(date)}"]`);
    if (targetDay) {
      targetDay.setAttribute('tabindex', '0');
      targetDay.focus();
    }
  }
  
  previousMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.render();
    this.bindEvents();
    this.setupKeyboardNavigation();
    
    // Announce to screen readers
    if (window.announceToScreenReader) {
      window.announceToScreenReader(
        `Showing ${this.monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`
      );
    }
  }
  
  nextMonth() {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.render();
    this.bindEvents();
    this.setupKeyboardNavigation();
    
    // Announce to screen readers
    if (window.announceToScreenReader) {
      window.announceToScreenReader(
        `Showing ${this.monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`
      );
    }
  }
  
  selectDate(date) {
    this.selectedDate = new Date(date);
    
    // Update visual selection
    const allDays = this.container.querySelectorAll('.calendar-day');
    allDays.forEach(day => {
      day.classList.remove('selected');
    });
    
    const selectedDay = this.container.querySelector(`[data-date="${this.formatDateString(date)}"]`);
    if (selectedDay) {
      selectedDay.classList.add('selected');
    }
  }
  
  showEventsForDate(date) {
    const events = this.getEventsForDate(date);
    const modal = document.getElementById('eventModal');
    const modalContent = document.getElementById('eventModalContent');
    
    if (!modal || !modalContent) return;
    
    if (events.length === 0) {
      modalContent.innerHTML = `
        <h3 id="eventModalTitle">No Events</h3>
        <p>No events scheduled for ${this.formatDateForDisplay(date)}.</p>
      `;
    } else {
      const eventList = events.map(event => `
        <div class="event-item">
          <h4>${event.title}</h4>
          <p><strong>Time:</strong> ${this.formatTime(event.time)}</p>
          <p><strong>Description:</strong> ${event.description}</p>
        </div>
      `).join('');
      
      modalContent.innerHTML = `
        <h3 id="eventModalTitle">Events for ${this.formatDateForDisplay(date)}</h3>
        <div class="events-list">
          ${eventList}
        </div>
      `;
    }
    
    // Open modal
    if (window.openModal) {
      window.openModal('eventModal');
    }
    
    // Announce to screen readers
    if (window.announceToScreenReader) {
      const eventCount = events.length;
      const message = eventCount === 0 
        ? `No events for ${this.formatDateForDisplay(date)}`
        : `${eventCount} event${eventCount > 1 ? 's' : ''} for ${this.formatDateForDisplay(date)}`;
      window.announceToScreenReader(message);
    }
  }
  
  getEventsForDate(date) {
    const dateString = this.formatDateString(date);
    return this.events.filter(event => {
      const eventDate = new Date(event.date);
      return this.formatDateString(eventDate) === dateString;
    });
  }
  
  addEvent(event) {
    this.events.push(event);
    this.render();
    this.bindEvents();
    this.setupKeyboardNavigation();
  }
  
  removeEvent(eventId) {
    this.events = this.events.filter(event => event.id !== eventId);
    this.render();
    this.bindEvents();
    this.setupKeyboardNavigation();
  }
  
  updateEvents(newEvents) {
    this.events = newEvents;
    this.render();
    this.bindEvents();
    this.setupKeyboardNavigation();
  }
  
  // ===========================
  // UTILITY METHODS
  // ===========================
  
  isSameDate(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }
  
  formatDateString(date) {
    return date.toISOString().split('T')[0];
  }
  
  formatDateForDisplay(date) {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
  
  formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour12 = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${hour12}:${minutes} ${ampm}`;
  }
  
  getDateAriaLabel(date, events, isToday) {
    const dayLabel = this.formatDateForDisplay(date);
    const todayLabel = isToday ? ', today' : '';
    const eventLabel = events.length > 0 
      ? `, ${events.length} event${events.length > 1 ? 's' : ''}`
      : '';
    
    return `${dayLabel}${todayLabel}${eventLabel}`;
  }
}

// ===========================
// CALENDAR INITIALIZATION
// ===========================
document.addEventListener('DOMContentLoaded', async function() {
  // Load events data
  let eventsData = [];
  
  try {
    const response = await fetch('events.json');
    if (response.ok) {
      eventsData = await response.json();
    } else {
      console.warn('Could not load events.json, using sample data');
      eventsData = getSampleEvents();
    }
  } catch (error) {
    console.warn('Error loading events:', error);
    eventsData = getSampleEvents();
  }
  
  // Initialize calendar if container exists
  const calendarContainer = document.getElementById('calendar');
  if (calendarContainer) {
    window.calendar = new Calendar('calendar', eventsData);
  }
});

// ===========================
// SAMPLE EVENTS DATA
// ===========================
function getSampleEvents() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  
  return [
    {
      id: 1,
      date: new Date(currentYear, currentMonth, 5).toISOString().split('T')[0],
      title: 'New Student Orientation',
      time: '09:00',
      description: 'Welcome session for new students and their families. Campus tour included.'
    },
    {
      id: 2,
      date: new Date(currentYear, currentMonth, 12).toISOString().split('T')[0],
      title: 'Science Fair',
      time: '14:00',
      description: 'Annual science fair showcasing student projects and innovations.'
    },
    {
      id: 3,
      date: new Date(currentYear, currentMonth, 18).toISOString().split('T')[0],
      title: 'Parent-Teacher Conference',
      time: '16:00',
      description: 'Individual meetings between parents and teachers to discuss student progress.'
    },
    {
      id: 4,
      date: new Date(currentYear, currentMonth, 25).toISOString().split('T')[0],
      title: 'Sports Day',
      time: '10:00',
      description: 'Annual sports competition with various athletic events for all grade levels.'
    },
    {
      id: 5,
      date: new Date(currentYear, currentMonth + 1, 8).toISOString().split('T')[0],
      title: 'Art Exhibition Opening',
      time: '18:00',
      description: 'Opening night for the student art exhibition featuring works from all grades.'
    },
    {
      id: 6,
      date: new Date(currentYear, currentMonth + 1, 15).toISOString().split('T')[0],
      title: 'Math Competition',
      time: '13:00',
      description: 'Inter-school mathematics competition for grades 6-12.'
    },
    {
      id: 7,
      date: new Date(currentYear, currentMonth + 2, 3).toISOString().split('T')[0],
      title: 'Spring Concert',
      time: '19:00',
      description: 'Musical performance by the school choir and orchestra.'
    },
    {
      id: 8,
      date: new Date(currentYear, currentMonth + 2, 20).toISOString().split('T')[0],
      title: 'Career Day',
      time: '11:00',
      description: 'Professionals from various fields share their experiences with students.'
    }
  ];
}

// ===========================
// GLOBAL FUNCTIONS
// ===========================
window.Calendar = Calendar;
window.getSampleEvents = getSampleEvents;