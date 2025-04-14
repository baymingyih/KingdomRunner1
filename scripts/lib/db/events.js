"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
exports.updateEventParticipants = exports.updateEvent = exports.getUpcomingEvents = exports.getEvent = exports.createEvent = void 0;
var firebase_1 = require("../firebase");
var firestore_1 = require("firebase/firestore");
function createEvent(eventData) {
    return __awaiter(this, void 0, void 0, function () {
        var eventsRef, docRef, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    eventsRef = (0, firestore_1.collection)(firebase_1.db, 'events');
                    return [4 /*yield*/, (0, firestore_1.addDoc)(eventsRef, __assign(__assign({}, eventData), { createdAt: new Date(), participants: 0 }))];
                case 1:
                    docRef = _a.sent();
                    return [2 /*return*/, __assign({ id: docRef.id }, eventData)];
                case 2:
                    error_1 = _a.sent();
                    console.error('Error creating event:', error_1);
                    throw error_1;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.createEvent = createEvent;
function getEvent(eventId) {
    return __awaiter(this, void 0, void 0, function () {
        var eventRef, eventDoc, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    eventRef = (0, firestore_1.doc)(firebase_1.db, 'events', eventId);
                    return [4 /*yield*/, (0, firestore_1.getDoc)(eventRef)];
                case 1:
                    eventDoc = _a.sent();
                    if (!eventDoc.exists()) {
                        throw new Error('Event not found');
                    }
                    return [2 /*return*/, __assign({ id: eventDoc.id }, eventDoc.data())];
                case 2:
                    error_2 = _a.sent();
                    console.error('Error getting event:', error_2);
                    throw error_2;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getEvent = getEvent;
function getUpcomingEvents(maxResults) {
    if (maxResults === void 0) { maxResults = 3; }
    return __awaiter(this, void 0, void 0, function () {
        var eventsRef, q, querySnapshot, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    eventsRef = (0, firestore_1.collection)(firebase_1.db, 'events');
                    q = (0, firestore_1.query)(eventsRef, (0, firestore_1.where)('endDate', '>=', new Date().toISOString()), (0, firestore_1.orderBy)('endDate'), (0, firestore_1.limit)(maxResults));
                    return [4 /*yield*/, (0, firestore_1.getDocs)(q)];
                case 1:
                    querySnapshot = _a.sent();
                    return [2 /*return*/, querySnapshot.docs.map(function (doc) { return (__assign({ id: doc.id }, doc.data())); })];
                case 2:
                    error_3 = _a.sent();
                    console.error('Error getting upcoming events:', error_3);
                    throw error_3;
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.getUpcomingEvents = getUpcomingEvents;
function updateEvent(eventId, eventData) {
    return __awaiter(this, void 0, void 0, function () {
        var eventRef, updatedDoc, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    eventRef = (0, firestore_1.doc)(firebase_1.db, 'events', eventId);
                    return [4 /*yield*/, (0, firestore_1.updateDoc)(eventRef, eventData)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, firestore_1.getDoc)(eventRef)];
                case 2:
                    updatedDoc = _a.sent();
                    return [2 /*return*/, __assign({ id: updatedDoc.id }, updatedDoc.data())];
                case 3:
                    error_4 = _a.sent();
                    console.error('Error updating event:', error_4);
                    throw error_4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.updateEvent = updateEvent;
function updateEventParticipants(eventId, increment) {
    return __awaiter(this, void 0, void 0, function () {
        var eventRef, eventDoc, currentParticipants, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 3, , 4]);
                    eventRef = (0, firestore_1.doc)(firebase_1.db, 'events', eventId);
                    return [4 /*yield*/, (0, firestore_1.getDoc)(eventRef)];
                case 1:
                    eventDoc = _a.sent();
                    if (!eventDoc.exists()) {
                        throw new Error('Event not found');
                    }
                    currentParticipants = eventDoc.data().participants || 0;
                    return [4 /*yield*/, (0, firestore_1.updateDoc)(eventRef, {
                            participants: currentParticipants + increment
                        })];
                case 2:
                    _a.sent();
                    return [2 /*return*/, __assign(__assign({ id: eventDoc.id }, eventDoc.data()), { participants: currentParticipants + increment })];
                case 3:
                    error_5 = _a.sent();
                    console.error('Error updating event participants:', error_5);
                    throw error_5;
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.updateEventParticipants = updateEventParticipants;
