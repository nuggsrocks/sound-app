export const decodeSampleBuffers = async (audioCtx, samples) => {
	try {

		for (let i = 0; i < samples.length; i++) {
			if (samples[i].src !== undefined) {
				samples[i].buffer = await new Promise((resolve, reject) => {
					audioCtx.decodeAudioData(samples[i].buffer,
							buffer => resolve(buffer),
							err => reject(err));
				});
			} else {
				samples[i].buffer = undefined;
			}
		}
	} catch(e) {
		console.error(e);
	}
};