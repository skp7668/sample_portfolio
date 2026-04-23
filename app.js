document.addEventListener('DOMContentLoaded', () => {
    // Tab Navigation
    const navItems = document.querySelectorAll('.nav-item');
    const sections = document.querySelectorAll('.section');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    const executeBuildBtn = document.getElementById('execute-build-btn');

    function switchTab(tabId) {
        // Update nav active class
        navItems.forEach(item => {
            if (item.getAttribute('data-tab') === tabId) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Update section active class
        sections.forEach(section => {
            if (section.id === tabId) {
                section.classList.add('active-section');
            } else {
                section.classList.remove('active-section');
            }
        });

        // Close mobile menu if open
        navLinksContainer.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');

        // Scroll to top
        window.scrollTo(0, 0);

        // Update URL hash
        if (tabId === 'profile') {
            window.history.pushState(null, "", window.location.pathname);
        } else {
            window.history.pushState(null, "", `#${tabId}`);
        }
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const tabId = item.getAttribute('data-tab');
            switchTab(tabId);
        });
    });

    if (executeBuildBtn) {
        executeBuildBtn.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab('projects');
        });
    }

    // Handle initial hash load
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        if (["profile", "details", "projects", "contact"].includes(hash)) {
            switchTab(hash);
        }
    }

    // Mobile Menu Toggle
    menuToggle.addEventListener('click', () => {
        navLinksContainer.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (navLinksContainer.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Typewriter Effect
    const typedTextElement = document.getElementById('typed-text');
    if (typedTextElement) {
        const targetText = "System.Profile()";
        let i = 0;
        
        function typeWriter() {
            if (i < targetText.length) {
                typedTextElement.innerHTML += targetText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        
        setTimeout(typeWriter, 500);
    }

    // Blob Movement
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        const blobs = document.querySelectorAll('.blob');
        blobs.forEach((blob, index) => {
            const speed = (index + 1) * 20;
            blob.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
        });
    });

    // Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submit-btn');
            const submitText = document.getElementById('submit-text');
            const submitIcon = document.getElementById('submit-icon');
            const formStatus = document.getElementById('form-status');
            
            submitBtn.disabled = true;
            submitBtn.style.opacity = '0.7';
            submitText.textContent = 'Transmitting...';
            submitIcon.className = 'fas fa-spinner fa-spin';
            formStatus.style.display = 'none';

            const formData = new FormData(contactForm);
            // Web3Forms access key
            formData.append("access_key", "24ac48fe-9ffe-483e-98e8-2b52a90632fd");

            fetch("https://api.web3forms.com/submit", {
                method: "POST",
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                formStatus.style.display = 'block';
                if (data.success) {
                    formStatus.textContent = "Message Sent Successfully! Connection closed.";
                    formStatus.style.color = "var(--primary-cyan)";
                    contactForm.reset();
                } else {
                    formStatus.textContent = "Transmission Failed: " + data.message;
                    formStatus.style.color = "#ff4a4a";
                }
            })
            .catch(error => {
                console.error("Error submitting form:", error);
                formStatus.style.display = 'block';
                formStatus.textContent = "Network Error. Please try again.";
                formStatus.style.color = "#ff4a4a";
            })
            .finally(() => {
                submitBtn.disabled = false;
                submitBtn.style.opacity = '1';
                submitText.textContent = 'Transmit Data';
                submitIcon.className = 'fas fa-paper-plane';

                setTimeout(() => {
                    formStatus.style.display = 'none';
                    formStatus.textContent = "";
                }, 5000);
            });
        });
    }
});
