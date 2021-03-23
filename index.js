const request = require('request-promise');
const cheerio = require('cheerio');
const json2csv = require('json2csv').Parser;
const fs = require('fs');

const movies = [
	'https://www.imdb.com/title/tt0242519/?ref_=fn_al_tt_1',
	'https://www.imdb.com/title/tt0848228/?ref_=fn_al_tt_1',
	'https://www.imdb.com/title/tt4154796/?ref_=nv_sr_srsg_0',
];

(async () => {
	let imdbData = [];

	for (let movie of movies) {
		const response = await request({
			uri: movie,
			headers: {
				accept:
					'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
				'accept-encoding': 'gzip, deflate, br',
				'accept-language': 'en-US,en;q=0.9',
			},
			gzip: true,
		});
		let $ = cheerio.load(response);
		let title = $('div [class="title_wrapper"] > h1').text().trim();
		let rating = $('div [class="ratingValue"]> strong > span').text();
		let summary = $('div [class="summary_text"]').text().trim();
		let releaseData = $('a[title="See more release dates"]').text().trim();
		imdbData.push({
			title,
			rating,
			summary,
			releaseData,
		});
	}

	const j2cp = new json2csv();
	const csv = j2cp.parse(imdbData);
	fs.writeFileSync('./imdb.csv', csv, 'utf-8');
})();
