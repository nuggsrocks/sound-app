import '../scss/style.scss';

import kickDrumMp3 from '../sounds/kick-drum.mp3';
import snareDrumMp3 from '../sounds/snare-drum.mp3';
import hiHatMp3 from '../sounds/hi-hat.mp3';
import tomTomMp3 from '../sounds/tom.mp3';
import hallReverbMp3 from '../sounds/hall-reverb.mp3';
import longReverbMp3 from '../sounds/long-reverb.mp3';

let files = [
	{type: 'sound', name: 'kick', src: kickDrumMp3},
	{type: 'sound', name: 'snare', src: snareDrumMp3},
	{type: 'sound', name: 'hi-hat', src: hiHatMp3},
	{type: 'sound', name: 'tom', src: tomTomMp3},
	{type: 'reverb', name: 'hall', src: hallReverbMp3},
	{type: 'reverb', name: 'long', src: longReverbMp3}
];

let filesLoaded = 0;

function decodeSounds() {
	let file = files[filesLoaded];

	let xhr = new XMLHttpRequest();

	xhr.open('get', file.src, true);

	xhr.responseType = 'arraybuffer';

	xhr.onload = () => {

		audioCtx.decodeAudioData(xhr.response)
			.then(buffer => {
				decodedSoundFiles.push({type: file.type, name: file.name, src: buffer});

				filesLoaded++;

				if (filesLoaded === files.length) {
					createGainInputs();
					return;
				}

				decodeSounds();

			})
			.catch(err => console.error(err));

	};

	xhr.send();

}

let decodedSoundFiles = [];





const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;

let gainInputs = {
	dry: null,
	wet: null
};

const createGainInputs = () => {

	let keys = Object.keys(gainInputs);

	for (let key of keys) {
		gainInputs[key] = document.createElement('input');
		gainInputs[key].type = 'range';
		gainInputs[key].min = '0';
		gainInputs[key].max = '1.5';
		gainInputs[key].value = '1';
		gainInputs[key].step = '0.05';

		let inputLabel = document.createElement('label');
		inputLabel.textContent = key;

		inputLabel.append(gainInputs[key]);

		document.body.append(inputLabel);
	}

	createSections();
};

const createSections = () => {
	let sections = ['reverb', 'sound'];

	for (let section of sections) {
		let element = document.createElement('section');

		element.id = section;

		document.body.append(element);
	}


	createButtons();
};

let currentReverb;

const createButtons = () => {
	decodedSoundFiles.forEach(buffer => {
		let button = document.createElement('button');

		button.innerHTML = buffer.name;

		if (buffer.type === 'reverb') {
			button.onclick = () => {
				currentReverb = buffer.src;
			};
		} else {
			button.onclick = () => {
				createAudioGraph(buffer.src);
			};
		}

		document.querySelector('section#' + buffer.type).append(button);
	});

};


const createAudioGraph = (audioBuffer) => {

	let bufferSource = audioCtx.createBufferSource();

	bufferSource.buffer = audioBuffer;


	// wet signal
	let convolver = audioCtx.createConvolver();

	convolver.buffer = currentReverb;

	let wetGain = audioCtx.createGain();

	wetGain.gain.value = gainInputs.wet.value;

	bufferSource.connect(convolver);

	convolver.connect(wetGain);

	wetGain.connect(audioCtx.destination);



	// dry signal
	let dryGain = audioCtx.createGain();

	dryGain.gain.value = gainInputs.dry.value;

	bufferSource.connect(dryGain);

	dryGain.connect(audioCtx.destination);

	bufferSource.start();
};

const init = () => {
	startButton.remove();

	audioCtx = new AudioContext();

	if (audioCtx) {
		decodeSounds();

	} else {
		console.log('web audio api not supported');
	}

};

let startButton = document.createElement('button');

startButton.innerHTML = 'Start';

startButton.onclick = init;

document.body.append(startButton);

