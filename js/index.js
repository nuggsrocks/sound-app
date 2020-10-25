import '../scss/style.scss';
import axios from 'axios';

// polyfilling ecmascript
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import kickDrum from '../sounds/kick-drum.wav';
import snareDrum from '../sounds/snare-drum.wav';
import hiHat from '../sounds/hi-hat.wav';
import tomTom from '../sounds/tom.wav';
import hallReverb from '../sounds/hall-reverb.wav';
import longReverb from '../sounds/long-reverb.wav';

let sounds = {
	kick: kickDrum,
	snare: snareDrum,
	hihat: hiHat,
	tom: tomTom
};

let reverbs = {
	hall: hallReverb,
	long: longReverb
};


let audioCtx = window.AudioContext === undefined ? new window.webkitAudioContext() : new window.AudioContext();

async function decodeSounds(soundsObject) {
	try {
		let soundKeys = Object.keys(soundsObject);

		let buffers = {};

		for (let i = 0; i < soundKeys.length; i++) {
			let result = await axios.get(soundsObject[soundKeys[i]], {responseType: 'arraybuffer'});
			 

			if (window.AudioContext !== undefined) {
				buffers[soundKeys[i]] = await audioCtx.decodeAudioData(result.data);
			} else {
				audioCtx.decodeAudioData(result.data, buffer => {
					buffers[soundKeys[i]] = buffer;
				}, err => console.error(err));
			}
		}

		return buffers;

		
	} catch(e) {
		
		console.error(e);
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

let decodedReverbs = {};
let decodedSounds = {};

let currentReverb = 'hall';

const addSoundButtons = () => {
	let bufferKeys = Object.keys(decodedSounds);

	for (let i = 0; i < bufferKeys.length; i++) {
		let button = document.createElement('button');

		button.onclick = () => {
			createAudioGraph(decodedSounds[bufferKeys[i]]);
		};

		button.append(document.createElement('div'));

		document.querySelector('section#sounds').append(button);
	}
};

const addReverbButtons = () => {
	console.log(decodedReverbs);
	let bufferKeys = Object.keys(decodedReverbs);

	let reverbButtons = [];

	for (let i = 0; i < bufferKeys.length; i++) {
		reverbButtons[i] = document.createElement('button');

		reverbButtons[i].onclick = () => {
			currentReverb = bufferKeys[i];
			reverbButtons[i].style.backgroundColor = 'blue';
			reverbButtons[i === 0 ? 1 : 0].style.backgroundColor = 'white';
		};

		reverbButtons[i].innerHTML = bufferKeys[i];

		if (bufferKeys[i] === currentReverb) {
			reverbButtons[i].style.backgroundColor = 'blue';
		}

		document.querySelector('section#reverbs').append(reverbButtons[i]);
	}
};

if (audioCtx) {
	
	decodeSounds(reverbs).then(reverbBuffers => {
		decodedReverbs = reverbBuffers;

		addReverbButtons();

		decodeSounds(sounds).then(soundBuffers => {

			decodedSounds = soundBuffers;

			addSoundButtons();

		});
	});
} else {
	console.log('web api not supported');
}

