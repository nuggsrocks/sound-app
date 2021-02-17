export const createGainInputs = () => {

	let gainInputs = {
		dry: null,
		wet: null
	};

	for (let key of Object.keys(gainInputs)) {
		gainInputs[key] = document.createElement('input');
		gainInputs[key].type = 'range';
		gainInputs[key].min = '0';
		gainInputs[key].max = '1.5';
		gainInputs[key].value = '1';
		gainInputs[key].step = '0.05';

		let inputLabel = document.createElement('label');
		inputLabel.textContent = key;

		inputLabel.append(gainInputs[key]);

		document.body.append(inputLabel);
	}

	return gainInputs;
};