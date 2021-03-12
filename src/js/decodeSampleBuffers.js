export const decodeSampleBuffers = async (audioCtx, samples) => {
	try {

		const decodeSamples = async (samples) => {
			try {
				for (let i = 0; i < samples.length; i++) {
					samples[i].buffer = await new Promise((resolve, reject) => {
						audioCtx.decodeAudioData(samples[i].buffer,
							buffer => resolve(buffer),
							err => reject(err));
					});
				}
			} catch(e) {
			    console.error(e);
			}
		};

		await decodeSamples(samples.sounds);
		await decodeSamples(samples.reverbs);

		samples.reverbs.push({name: 'none', buffer: undefined});

	} catch(e) {
		console.error(e);
	}
};