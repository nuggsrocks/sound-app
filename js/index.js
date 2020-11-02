import '../scss/style.scss';
import axios from 'axios';

// polyfilling ecmascript
import 'core-js/stable';
import 'regenerator-runtime/runtime';

import kickDrumWav from '../sounds/kick-drum.wav';
import kickDrumMp3 from '../sounds/kick-drum.mp3';
import snareDrumWav from '../sounds/snare-drum.wav';
import snareDrumMp3 from '../sounds/snare-drum.mp3';
import hiHatWav from '../sounds/hi-hat.wav';
import hiHatMp3 from '../sounds/hi-hat.mp3';
import tomTomWav from '../sounds/tom.wav';
import tomTomMp3 from '../sounds/tom.mp3';
import hallReverbWav from '../sounds/hall-reverb.wav';
import hallReverbMp3 from '../sounds/hall-reverb.mp3';
import longReverbWav from '../sounds/long-reverb.wav';
import longReverbMp3 from '../sounds/long-reverb.mp3';

let sounds = {
	kick: [
		kickDrumWav,
		kickDrumMp3
	],
	snare: [
		snareDrumWav,
		snareDrumMp3
	],
	hihat: [
		hiHatWav,
		hiHatMp3
	],
	tom: [
		tomTomWav,
		tomTomMp3
	]
};

let reverbs = {
	hall: [
		hallReverbWav,
		hallReverbMp3
	],
	long: [
		longReverbWav,
		longReverbMp3
	]
};



const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = new AudioContext();

function decodeSound(soundObject) {

	axios.get(soundObject.file, {responseType: 'arraybuffer'})
		.then(result => {
			audioCtx.decodeAudioData(result.data, buffer => {
				addButton({name: soundObject.name, buffer, type: soundObject.type});
			}, err => console.error(err));
		})
		.catch(e => console.error(e));

	
}

const setAudioType = () => {
	let audio = document.createElement('audio');

	return audio.canPlayType('audio/wav');
};


const createAudioGraph = (audioBuffer) => {
	let bufferSource = audioCtx.createBufferSource();

	bufferSource.buffer = audioBuffer;


	// wet signal
	let convolver = audioCtx.createConvolver();

	convolver.buffer = currentReverb;

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



let currentReverb;

const addButton = (sound) => {
	let button = document.createElement('button');

	if (sound.type === 'reverb') {
		button.innerHTML = sound.name;
		button.onclick = () => {
			currentReverb = sound.buffer;
		};
	} else {
		button.onclick = () => {
			createAudioGraph(sound.buffer);
		};
	}

	document.querySelector('section#' + sound.type).append(button);
};

if (audioCtx) {
	let audioType;
	if (setAudioType() === 'probably') {
		audioType = 0;
	} else {
		audioType = 1;
	}

	let reverbFiles = {};
	let soundFiles = {};


	Object.keys(reverbs).forEach(reverbName => reverbFiles[reverbName] = reverbs[reverbName][audioType]);
	Object.keys(sounds).forEach(soundName => soundFiles[soundName] = sounds[soundName][audioType]);

	for (let i = 0; i < Object.keys(reverbFiles).length; i++) {
		let key = Object.keys(reverbFiles)[i];

		decodeSound({name: key, file: reverbFiles[key], type: 'reverb'});
	}

	for (let i = 0; i < Object.keys(soundFiles).length; i++) {
		let key = Object.keys(soundFiles)[i];

		decodeSound({name: key, file: soundFiles[key], type: 'sound'});
	}


} else {
	console.log('web audio api not supported');
}

