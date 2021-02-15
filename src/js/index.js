import '../scss/style.scss';

import kickDrumMp3 from '../sounds/kick-drum.mp3';
import snareDrumMp3 from '../sounds/snare-drum.mp3';
import hiHatMp3 from '../sounds/hi-hat.mp3';
import tomTomMp3 from '../sounds/tom.mp3';
import hallReverbMp3 from '../sounds/hall-reverb.mp3';
import longReverbMp3 from '../sounds/long-reverb.mp3';

let sounds = {
	kick: [
		kickDrumMp3
	],
	snare: [
		snareDrumMp3
	],
	hihat: [
		hiHatMp3
	],
	tom: [
		tomTomMp3
	]
};

let reverbs = {
	hall: [
		hallReverbMp3
	],
	long: [
		longReverbMp3
	]
};



const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx = new AudioContext();


function decodeSound(soundObject) {

	let xhr = new XMLHttpRequest();

	xhr.open('get', soundObject.file, true);

	xhr.responseType = 'arraybuffer';

	xhr.onload = () => {

		audioCtx.decodeAudioData(xhr.response)
			.then(buffer => {
				addButton({name: soundObject.name, buffer, type: soundObject.type});
			})
			.catch(err => console.error(err));

	};

	xhr.send();



	
}


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

	button.innerHTML = sound.name;

	if (sound.type === 'reverb') {
		button.onclick = () => {
			currentReverb = sound.buffer;
		};
	} else {
		button.onclick = () => {

			if (audioCtx.state === 'suspended') {
				audioCtx.resume().then(() => {
					createAudioGraph(sound.buffer);
				});
			} else {
				createAudioGraph(sound.buffer);
			}
		};
	}

	document.querySelector('section#' + sound.type).append(button);
};

if (audioCtx) {

	for (let i = 0; i < Object.keys(reverbs).length; i++) {
		let key = Object.keys(reverbs)[i];

		decodeSound({name: key, file: reverbs[key], type: 'reverb'});
	}

	for (let i = 0; i < Object.keys(sounds).length; i++) {
		let key = Object.keys(sounds)[i];

		decodeSound({name: key, file: sounds[key], type: 'sound'});
	}


} else {
	console.log('web audio api not supported');
}

