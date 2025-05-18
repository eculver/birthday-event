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
});