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

export const constructWetSignal = (audioCtx, {bufferSource, gain, convolver}) => {

	if (bufferSource !== undefined && gain !== undefined && convolver !== undefined) {

		bufferSource.connect(convolver);

		convolver.connect(gain);

		gain.connect(audioCtx.destination);
	}
};


export const constructDrySignal = (audioCtx, {bufferSource, gain}) => {
	if (bufferSource !== undefined && gain !== undefined) {
		let dryGain = audioCtx.createGain();

		dryGain.gain.value = gain.value;

		bufferSource.connect(dryGain);

		dryGain.connect(audioCtx.destination);
	}
};

export const constructAudioGraph = (audioCtx, {buffer, reverb, gainInputs}) => {

	let bufferSource = makeBufferSource(audioCtx, buffer);

	let convolver = createConvolverNode(audioCtx, reverb);

	let wetGain = constructWetGain(audioCtx, gainInputs.wet);

	constructWetSignal(audioCtx, {bufferSource, gain: wetGain, convolver});

	constructDrySignal(audioCtx, {gain: gainInputs.dry, bufferSource});

	bufferSource.start();
};