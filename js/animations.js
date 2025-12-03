const initAnimations = () => {
	if (window.AOS) {
		AOS.init({ duration: 700, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', once: false, offset: 40 });
	}
};
const initLazyLoading = () => {
	const lazyElements = document.querySelectorAll('img[data-src],source[data-srcset]');
	if (!('IntersectionObserver' in window) || !lazyElements.length) {
		lazyElements.forEach((el) => {
			if (el.dataset.src) {
				el.src = el.dataset.src;
			}
			if (el.dataset.srcset) {
				el.srcset = el.dataset.srcset;
			}
			el.classList.add('loaded');
		});
		return;
	}
	const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
	const imageObserver = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				const target = entry.target;
				if (target.dataset.src) {
					target.src = target.dataset.src;
				}
				if (target.dataset.srcset) {
					target.srcset = target.dataset.srcset;
				}
				target.classList.add('loaded');
				imageObserver.unobserve(target);
			}
		});
	}, observerOptions);
	lazyElements.forEach((img) => imageObserver.observe(img));
};
const initHeroOrbs = () => {
	const hero = document.querySelector('.hero');
	if (!hero) return;
	const orbColors = ['rgba(255,229,27,0.25)', 'rgba(250,109,145,0.35)', 'rgba(243,159,63,0.3)'];
	orbColors.forEach((color, index) => {
		const orb = document.createElement('span');
		orb.className = 'hero__orb';
		orb.style.background = color;
		orb.style.animationDelay = `${index * 1.5}s`;
		orb.style.top = `${20 + index * 15}%`;
		orb.style.left = `${index % 2 === 0 ? 5 : 70}%`;
		hero.appendChild(orb);
	});
};
document.addEventListener('DOMContentLoaded', () => {
	initAnimations();
	initLazyLoading();
	initHeroOrbs();
});
