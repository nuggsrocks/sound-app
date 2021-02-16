export const decodeSampleBuffers = async (audioCtx, samples) => {
	try {

		for (let i = 0; i < samples.length; i++) {

			samples[i].buffer = await audioCtx.decodeAudioData(samples[i].buffer);

		}
	} catch(e) {
		console.error(e);
	}
};