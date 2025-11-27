const cepForm = document.querySelector('#cep-form');
const cepInput = document.querySelector('#cep');
const cepFeedback = document.querySelector('.hero__feedback');
const leadForm = document.querySelector('#lead-form');
const leadFeedback = document.querySelector('.form__feedback');
const maskCep = (value) => {
	const digits = value.replace(/\D/g, '').slice(0, 8);
	if (digits.length <= 5) {
		return digits;
	}
	return `${digits.slice(0, 5)}-${digits.slice(5, 8)}`;
};
const isValidCep = (value) => /^\d{5}-\d{3}$/.test(value);
const simulateAvailability = (cep) => {
	const available = parseInt(cep.replace(/\D/g, ''), 10) % 2 === 0;
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve({ available, message: available ? 'Vero disponível na sua região. Solicite já!' : 'Ainda não chegamos nesse CEP, mas registre seu interesse.' });
		}, 900);
	});
};
cepInput &&
	cepInput.addEventListener('input', (event) => {
		event.target.value = maskCep(event.target.value);
	});
cepForm &&
	cepForm.addEventListener('submit', async (event) => {
		event.preventDefault();
		const cepValue = cepInput.value.trim();
		if (!isValidCep(cepValue)) {
			cepFeedback.textContent = 'Digite um CEP válido (00000-000).';
			cepFeedback.style.color = '#FFE51B';
			return;
		}
		const submitButton = cepForm.querySelector('button[type="submit"]');
		submitButton.disabled = true;
		submitButton.textContent = 'Consultando...';
		cepFeedback.textContent = '';
		const response = await simulateAvailability(cepValue);
		cepFeedback.textContent = response.message;
		cepFeedback.style.color = response.available ? '#00FFB2' : '#FFE51B';
		submitButton.disabled = false;
		submitButton.textContent = 'Consultar';
	});
const validateField = (field) => {
	if (!field) return true;
	const value = field.value.trim();
	if (!value && field.hasAttribute('required')) {
		field.classList.add('is-invalid');
		return false;
	}
	if (field.type === 'email') {
		const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
		if (!valid) {
			field.classList.add('is-invalid');
			return false;
		}
	}
	field.classList.remove('is-invalid');
	return true;
};
leadForm &&
	leadForm.addEventListener('submit', (event) => {
		event.preventDefault();
		const fields = [leadForm.nome, leadForm.email, leadForm.telefone];
		const isBot = leadForm.website.value.trim() !== '';
		let valid = true;
		fields.forEach((field) => {
			if (!validateField(field)) {
				valid = false;
			}
		});
		if (!valid || isBot) {
			leadFeedback.textContent = 'Revise os campos destacados.';
			leadFeedback.style.color = '#FFE51B';
			return;
		}
		leadFeedback.textContent = 'Enviando...';
		leadFeedback.style.color = '#fff';
		const payload = { nome: leadForm.nome.value.trim(), email: leadForm.email.value.trim(), telefone: leadForm.telefone.value.trim(), empresa: leadForm.empresa.value.trim() };
		setTimeout(() => {
			console.log('Lead pronto para envio', payload);
			leadFeedback.textContent = 'Recebemos seus dados! Em instantes entraremos em contato.';
			leadFeedback.style.color = '#00FFB2';
			leadForm.reset();
		}, 1100);
	});
