const navToggle = document.querySelector('.hero__toggle');
const navMenu = document.querySelector('.hero__menu');
const navLinks = document.querySelectorAll('.hero__menu a[href^="#"]');
if (navToggle && navMenu) {
	navToggle.addEventListener('click', () => {
		const expanded = navToggle.getAttribute('aria-expanded') === 'true';
		navToggle.setAttribute('aria-expanded', (!expanded).toString());
		navMenu.classList.toggle('is-open');
	});
}
navLinks.forEach((link) => {
	link.addEventListener('click', (event) => {
		event.preventDefault();
		const target = document.querySelector(link.getAttribute('href'));
		if (target) {
			target.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
		if (navMenu) {
			navMenu.classList.remove('is-open');
		}
		navToggle && navToggle.setAttribute('aria-expanded', 'false');
	});
});
const sections = document.querySelectorAll('main section[id]');
const observer = new IntersectionObserver(
	(entries) => {
		entries.forEach((entry) => {
			const id = entry.target.getAttribute('id');
			const navLink = document.querySelector(`.hero__menu a[href="#${id}"]`);
			if (navLink) {
				if (entry.isIntersecting) {
					navLinks.forEach((link) => link.classList.remove('is-active'));
					navLink.classList.add('is-active');
				}
			}
		});
	},
	{ threshold: 0.6 }
);
sections.forEach((section) => observer.observe(section));
const scrollTopButton = document.querySelector('.scroll-top');
window.addEventListener('scroll', () => {
	if (window.scrollY > 600) {
		scrollTopButton.classList.add('is-visible');
	} else {
		scrollTopButton.classList.remove('is-visible');
	}
});
scrollTopButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
const year = document.getElementById('year');
if (year) {
	year.textContent = new Date().getFullYear();
}
const accordionTriggers = document.querySelectorAll('.accordion__trigger');
accordionTriggers.forEach((trigger) => {
	trigger.addEventListener('click', () => {
		const item = trigger.parentElement;
		const expanded = trigger.getAttribute('aria-expanded') === 'true';
		accordionTriggers.forEach((btn) => {
			btn.setAttribute('aria-expanded', 'false');
			btn.parentElement.classList.remove('is-open');
		});
		if (!expanded) {
			trigger.setAttribute('aria-expanded', 'true');
			item.classList.add('is-open');
		} else {
			trigger.setAttribute('aria-expanded', 'false');
			item.classList.remove('is-open');
		}
	});
});
const scrollLinks = document.querySelectorAll('a[href^="#"]');
scrollLinks.forEach((link) => {
	link.addEventListener('click', (event) => {
		const isMenuLink = link.closest('.hero__menu');
		if (!isMenuLink) {
			event.preventDefault();
			const target = document.querySelector(link.getAttribute('href'));
			if (target) {
				target.scrollIntoView({ behavior: 'smooth' });
			}
		}
	});
});
const heroCarousel = document.querySelector('[data-hero-carousel]');
if (heroCarousel) {
	const slides = Array.from(heroCarousel.querySelectorAll('.hero-carousel__slide'));
	const dots = Array.from(heroCarousel.querySelectorAll('.hero-carousel__dot'));
	const track = heroCarousel.querySelector('.hero-carousel__track');

	if (!track || slides.length === 0) {
		// No slides to initialize.
	} else {
		const totalSlides = slides.length;

		// Criar clones para loop infinito
		const firstClone = slides[0].cloneNode(true);
		const lastClone = slides[totalSlides - 1].cloneNode(true);
		track.insertBefore(lastClone, slides[0]);
		track.appendChild(firstClone);

		let currentIndex = 1; // Começa no primeiro slide real
		let autoTimer = null;
		let isDragging = false;
		let slideWidth = 0;
		let startPos = 0;
		let currentTranslate = 0;
		let prevTranslate = 0;
		let animationID = 0;

		const getPositionX = (event) => {
			return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
		};

		const setSliderPosition = () => {
			track.style.transform = `translateX(${currentTranslate}px)`;
		};

		const setPositionByIndex = () => {
			currentTranslate = currentIndex * -slideWidth;
			prevTranslate = currentTranslate;
			setSliderPosition();
		};

		const updateDots = () => {
			const realIndex = (currentIndex - 1 + totalSlides) % totalSlides;
			dots.forEach((dot, index) => {
				const isActive = index === realIndex;
				dot.classList.toggle('is-active', isActive);
				dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
			});
		};

		const animation = () => {
			setSliderPosition();
			if (isDragging) requestAnimationFrame(animation);
		};

		const startAutoPlay = () => {
			stopAutoPlay();
			autoTimer = setInterval(() => {
				currentIndex++;
				track.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
				setPositionByIndex();
				updateDots();
			}, 10000);
		};

		const stopAutoPlay = () => {
			if (autoTimer) {
				clearInterval(autoTimer);
				autoTimer = null;
			}
		};

		const touchStart = (event) => {
			if (event.target.closest('.hero-carousel__dot')) return;

			// Salvar posição atual antes de iniciar o drag
			startPos = getPositionX(event);
			isDragging = true;
			animationID = requestAnimationFrame(animation);

			track.style.transition = 'none';
			heroCarousel.classList.add('is-dragging');
			stopAutoPlay();

			if (event.type === 'mousedown') {
				event.preventDefault();
			}
		};

		const touchMove = (event) => {
			if (isDragging) {
				const currentPosition = getPositionX(event);
				currentTranslate = prevTranslate + currentPosition - startPos;
			}
		};

		const touchEnd = () => {
			if (!isDragging) return;

			isDragging = false;
			cancelAnimationFrame(animationID);
			heroCarousel.classList.remove('is-dragging');

			const movedBy = currentTranslate - prevTranslate;
			const threshold = slideWidth * 0.25;

			if (movedBy < -threshold && currentIndex < totalSlides + 1) {
				currentIndex += 1;
			} else if (movedBy > threshold && currentIndex > 0) {
				currentIndex -= 1;
			}

			track.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
			setPositionByIndex();
			updateDots();
			startAutoPlay();
		};

		const handleTransitionEnd = () => {
			// Loop infinito
			if (currentIndex === 0) {
				track.style.transition = 'none';
				currentIndex = totalSlides;
				setPositionByIndex();
			} else if (currentIndex === totalSlides + 1) {
				track.style.transition = 'none';
				currentIndex = 1;
				setPositionByIndex();
			}
			updateDots();
		};

		// Event listeners
		track.addEventListener('transitionend', handleTransitionEnd);
		track.addEventListener('mousedown', touchStart);
		track.addEventListener('touchstart', touchStart, { passive: true });
		window.addEventListener('mousemove', touchMove);
		window.addEventListener('touchmove', touchMove, { passive: true });
		window.addEventListener('mouseup', touchEnd);
		window.addEventListener('touchend', touchEnd);

		// Dots
		dots.forEach((dot, index) => {
			dot.addEventListener('click', () => {
				stopAutoPlay();
				currentIndex = index + 1;
				track.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
				setPositionByIndex();
				updateDots();
				startAutoPlay();
			});
		});

		// Prevenir drag de imagens
		heroCarousel.addEventListener('dragstart', (e) => e.preventDefault());

		// Resize
		const updateSize = () => {
			slideWidth = heroCarousel.offsetWidth;
			track.style.transition = 'none';
			setPositionByIndex();
			setTimeout(() => {
				track.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
			}, 50);
		};

		let resizeTimeout;
		window.addEventListener('resize', () => {
			clearTimeout(resizeTimeout);
			resizeTimeout = setTimeout(updateSize, 250);
		});

		// Inicializar
		updateSize();
		updateDots();
		startAutoPlay();
	}
}
