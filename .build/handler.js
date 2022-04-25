"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var Alexa = require("ask-sdk-core");
var dynamoDBUtils = require("./utils");
// user starts skill
/*
    what are we doing here?
    1) check how many times the user has started the app (and save it in dynamodb)
    2) depending on the amount of visits, play a different speech (in this case for the first, second and all other visits)
    3) play audio stream
*/
var LaunchRequestHandler = {
    canHandle: function (handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === "LaunchRequest";
    },
    handle: function (handlerInput) {
        return __awaiter(this, void 0, void 0, function () {
            var userId, item, visitCount, speechResponse;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        userId = Alexa.getUserId(handlerInput.requestEnvelope);
                        return [4 /*yield*/, dynamoDBUtils.getItem(userId)];
                    case 1:
                        item = _a.sent();
                        visitCount = 1;
                        if (item["visitCount"]) {
                            visitCount = parseInt(item["visitCount"]["N"]);
                        }
                        speechResponse = "Willkommen zurück";
                        if (visitCount === 1) {
                            speechResponse = "Hallo, das ist die Erstbegrüßung.";
                        }
                        else if (visitCount === 2) {
                            speechResponse = "Hallo, das ist die Zweitbegrüßung.";
                        }
                        // save amount of visits in db
                        return [4 /*yield*/, dynamoDBUtils.saveItem(userId, visitCount + 1)];
                    case 2:
                        // save amount of visits in db
                        _a.sent();
                        return [2 /*return*/, handlerInput.responseBuilder
                                .speak(speechResponse)
                                .addAudioPlayerPlayDirective("REPLACE_ALL", "https://wdr-wdr2-rheinland.icecastssl.wdr.de/wdr/wdr2/rheinland/mp3/128/stream.mp3", "0", 0)
                                .getResponse()];
                }
            });
        });
    },
};
// resume radio playback
var ResumeHandler = {
    canHandle: function (handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" && Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.ResumeIntent";
    },
    handle: function (handlerInput) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, (handlerInput.responseBuilder
                        .addAudioPlayerPlayDirective("REPLACE_ALL", "https://wdr-wdr2-rheinland.icecastssl.wdr.de/wdr/wdr2/rheinland/mp3/128/stream.mp3", "0", 0)
                        .getResponse())];
            });
        });
    },
};
// pause radio playblack
var PauseHandler = {
    canHandle: function (handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" && Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.PauseIntent";
    },
    handle: function (handlerInput) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, handlerInput.responseBuilder.addAudioPlayerStopDirective().getResponse()];
            });
        });
    },
};
// handler for generic audio events
var AudioPlayerHandler = {
    canHandle: function (handlerInput) {
        return handlerInput.requestEnvelope.request.type.startsWith('AudioPlayer.');
    },
    handle: function (handlerInput) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, handlerInput.responseBuilder.getResponse()];
            });
        });
    }
};
var FinishHandler = {
    canHandle: function (handlerInput) {
        // check if "cancel" or "stop" is intented
        return (Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
            (Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.CancelIntent" || Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.StopIntent" || Alexa.getIntentName(handlerInput.requestEnvelope) === "AMAZON.NavigateHomeIntent"));
    },
    handle: function (handlerInput) {
        return handlerInput.responseBuilder.speak("Tschüss und bis zum nächsten mal!").getResponse();
    },
};
// generic fallback handler
var FallbackHandler = {
    canHandle: function (handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === "FallbackIntent";
    },
    handle: function (handlerInput) {
        var speakOutput = "Sorry, das weiß ich leider nicht. Möchtest du es nochmal versuchen?";
        return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse();
    },
};
// user (or alexa) ends the skill
var SessionEndedRequestHandler = {
    canHandle: function (handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === "SessionEndedRequest";
    },
    handle: function (handlerInput) {
        return handlerInput.responseBuilder.getResponse();
    },
};
// generic error handler
var ErrorHandler = {
    canHandle: function () {
        return true;
    },
    handle: function (handlerInput, error) {
        var speakOutput = "Sorry, das weiß ich leider nicht. Möchtest du es nochmal versuchen?";
        console.error("ERROR:", error);
        return handlerInput.responseBuilder.speak(speakOutput).reprompt(speakOutput).getResponse();
    },
};
module.exports.skill = Alexa.SkillBuilders.custom()
    .addRequestHandlers(LaunchRequestHandler, ResumeHandler, PauseHandler, AudioPlayerHandler, FallbackHandler, FinishHandler, SessionEndedRequestHandler)
    .addErrorHandlers(ErrorHandler)
    .lambda();
//# sourceMappingURL=handler.js.map