const Alexa = require("ask-sdk-core");
const dynamoDBUtils = require("./utils");

// user starts skill
/*
	what are we doing here?
	1) check how many times the user has started the app (and save it in dynamodb)
	2) depending on the amount of visits, play a different speech (in this case for the first, second and all other visits)
	3) play audio stream
*/
const LaunchRequestHandler = {
	canHandle(handlerInput) {
		return Alexa.getRequestType(handlerInput.requestEnvelope) === "LaunchRequest";
	},
	async handle(handlerInput) {
		const userId = Alexa.getUserId(handlerInput.requestEnvelope);

		// load data from database for this user
		const item = await dynamoDBUtils.getItem(userId);

		// figure out the amount of visits from this user
		let visitCount = 1;
		if (item["visitCount"]) {
			visitCount = parseInt(item["visitCount"]["N"]);
		}

		// prepare vocal response
		let speechResponse = "Willkommen zurück";
		if (visitCount === 1) {
			speechResponse = "Hallo, das ist die Erstbegrüßung.";
		} else if (visitCount === 2) {
			speechResponse = "Hallo, das ist die Zweitbegrüßung.";
		}

		// save amount of visits in db
		await dynamoDBUtils.saveItem(userId, visitCount + 1);

		return (
			handlerInput.responseBuilder
				.speak(speechResponse)
				.addAudioPlayerPlayDirective("REPLACE_ALL", "https://wdr-wdr2-rheinland.icecastssl.wdr.de/wdr/wdr2/rheinland/mp3/128/stream.mp3", "0", 0)
				.getResponse()
		);
	},
};

// resume radio playback
const ResumeHandler = {
	canHandle(handlerInput) {
		return Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" && Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.ResumeIntent";
	},
	async handle(handlerInput) {
		return (
			handlerInput.responseBuilder
				.addAudioPlayerPlayDirective("REPLACE_ALL", "https://wdr-wdr2-rheinland.icecastssl.wdr.de/wdr/wdr2/rheinland/mp3/128/stream.mp3", "0", 0)
				.getResponse()
		);
	},
};

// pause radio playblack
const PauseHandler = {
	canHandle(handlerInput) {
		return Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" && Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.PauseIntent";
	},
	async handle(handlerInput) {
		return handlerInput.responseBuilder.addAudioPlayerStopDirective().getResponse();
	},
};

// handler for generic audio events
const AudioPlayerHandler = {
	canHandle(handlerInput) {
		return handlerInput.requestEnvelope.request.type.startsWith('AudioPlayer.');
	},
	async handle(handlerInput) {
		return handlerInput.responseBuilder.getResponse();
	}
}

const FinishHandler = {
	canHandle(handlerInput) {
		// check if "cancel" or "stop" is intented
		return (
			Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
			(Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.CancelIntent" || Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.StopIntent" || Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.NavigateHomeIntent")
		);
	},
	handle(handlerInput) {
		return handlerInput.responseBuilder.speak("Tschüss und bis zum nächsten mal!").getResponse();
	},
};

// generic fallback handler
const FallbackHandler = {
	canHandle(handlerInput) {
		return Alexa.getRequestType(handlerInput.requestEnvelope) === "FallbackIntent";
	},
	handle(handlerInput) {
		const speakOutput = "Sorry, das weiß ich leider nicht. Möchtest du es nochmal versuchen?";

		return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse();
	},
};

// generic error handler
const ErrorHandler = {
	canHandle() {
		return true;
	},
	handle(handlerInput, error) {
		const speakOutput = "Sorry, das weiß ich leider nicht. Möchtest du es nochmal versuchen?";
		console.error("ERROR:", error);

		return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse();
	},
};

// user (or alexa) ends the skill
const SessionEndedRequestHandler = {
	canHandle(handlerInput) {
		return Alexa.getRequestType(handlerInput.requestEnvelope) === "SessionEndedRequest";
	},
	handle(handlerInput) {
		return handlerInput.responseBuilder.getResponse();
	},
};

module.exports.skill = Alexa.SkillBuilders.custom()
	.addRequestHandlers(
		LaunchRequestHandler,
		ResumeHandler,
		PauseHandler,
		AudioPlayerHandler,
		FallbackHandler,
		FinishHandler,
		SessionEndedRequestHandler
	)
	.addErrorHandlers(ErrorHandler)
	.lambda();
