export const createButtons = (samples) => {
	samples.forEach(sample => {
		let button = document.createElement('button');

		button.innerHTML = sample.name;

		document.querySelector('section#' + sample.type).append(button);

		sample.button = button;
	});

};