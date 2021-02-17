import {makeBufferSource, createConvolverNode} from './constructAudioGraph';

export const addEventListeners = (samples) => {
	samples.forEach(sample => {
		let onClick;

		if (sample.type === 'sound') {
			onClick = () => {
				let bufferSource = makeBufferSource();

				let convolver = createConvolverNode();


			};
		} else {
			onClick = () => {};
		}

		sample.button.onclick = onClick;
	});
};