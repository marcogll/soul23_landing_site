/*=============== CHANGE BACKGROUND HEADER ===============*/
function scrollHeader() {
    const header = document.getElementById('header')
    // When the scroll is greater than 50 viewport height, add the scroll-header class to the header tag
    if(this.scrollY >= 50) header.classList.add('scroll-header'); else header.classList.remove('scroll-header')
}
window.addEventListener('scroll', scrollHeader)

/*=============== SERVICES MODAL ===============*/
const modalViews = document.querySelectorAll('.services__modal'),
      modalBtns = document.querySelectorAll('.services__button'),
      modalClose = document.querySelectorAll('.services__modal-close')

let modal = function(modalClick) {
    modalViews[modalClick].classList.add('active-modal')
}

modalBtns.forEach((mb, i) => {
    mb.addEventListener('click', () => {
        modal(i)
    })
})

modalClose.forEach((mc) => {
    mc.addEventListener('click', () => {
        modalViews.forEach((mv) => {
            mv.classList.remove('active-modal')
        })
    })
})

/* Close modal on background click */
modalViews.forEach((mv) => {
    mv.addEventListener('click', (e) => {
        if (e.target === mv) {
            mv.classList.remove('active-modal')
        }
    })
})

/*=============== MIXITUP FILTER PORTFOLIO ===============*/
let mixerPortfolio = mixitup('.work__container', {
    selectors: {
        target: '.work__card'
    },
    animation: {
        duration: 300
    }
});

/* Link active work */
const linkWork = document.querySelectorAll('.work__item')

function activeWork() {
    linkWork.forEach(l => l.classList.remove('active-work'))
    this.classList.add('active-work')
}

linkWork.forEach(l => l.addEventListener('click', activeWork))

/*=============== SWIPER TESTIMONIAL ===============*/
const testimonialContainer = document.querySelector('.testimonial__container')

if (testimonialContainer) {
    const testimonialSwiper = new Swiper(".testimonial__container", {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: true,
        grabCursor: true,
        autoHeight: true,

        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
    });

    document.querySelector('.testimonial__button-next')?.addEventListener('click', () => testimonialSwiper.slideNext())
    document.querySelector('.testimonial__button-prev')?.addEventListener('click', () => testimonialSwiper.slidePrev())
}

/*=============== SCROLL SECTIONS ACTIVE LINK ===============*/
const sections = document.querySelectorAll('section[id]')

function scrollActive() {
    const scrollY = window.pageYOffset

    sections.forEach(current => {
        const sectionHeight = current.offsetHeight,
              sectionTop = current.offsetTop - 58,
              sectionId = current.getAttribute('id')

        const navLink = document.querySelector('.nav__menu a[href*=' + sectionId + ']')

        if(!navLink) {
            return
        }

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLink.classList.add('active-link')
        } else {
            navLink.classList.remove('active-link')
        }
    })
}
window.addEventListener('scroll', scrollActive)


/*=============== LIGHT DARK THEME ===============*/
const themeButton = document.getElementById('theme-button')
const lightTheme = 'light-theme'
const iconTheme = 'bx-sun'

// Previously selected topic (if user selected)
const selectedTheme = localStorage.getItem('selected-theme')
const selectedIcon = localStorage.getItem('selected-icon')

// We obtain the current theme that the interface has by validating the light-theme class
const getCurrentTheme = () => document.body.classList.contains(lightTheme) ? 'light' : 'dark'
const getCurrentIcon = () => themeButton.classList.contains(iconTheme) ? 'bx bx-sun' : 'bx bx-moon'

// We validate if the user previously chose a topic
if (selectedTheme) {
  // If the validation is fulfilled, we ask what the issue was to know if we activated or deactivated the light
  document.body.classList[selectedTheme === 'light' ? 'add' : 'remove'](lightTheme)
  themeButton.classList[selectedIcon === 'bx bx-sun' ? 'add' : 'remove'](iconTheme)
}

// Activate / deactivate the theme manually with the button
themeButton.addEventListener('click', () => {
    // Add or remove the light / icon theme
    document.body.classList.toggle(lightTheme)
    themeButton.classList.toggle(iconTheme)
    // We save the theme and the current icon that the user chose
    localStorage.setItem('selected-theme', getCurrentTheme())
    localStorage.setItem('selected-icon', getCurrentIcon())
})

/*=============== BURGER MENU ===============*/
const navToggle = document.getElementById('nav-toggle')
const navOverlay = document.getElementById('nav-overlay')

if (navToggle && navOverlay) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active')
        navOverlay.classList.toggle('active')
    })

    // Close menu when clicking on a link
    navOverlay.querySelectorAll('.nav__link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active')
            navOverlay.classList.remove('active')
        })
    })

    // Close menu when clicking outside
    navOverlay.addEventListener('click', (e) => {
        if (e.target === navOverlay) {
            navToggle.classList.remove('active')
            navOverlay.classList.remove('active')
        }
    })
}

/*=============== SCROLL REVEAL ANIMATION ===============*/
const sr = ScrollReveal({
    origin: 'top',
    distance: '60px',
    duration: 2500,
    delay: 400,
})

