﻿function getCollection(dataclass, id) {	var		collection,		storageKey;					storageKey = 'collection' + id;	collectionIds = sessionStorage[storageKey];	if (collectionIds) {		collection = dataclass.query('ID in :1',collectionIds);    	delete sessionStorage[storageKey];    } else {    	collection = dataclass.createEntityCollection();    }	return collection;}guidedModel =// @startlock{	Proxy :	{		methods :		{// @endlock			runOnServer:function(ssjs)			{// @lock				"use strict";				var					Sandbox,					sandbox,					response,					limitedResult,					index,					entity,					result,					toString,					resultTxt,					resultObj;				function saveCode(ssjs) {										var xhr, headers, result, resultObj;					var proxy = {  					     host: 'proxy.private.4d.fr',					     port: 80					}					   					var headersObj = {};					   					xhr = new XMLHttpRequest(); // instanciate the xhr object					   					xhr.onreadystatechange = function() { // event handler					     var state = this.readyState;					     if (state !== 4) { // while the status event is not Done we continue					         return;					     }					     var headers = this.getAllResponseHeaders(); //get the headers of the response					     var result = this.responseText;  //get the contents of the response					     var headersArray = headers.split('\n'); // split and format the headers string in an array					     					     headersArray.forEach(function(header, index, headersArray) {					        var name, indexSeparator, value;					 					        if (header.indexOf('HTTP/1.1') === 0) { return; } //this is not a header but a status :filter it					  					        indexSeparator = header.indexOf(':'); 					        name = header.substr(0,indexSeparator);					        if (name === "") { return; }					        value = header.substr(indexSeparator + 1).trim(); // clean up the header attribute					        headersObj[name] = value; // fills an object with the headers					     });					     					     if (headersObj['Content-Type'] && headersObj['Content-Type'].indexOf('json') !== -1) { // JSON response, parse it as objects					         resultObj = JSON.parse(result);					     } else { // not JSON, return text					         resultTxt = result;					     }					};					xhr.open('POST', 'http://127.0.0.1:8084/rest/Code/saveCode'); // to connect to a Web site//					xhr.open('POST', 'http://194.98.194.84:8084/rest/Code/saveCode'); // to connect to a Web site										xhr.send('["' + escape(ssjs) + '"]'); // send the request					//statusLine = xhr.status + ' ' + xhr.statusText; // get the status//					console.log({//					     statusLine: statusLine,//					     headers: headersObj,//					     result: resultObj || resultTxt//					});				}				function isEntity(object) {					return toString.apply(object) === '[object Entity]';				}				function isEntityCollection(object) {					return toString.apply(object) === '[object EntityCollection]';									}				function isEntityOrEntityCollection(object) {					return toString.apply(object).substr(0, 14) === '[object Entity';									}				function isImage(object) {					return toString.apply(object) === '[object Image]';				}				function isArray(object) {					return toString.apply(object) === '[object Array]';				}				if (!ssjs) {				    return 'code empty';				    //throw new Error('code empty');					}				toString = Object.prototype.toString;				Sandbox = require('jsSandBox').Sandbox;				sandbox = new Sandbox(					application,					{						// HTML5 properties						'name': true,						'Blob': true,						'XMLHttpRequest': true,						'sessionStorage': true,						// Wakanda specific properties						'administrator': true,						'ds': true,						'pattern': true						//process: true,						//os: true,					}				);			    result = sandbox.run(ssjs);			    // support: Image, Stream (text, binary), File			    // don't support: Blob, Buffer			    /*			    {			    	HTTPStream: obj,			    	headers: {			    		'Content-Type':			    	}			    }			    */			    switch (toString.apply(result)) {			    case '[object Entity]':			        response = result;			        break;			    case '[object EntityCollection]':			        response = result;			        break;			    case '[object Image]':			        response = {			            HTTPStream: result,			            headers: {			                'Content-Type': 'text/plain; charset=x-user-defined',                            'X-Original-Content-Type': 'image/jpeg',			                'X-Image-Data': JSON.stringify(result)			            }			        };			        break;			    case '[object Array]':		        	/*		        	if (result.every(function (element) { return isEntity(element); })) {		        		// it is an array of entities		        		response.type = 'collection';		        		response.dataclass = result[0].getDataClass().getName();		        		sessionStorage.currentCollection = result.map(function (entity) {return entity.ID});		        	}		        	*/		        	if (result.length > 40) {		                limitedResult = [];		                for (index = 0; index < 40; index += 1) {		                    limitedResult.push(result[index]);		                }		                response = limitedResult;		            } else {		            	response = result;		            }		            response.originalLength = result.length		            break;		        default:		            response = result;			    }			    			    if (response !== null) saveCode(ssjs);			    			    return response;			}// @startlock		}	},	Country :	{		methods :		{// @endlock			getCollection:function(id)			{// @lock				return getCollection(this, id);			}// @startlock		}	},	Company :	{		methods :		{// @endlock			getCollection:function(id)			{// @lock				return getCollection(this, id);			}// @startlock		},		collectionMethods :		{// @endlock			revenuesStats:function(inParams)			{// @lock				var result =[];				if(this.length == 0) {				    return [];				}								if(typeof inParams === 'undefined') {					inParams = { kind: 'range', limit : 50000 };				}				var doByRange = false, doByCountry = false;				var theInterval;				if(inParams.kind === "byRange") {				    doByRange = true;				    theInterval = inParams.limit;				} else if (inParams.kind === "byCountry") {				    doByCountry = true;				}				// ----------------------------				if(doByRange) {				// ----------------------------				    if(typeof theInterval != "number" || theInterval < 50000) {				        theInterval = 50000;				    }				    				    var theMax = this.max("revenues");				    if((theMax % theInterval) > 0) {				        theMax = theMax - (theMax % theInterval) + theInterval;				    }				    var limitInf = 0;				    var limitSup = theInterval;				    var grandCount = this.length;				    do {				        var oneItem = {};				        				        oneItem.range = limitSup;				        oneItem.count = this.query("revenues >= :1 and revenues <= :2", limitInf, limitSup).length;				// NOTE: the % should be calculated on the client-side, since it's pure				// calculation, no data access. We're doing it here because it makes				// the code of the client-side a bit more simple/easy to read for				// the tutorial.				        oneItem.percentage = ((oneItem.count / grandCount) * 100).toFixed();				        result.push(oneItem);				        				        limitInf = limitSup + 1;				        limitSup += theInterval; 				    } while(limitSup <= theMax);				    				// ----------------------------				} else if (doByCountry) {				// ----------------------------				    var theCountries = this.country.name;// Projection. get the distinct values (unordered here)				    var max = theCountries.length;				    var grandTotal = this.sum("revenues");				    var grandCount = this.length;				    for(var i = 0; i < max; ++i) {				        // As we called this.country.name, we know, at this point, there is at least one company for this country				        //(because we're looping in the array returned by this.country.name)				        var oneItem = {};				        var subES = this.query("country.name = :1", theCountries[i]);				        oneItem.country = theCountries[i];				        oneItem.countryCode = ds.Country.find('name = :1', oneItem.country).code2Chars;				        oneItem.revenuesSum = subES.sum("revenues");				        oneItem.revenuesMin = subES.min("revenues");				        oneItem.revenuesMax = subES.max("revenues");				        oneItem.revenuesPerc = ((oneItem.revenuesSum / grandTotal) * 100).toFixed();				        oneItem.count = subES.length;				        oneItem.countPerc = ((oneItem.count / grandCount) * 100).toFixed();				        				        result.push(oneItem);				    }				}				return result;			}// @startlock		}	},	Employee :	{		methods :		{// @endlock			getCollection:function(id)			{// @lock				return getCollection(this, id);			}// @startlock		},		age :		{			onSort:function(ascending)			{// @endlock				if (ascending) {					return "birthDate desc";				} else {					return "birthDate";				}			},// @startlock			onQuery:function(compOperator, valueToCompare)			{// @endlock				if (valueToCompare == null)				{					if (compOperator == "=" || compOperator == "==")						result = "birthDate is null";					else						result = "birthDate is not null";				}				else				{					var today = new Date();										var lowerlimit = new Date(today.getFullYear() - valueToCompare - 1, today.getMonth(), today.getDate(), today.getHours(), today.getMinutes());					var upperlimit = new Date(today.getFullYear() - valueToCompare, today.getMonth(), today.getDate(), today.getHours(), today.getMinutes());										var result = null;					switch (compOperator)						{							case '=':							case '==':													case '!=':							case '!==':								result = "birthDate >= '" + lowerlimit.toISOString() + "'";								result += " and birthDate < '" + upperlimit.toISOString() + "'";								if (compOperator == '!=' || compOperator == '!==')									result = "not ("+result+")";								break;														case '>':								result = "birthDate < '" + lowerlimit.toISOString() + "'";								break;															case '>=':								result = "birthDate <= '" + upperlimit.toISOString() + "'";								break;															case '<':								result = "birthDate > '" + upperlimit.toISOString() + "'";								break;															case '<=':								result = "birthDate >= '" + lowerlimit.toISOString() + "'";								break;						}				}				return result;			},// @startlock			onGet:function()			{// @endlock				if (this.birthDate == null) {					return 0;				} else {					var today = new Date();					var interval = today.getTime() - this.birthDate.getTime();					var nbYears = Math.floor(interval / (1000 * 60 * 60 * 24 * 365.25));										return nbYears;				}			}// @startlock		},		fullName :		{			onGet:function()			{// @endlock				return this.firstName + " " + this.lastName;			}// @startlock		}	}};// @endlock