export const makeBufferSource = (audioCtx, audioBuffer) => {
	let bufferSource = audioCtx.createBufferSource();

	bufferSource.buffer = audioBuffer;

	return bufferSource;
};

export const createConvolverNode = (audioCtx, reverbBuffer) => {

	let convolver = audioCtx.createConvolver();

	convolver.buffer = reverbBuffer;

	return convolver;
};

export const constructWetGain = (audioCtx, gain) => {
	let wetGain = audioCtx.createGain();

	wetGain.gain.value = gain.value;

	return wetGain;
};

export const constructWetSignal = (audioCtx, options) => {

	if (options.bufferSource !== undefined && options.gain !== undefined) {

		if (options.convolver !== undefined) {
			options.bufferSource.connect(options.convolver);

			options.convolver.connect(options.gain);

			options.gain.connect(audioCtx.destination);
		}
	}
};

export const constructDrySignal = (audioCtx, options) => {
	if (options.bufferSource !== undefined && options.gain !== undefined) {
		let dryGain = audioCtx.createGain();

		dryGain.gain.value = options.gain.value;

		options.bufferSource.connect(dryGain);

		dryGain.connect(audioCtx.destination);
	}
};