// Home
sr.reveal(`.home__data`)
sr.reveal(`.home__handle`, {delay: 700})
sr.reveal(`.home__social, .home__scroll`, {delay: 900, origin: 'bottom'})

// About
sr.reveal(`.about__logo`, {origin: 'left', delay: 500})
sr.reveal(`.about__data`, {origin: 'right', delay: 600})
sr.reveal(`.about__box`, {interval: 100, delay: 700})

// Skills
sr.reveal(`.skills__content`, {origin: 'left', interval: 200})

// Services
sr.reveal(`.services__card`, {interval: 150})

// Work
sr.reveal(`.work__filters`, {delay: 300})
sr.reveal(`.work__card`, {interval: 100, delay: 400})

// Pillars
sr.reveal(`.pillars__card`, {interval: 100, delay: 300})

// Testimonial
sr.reveal(`.testimonial__container`, {delay: 300})

// Contact
sr.reveal(`.contact__title`, {delay: 300})
sr.reveal(`.contact__card`, {interval: 100, delay: 400})
sr.reveal(`.contact__form`, {origin: 'bottom', delay: 500})

// Section titles
sr.reveal(`.section__subtitle`, {delay: 200})
sr.reveal(`.section__title`, {delay: 300})

/*=============== RANDOM HERO IMAGE ROTATION ===============*/
const heroImg = document.getElementById('hero-img');
const heroImages = [
    'assets/img/hero/do_more.jpg',
    'assets/img/hero/dashboard.jpg',
    'assets/img/hero/social_media.jpg',
    'assets/img/hero/tripod_setup.jpg',
    'assets/img/hero/mac_timeline.jpg',
    'assets/img/hero/timeline.jpg',
    'assets/img/hero/production.jpg'
];

if (heroImg) {
    let currentImageIndex = 0;

    function rotateHeroImage() {
        // Create a list of indexes excluding the current one to ensure change
        const availableIndexes = heroImages
            .map((_, index) => index)
            .filter(index => index !== currentImageIndex);

        // Pick a random index from available ones
        const randomIndex = availableIndexes[Math.floor(Math.random() * availableIndexes.length)];
        currentImageIndex = randomIndex;

        // Apply fade out
        heroImg.style.opacity = '0';

        setTimeout(() => {
            heroImg.src = heroImages[currentImageIndex];
            heroImg.style.opacity = '1';
        }, 600); // Match transition duration in CSS
    }

    // Change image every 5 seconds
    setInterval(rotateHeroImage, 5000);
}

/*=============== CONTACT FORM ===============*/
const contactForm = document.querySelector('.contact__form')

if (contactForm) {
    const contactStatus = contactForm.querySelector('.contact__form-status')
    const contactSubmitButton = contactForm.querySelector('.contact__form-submit')
    const webhookUrl = contactForm.dataset.webhookUrl || 'https://flows.soul23.cloud/webhook/OvJ8A25svipYxC8OQ60tT1'

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault()

        const formData = new FormData(contactForm)
        const payload = {
            name: formData.get('name')?.toString().trim() || '',
            email: formData.get('email')?.toString().trim() || '',
            phone: formData.get('phone')?.toString().trim() || '',
            industry: formData.get('industry')?.toString() || '',
            commentType: formData.get('commentType')?.toString() || '',
            message: formData.get('message')?.toString().trim() || '',
            businessName: formData.get('businessName')?.toString().trim() || '',
            page: window.location.href,
            submittedAt: new Date().toISOString(),
            website: formData.get('website')?.toString().trim() || '',
        }

        contactStatus.classList.remove('is-success', 'is-error')

        if (payload.website) {
            contactForm.reset()
            return
        }

        const validationError = validateStaticContactPayload(payload)

        if (validationError) {
            contactStatus.textContent = validationError
            contactStatus.classList.remove('is-success')
            contactStatus.classList.add('is-error')
            return
        }

        contactSubmitButton.disabled = true
        contactStatus.textContent = 'Enviando solicitud...'

        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            })

            if (!response.ok) {
                throw new Error(`Webhook responded with ${response.status}`)
            }

            contactForm.reset()
            contactStatus.textContent = 'Solicitud enviada. Te contactaremos pronto.'
            contactStatus.classList.add('is-success')
        } catch (error) {
            contactStatus.textContent = 'No se pudo enviar la solicitud. Intenta de nuevo o escríbenos por WhatsApp.'
            contactStatus.classList.add('is-error')
        } finally {
            contactSubmitButton.disabled = false
        }
    })
}

function validateStaticContactPayload(payload) {
    if (payload.name.length < 2) {
        return 'Ingresa un nombre valido.'
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
        return 'Ingresa un email valido.'
    }

    if (payload.phone && payload.phone.length < 8) {
        return 'Ingresa un telefono valido.'
    }

    if (!payload.industry) {
        return 'Selecciona el tipo de negocio.'
    }

    if (!payload.commentType) {
        return 'Selecciona el sistema requerido.'
    }

    if (payload.message.length < 10) {
        return 'Describe el objetivo con un poco mas de detalle.'
    }

    return ''
}
