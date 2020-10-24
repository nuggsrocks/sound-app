import '../css/style.css';
import axios from 'axios';

// polyfilling ecmascript
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import '../sounds/kick-drum.wav';
import '../sounds/snare-drum.wav';
import '../sounds/hi-hat.wav';
import '../sounds/hall-reverb.wav';
import '../sounds/long-reverb.wav'

let sounds = {
	kick: 'kick-drum.wav',
	snare: 'snare-drum.wav',
	hihat: 'hi-hat.wav'
};

let reverbs = {
	hall: 'hall-reverb.wav',
	long: 'long-reverb.wav'
};

let audioCtx = new (window.AudioContext || window.webkitAudioContext)();

async function decodeSounds(soundsObject) {
	try {
		let soundKeys = Object.keys(soundsObject);

		let buffers = {};

		for (let i = 0; i < soundKeys.length; i++) {
			let result = await axios.get(soundsObject[soundKeys[i]], {responseType: 'arraybuffer'});

			buffers[soundKeys[i]] = await audioCtx.decodeAudioData(result.data);
		}

		return buffers;

		
	} catch(e) {
		
		console.log(e);
	}
}


const createAudioGraph = (audioBuffer) => {
	let bufferSource = audioCtx.createBufferSource();

	bufferSource.buffer = audioBuffer;


	// wet signal
	let convolver = audioCtx.createConvolver();

	convolver.buffer = decodedReverbs[currentReverb];

	let wetGain = audioCtx.createGain();

	let wetGainInput = document.querySelector('#wetGain');

	wetGain.gain.value = wetGainInput.value;

	bufferSource.connect(convolver);

	convolver.connect(wetGain);

	wetGain.connect(audioCtx.destination);
	
	

	// dry signal
	let dryGain = audioCtx.createGain();

	let dryGainInput = document.querySelector('#dryGain');

	dryGain.gain.value = dryGainInput.value;

	bufferSource.connect(dryGain);

	dryGain.connect(audioCtx.destination);
	
	
	


	bufferSource.start();
};

let decodedReverbs, decodedSounds = decodedReverbs = {}

let currentReverb = 'hall';

const addSoundButtons = () => {
	let bufferKeys = Object.keys(decodedSounds);

	for (let i = 0; i < bufferKeys.length; i++) {
		let button = document.createElement('button');

		button.onclick = () => {
			createAudioGraph(decodedSounds[bufferKeys[i]]);
		};

		button.innerHTML = bufferKeys[i];

		document.querySelector('section#sounds').append(button);
	}
};

const addReverbButtons = () => {
	let bufferKeys = Object.keys(decodedReverbs);

	for (let i = 0; i < bufferKeys.length; i++) {
		let button = document.createElement('button');

		button.onclick = () => {
			currentReverb = bufferKeys[i];
		};

		button.innerHTML = bufferKeys[i];

		document.querySelector('section#reverbs').append(button);
	}
};

decodeSounds(reverbs).then(reverbBuffers => {
	decodedReverbs = reverbBuffers;

	addReverbButtons();

	decodeSounds(sounds).then(soundBuffers => {

		decodedSounds = soundBuffers;

		addSoundButtons();

	});
});

