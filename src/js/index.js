import 'core-js/stable';
import 'regenerator-runtime/runtime';

import '../scss/style.scss';

import kickDrumMp3 from '../sounds/kick-drum.mp3';
import snareDrumMp3 from '../sounds/snare-drum.mp3';
import hiHatMp3 from '../sounds/hi-hat.mp3';
import tomTomMp3 from '../sounds/tom.mp3';
import hallReverbMp3 from '../sounds/hall-reverb.mp3';
import longReverbMp3 from '../sounds/long-reverb.mp3';

let samples = [
	{type: 'sound', name: 'kick', src: kickDrumMp3},
	{type: 'sound', name: 'snare', src: snareDrumMp3},
	{type: 'sound', name: 'hi-hat', src: hiHatMp3},
	{type: 'sound', name: 'tom', src: tomTomMp3},
	{type: 'reverb', name: 'hall', src: hallReverbMp3},
	{type: 'reverb', name: 'long', src: longReverbMp3}
];

const AudioContext = window.AudioContext || window.webkitAudioContext;
let audioCtx;



import {fetchArrayBuffers} from './fetchArrayBuffers';
import {decodeSampleBuffers} from './decodeSampleBuffers';
import {createGainInputs} from './createGainInputs';
import {createSections} from './createSections';
import {createButtons} from './createButtons';
import {addEventListeners} from './addEventListeners';
import {createConvolverNode, constructWetGain, makeBufferSource, constructWetSignal, constructDrySignal} from './constructAudioGraph';

let gainInputs;
let currentReverb;

const init = () => {
	startButton.remove();

	audioCtx = new AudioContext();

	if (audioCtx) {

		fetchArrayBuffers(samples).then(() => {

			decodeSampleBuffers(audioCtx, samples).then(() => {
				gainInputs = createGainInputs();
				createSections();
				createButtons(samples);

				for (let i = 0; i < samples.length; i++) {
					samples[i].button.onclick = () => {
						let bufferSource = makeBufferSource(audioCtx, samples[i].buffer);

						let convolver = createConvolverNode(audioCtx, currentReverb);

						let wetGain = constructWetGain(audioCtx, gainInputs.wet);

						constructWetSignal(audioCtx, {bufferSource, convolver, wetGain});

						constructDrySignal(audioCtx, {gain: gainInputs.dry, bufferSource});

						bufferSource.start();

					};
				}
			});
		});



	} else {
		console.log('web audio api not supported');
	}

};

let startButton = document.createElement('button');

startButton.innerHTML = 'Start';

startButton.onclick = init;

document.body.append(startButton);

