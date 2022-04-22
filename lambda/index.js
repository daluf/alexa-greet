'use strict';

module.exports.handler = async (_event, _context, callback) => {
	const response = {
		version: '1.0',
		response: {
			outputSpeech: {
				type: 'PlainText',
				text: "Hello There",
			},
			shouldEndSession: false,
		}
	};

	callback(null, response);
}
