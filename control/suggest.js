let fs = require('fs'),
	Fuse = require('fuse.js');

let names = fs.readFileSync('data/names.txt', 'UTF-8').split('\n').reverse(),
	books = fs.readFileSync('data/books.txt', 'UTF-8').split('\n').reverse(),
	allPossibilities = names.concat(books).map(l => l.trim()).filter(l => l);

let fuse = new Fuse(
	allPossibilities,
	{
		shouldSort: true,
		includeMatches: true,
		threshold: 0.7,
		location: 0,
		distance: 50,
		maxPatternLength: 32,
		minMatchCharLength: 1
	}
);

module.exports = function(entry) {
	if (!entry) {
		return { text: '', html: '' };
	}
	let search = entry,
		reference = '',
		bookNumberFinder = /^(\d)([a-z])/i,
		// TODO: Need to support complex references like 2:1, 3:1
		referenceFinder = / ?(\d+):?([-,\da-h ]*)$/i;
	if (referenceFinder.test(search)) {
		reference = search.match(referenceFinder);
		search = search.replace(referenceFinder, '');
	}
	if (bookNumberFinder.test(search)) {
		search = search.replace(bookNumberFinder, '$1 $2');
	}
	let results = fuse.search(search);
	if (search.indexOf('/') === -1 && results.length) {
		let match = results[0].matches[0],
			value = match.value,
			html = value;
		for (let i = match.indices.length - 1; i >= 0; i--) {
			let index = match.indices[i];
			html = `${html.slice(0, index[0]) || ''}<em>${html.slice(index[0], index[1] + 1)}</em>${html.slice(index[1] + 1) || ''}`
		}
		let suffix = (value && reference ? ' ' : '')
			+ (reference ? reference[1] + (reference[2] ? ':' : '') + reference[2] : '');
		return { text: value + suffix, html: html + suffix };
	}
	else {
		return { text: entry, html: entry };
	}
};
