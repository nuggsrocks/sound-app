export const createSections = () => {
	let sections = ['reverb', 'sound'];

	for (let section of sections) {
		let element = document.createElement('section');

		element.id = section;

		document.body.append(element);
	}
};