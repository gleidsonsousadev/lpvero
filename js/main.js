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
const cityModal = document.getElementById('city-modal');
const cityForm = document.getElementById('city-form');
const cityInput = document.getElementById('city-search');
const cityResults = document.querySelector('.city-modal__results');
const citySubtitle = document.querySelector('.city-modal__subtitle');
const selectedCity = document.getElementById('selected-city');
const modalOpenButtons = document.querySelectorAll('[data-modal-open]');
const modalCloseElements = document.querySelectorAll('[data-modal-close]');
const cityFeedback = document.querySelector('.city-modal__feedback');
const availableCities = [
	'Belo Horizonte - MG',
	'Blumenau - SC',
	'Passo Fundo - RS',
	'Curitiba - PR',
	'Goiânia - GO',
	'Porto Alegre - RS',
	'Chapecó - SC',
	'Joinville - SC'
];
const formatCityName = (value = '') =>
	value
		.split('-')
		.map((part) =>
			part
				.trim()
				.split(' ')
				.filter(Boolean)
				.map((word) => (word.length <= 2 ? word.toUpperCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()))
				.join(' ')
		)
		.join(' - ');
const clearCityResults = () => {
	if (cityResults) {
		cityResults.innerHTML = '';
		cityResults.classList.remove('is-visible');
	}
	citySubtitle?.classList.remove('is-visible');
};
const renderCityOptions = (value) => {
	if (!cityResults) return;
	const term = value.trim();
	cityResults.innerHTML = '';
	if (!term) {
		clearCityResults();
		return;
	}
	const formatted = formatCityName(term);
	const matches = availableCities.filter((city) => city.toLowerCase().includes(term.toLowerCase()));
	const alreadyExists = matches.some((city) => city.toLowerCase() === formatted.toLowerCase());
	const suggestions = alreadyExists ? matches : [formatted, ...matches];
	citySubtitle?.classList.add('is-visible');
	cityResults.classList.add('is-visible');
	suggestions.forEach((city) => {
		const option = document.createElement('label');
		option.className = 'city-modal__option';
		const radio = document.createElement('input');
		radio.type = 'radio';
		radio.name = 'city-option';
		radio.value = city;
		const text = document.createElement('span');
		text.textContent = city;
		option.append(radio, text);
		cityResults.append(option);
	});
};
const resetCityModalState = () => {
	if (cityInput) cityInput.value = '';
	clearCityResults();
};
const toggleCityModal = (open) => {
	if (!cityModal) return;
	cityModal.classList.toggle('is-active', open);
	cityModal.setAttribute('aria-hidden', (!open).toString());
	document.body.classList.toggle('modal-open', open);
	if (open) {
		resetCityModalState();
		cityFeedback.textContent = '';
		cityInput?.focus();
	} else {
		resetCityModalState();
		cityFeedback.textContent = '';
	}
};
modalOpenButtons.forEach((btn) => btn.addEventListener('click', () => toggleCityModal(true)));
modalCloseElements.forEach((btn) => btn.addEventListener('click', () => toggleCityModal(false)));
cityInput &&
	cityInput.addEventListener('input', (event) => {
		renderCityOptions(event.target.value);
	});
if (cityForm) {
	cityForm.addEventListener('submit', (event) => {
		event.preventDefault();
		const checkedCity = cityForm.querySelector('input[name="city-option"]:checked');
		if (!checkedCity) {
			cityFeedback.textContent = 'Selecione uma cidade para continuar.';
			return;
		}
		cityFeedback.textContent = 'Atualizando cidade...';
		setTimeout(() => {
			if (selectedCity) {
				selectedCity.textContent = checkedCity.value;
			}
			cityFeedback.textContent = 'Cidade atualizada!';
			setTimeout(() => toggleCityModal(false), 500);
		}, 400);
	});
}
document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape') {
		toggleCityModal(false);
	}
});
cityModal &&
	cityModal.addEventListener('click', (event) => {
		if (event.target.matches('.city-modal,.city-modal__overlay')) {
			toggleCityModal(false);
		}
	});
