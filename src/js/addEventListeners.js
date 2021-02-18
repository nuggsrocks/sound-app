import {
	constructAudioGraph
} from './constructAudioGraph';

export const addEventListeners = (audioCtx, {samples, state}) => {

	if (samples !== undefined &&  state !== undefined) {
		for (let i = 0; i < samples.length; i++) {
			samples[i].button.onclick = () => onButtonClick(samples[i], state);
		}
	}

};