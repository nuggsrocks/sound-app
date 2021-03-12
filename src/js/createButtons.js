export const createButtons = (samples) => {
	Object.keys(samples).forEach(key => {
		samples[key].forEach(sample => {
			let button = document.createElement('button');

			button.innerHTML = sample.name;

			document.querySelector('section#' + key).append(button);

			sample.button = button;
		})
	})

};