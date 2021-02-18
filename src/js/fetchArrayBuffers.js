export const fetchArrayBuffers = async (samples) => {
	try {


		let i = 0;
		while (i < samples.length) {
			samples[i].buffer = await new Promise((resolve, reject) => {
				let soundFile = samples[i].src;

				let xhr = new XMLHttpRequest();

				xhr.open('get', soundFile, true);

				xhr.responseType = 'arraybuffer';

				xhr.onload = () => {
					if (soundFile === undefined) {
						resolve(undefined);
					} else {
						resolve(xhr.response);
					}

				};

				xhr.onerror = () => {
					reject(xhr);
				}

				xhr.send();
			});
			i++;
		}
	} catch(e) {
		console.error(e);
	}

};