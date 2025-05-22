document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-item');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetSection.offsetTop - 70,
                behavior: 'smooth'
            });
        });
    });

    // Highlighting active nav section on scroll
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('.section');
        const navItems = document.querySelectorAll('.nav-item');
        
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (pageYOffset >= sectionTop && pageYOffset < sectionTop + sectionHeight) {
                currentSection = '#' + section.getAttribute('id');
            }
        });
        
        navItems.forEach(item => {
            item.style.color = item.getAttribute('href') === currentSection ? 
                'var(--primary-color)' : 'var(--text-light)';
        });
    });
    
    // Menu image modal functionality
    const menuImage = document.getElementById('menuImage');
    const menuModal = document.getElementById('menuModal');
    const menuModalImg = document.getElementById('menuModalImg');
    const menuClose = document.querySelector('.menu-close');
    
    if (menuImage && menuModal && menuModalImg) {
        // Open modal when clicking the menu image
        menuImage.addEventListener('click', function() {
            menuModal.style.display = 'flex';
            menuModalImg.src = this.src;
        });
        
        // Close modal when clicking the X
        if (menuClose) {
            menuClose.addEventListener('click', function() {
                menuModal.style.display = 'none';
            });
        }
        
        // Close modal when clicking outside the image
        menuModal.addEventListener('click', function(e) {
            if (e.target === menuModal) {
                menuModal.style.display = 'none';
            }
        });
        
        // Close modal with escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && menuModal.style.display === 'flex') {
                menuModal.style.display = 'none';
            }
        });
    }
    
    // Collapsible sections functionality
    const collapsibles = document.querySelectorAll('.collapsible');
    
    collapsibles.forEach(collapsible => {
        collapsible.addEventListener('click', function() {
            this.classList.toggle('active');
            const content = this.nextElementSibling;
            
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
    
    // Initialize - open the first collapsible by default
    if (collapsibles.length > 0) {
        setTimeout(() => {
            collapsibles[0].click();
        }, 300);
    }
    
    // Time-based itinerary functionality
    function updateItineraryBasedOnTime() {
        const now = new Date();
        
        // Event dates (MM/DD/YYYY format for clarity)
        const days = [
            { date: '5/22/2025', element: document.querySelector('.day-card:nth-child(1)'), label: 'Thursday' },
            { date: '5/23/2025', element: document.querySelector('.day-card:nth-child(2)'), label: 'Friday' },
            { date: '5/24/2025', element: document.querySelector('.day-card:nth-child(3)'), label: 'Saturday' },
            { date: '5/25/2025', element: document.querySelector('.day-card:nth-child(4)'), label: 'Sunday' },
            { date: '5/26/2025', element: document.querySelector('.day-card:nth-child(5)'), label: 'Monday' },
            { date: '5/27/2025', element: document.querySelector('.day-card:nth-child(6)'), label: 'Tuesday' }
        ];
        
        let currentDayFound = false;
        let currentDayElement = null;
        
        // Process each day
        days.forEach(day => {
            if (!day.element) return; // Skip if element not found
            
            const dayDate = new Date(day.date);
            dayDate.setHours(0, 0, 0, 0); // Set to beginning of day
            
            const nextDay = new Date(dayDate);
            nextDay.setDate(nextDay.getDate() + 1); // Add one day
            
            // Check if this day is in the past
            if (now > nextDay) {
                day.element.classList.add('past');
                
                // Mark all events in this day as past
                const events = day.element.querySelectorAll('.event');
                events.forEach(event => {
                    event.classList.add('past');
                });
            }
            // Check if this is the current day
            else if (now >= dayDate && now < nextDay) {
                day.element.classList.add('current');
                currentDayElement = day.element;
                currentDayFound = true;
                
                // Process each event within the current day
                processCurrentDayEvents(day.element, day.date);
            }
        });
        
        // Scroll to current day if found
        if (currentDayElement) {
            setTimeout(() => {
                currentDayElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 500);
        }
    }
    
    function processCurrentDayEvents(dayElement, dayDateStr) {
        const now = new Date();
        const events = dayElement.querySelectorAll('.event');
        const dayDate = new Date(dayDateStr);
        
        events.forEach(event => {
            const timeSpan = event.querySelector('.time');
            if (!timeSpan) return;
            
            const timeText = timeSpan.textContent.trim();
            
            // Handle different time formats
            let eventTime;
            
            if (timeText === 'Morning') {
                eventTime = new Date(dayDate);
                eventTime.setHours(9, 0, 0, 0);
                
                const endTime = new Date(dayDate);
                endTime.setHours(12, 0, 0, 0);
                
                if (now < eventTime) {
                    // Morning is upcoming
                } else if (now >= eventTime && now < endTime) {
                    // Current morning
                    event.classList.add('current');
                } else {
                    // Past morning
                    event.classList.add('past');
                }
            }
            else if (timeText === 'Afternoon') {
                eventTime = new Date(dayDate);
                eventTime.setHours(12, 0, 0, 0);
                
                const endTime = new Date(dayDate);
                endTime.setHours(17, 0, 0, 0);
                
                if (now < eventTime) {
                    // Afternoon is upcoming
                } else if (now >= eventTime && now < endTime) {
                    // Current afternoon
                    event.classList.add('current');
                } else {
                    // Past afternoon
                    event.classList.add('past');
                }
            }
            else if (timeText === 'Evening' || timeText === 'Dinner') {
                eventTime = new Date(dayDate);
                eventTime.setHours(17, 0, 0, 0);
                
                const endTime = new Date(dayDate);
                endTime.setHours(23, 59, 59, 999);
                
                if (now < eventTime) {
                    // Evening is upcoming
                } else if (now >= eventTime && now < endTime) {
                    // Current evening
                    event.classList.add('current');
                } else {
                    // Past evening
                    event.classList.add('past');
                }
            }
            else if (timeText === 'Lunch') {
                eventTime = new Date(dayDate);
                eventTime.setHours(12, 0, 0, 0);
                
                const endTime = new Date(dayDate);
                endTime.setHours(14, 0, 0, 0);
                
                if (now < eventTime) {
                    // Lunch is upcoming
                } else if (now >= eventTime && now < endTime) {
                    // Current lunch
                    event.classList.add('current');
                } else {
                    // Past lunch
                    event.classList.add('past');
                }
            }
            else if (timeText === 'All Day') {
                // All day event spans the entire day
                event.classList.add('current');
            }
            else {
                // Try to parse time like "3:00 PM" or "10:30 AM - 12:30 PM"
                try {
                    const timeMatch = timeText.split('-')[0].trim(); // Take first part if range
                    const [hours, minutes] = timeMatch.split(':');
                    let parsedHours = parseInt(hours);
                    const parsedMinutes = parseInt(minutes);
                    
                    // Handle AM/PM
                    if (timeMatch.includes('PM') && parsedHours < 12) {
                        parsedHours += 12;
                    }
                    
                    eventTime = new Date(dayDate);
                    eventTime.setHours(parsedHours, parsedMinutes, 0, 0);
                    
                    // Define end time as 2 hours after start time by default
                    const endTime = new Date(eventTime);
                    endTime.setHours(endTime.getHours() + 2);
                    
                    if (now < eventTime) {
                        // Event is upcoming
                    } else if (now >= eventTime && now < endTime) {
                        // Current event
                        event.classList.add('current');
                    } else {
                        // Past event
                        event.classList.add('past');
                    }
                } catch (e) {
                    console.log('Could not parse time: ' + timeText);
                }
            }
        });
    }
    
    // Run the time-based updates
    updateItineraryBasedOnTime();
    
    // Update every minute
    setInterval(updateItineraryBasedOnTime, 60000);
});