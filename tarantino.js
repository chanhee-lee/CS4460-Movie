import {histogram} from  './histogram.js';
import {radii} from './radii.js';
var movieMap = new Map(); 
var rd = { "title": "Reservoir Dogs", "duration": "100", "year": "1992", "profanity": "431" };
var pf = { "title": "Pulp Fiction", "duration": "178", "year": "1994", "profanity": "475" };
var jb = { "title": "Jackie Brown", "duration": "160", "year": "1997", "profanity": "371" };
var kb1 = { "title": "Kill Bill: Vol. 1", "duration": "112", "year": "2003", "profanity": "119" };
var kb2 = {	"title": "Kill Bill: Vol. 2", "duration": "138", "year": "2004", "profanity": "79" };
var ib = { "title": "Inglorious Basterds", "duration": "153", "year": "2009", "profanity": "105" };
var du = { "title": "Django Unchained", "duration": "165", "year": "2012", "profanity": "308" };
movieMap.set("Reservoir Dogs", rd)
movieMap.set("Pulp Fiction", pf)
movieMap.set("Jackie Brown", jb)
movieMap.set("Kill Bill: Vol. 1", kb1)
movieMap.set("Kill Bill: Vol. 2", kb2)
movieMap.set("Inglorious Basterds", ib)
movieMap.set("Django Unchained", du)
// radii(movieMap);
histogram();