export const createSections = () => {
	let sections = ['reverbs', 'sounds'];

	for (let section of sections) {
		let element = document.createElement('section');

		element.id = section;

		document.body.append(element);
	}
};