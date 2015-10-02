"use strict";

window.AudioContext = window.AudioContext||window.webkitAudioContext;

//Static Object
var Audio = {
	assets: {},
	middlewares: [],
	ctx: new AudioContext()
};

Audio.loadConfig = function() {
	Audio.setup();

    var xhr  = new XMLHttpRequest();

    xhr.onload = function() {
        try {
			Audio.assets = JSON.parse(xhr.responseText); //set assets

			Audio.loadAssets(); //Load all the assets
        }
        catch(err) {
            console.error(err);
        }
    };

    xhr.open('GET', '/audio.json');
    xhr.send(null);
};

Audio.setup = function() {
	Audio.panner 	= Audio.ctx.createPanner();
	Audio.gain		= Audio.ctx.createGain();

	Audio.gain.gain.value = 0.75;
};

Audio.loadAssets = function(index) {
	if(!index) index = 0;

	var keys  	  = Object.keys(Audio.assets);
	var actualKey = keys[index];

	if(!actualKey) { //End here
		//Audio.stop("loading"); //If it's a good connection
		//Audio.play("intro");
		return;
	}

	Audio.load(Audio.assets[actualKey])
		 .then(function(buffer) {
			 Audio.assets[actualKey] = buffer;

			 //Play the loading song when it's loaded
			 if(actualKey == "loading") {
				 //Audio.play("loading");
			 }

			 //Load next asset
			 Audio.loadAssets(index + 1);
		 });
};

Audio.load = function(sound) {
	return new Promise(function(resolve, reject) {
		var request = new XMLHttpRequest();

		request.open('GET', sound, true);
		request.responseType = 'arraybuffer';

		// Decode asynchronously
		request.onload = function() {
			Audio.ctx.decodeAudioData(request.response, function(buffer) {
				resolve(buffer);
			}, reject);
		};

		request.send(null);
	});
};

//Choses where to play the sound (in the space)
Audio.position = function(spaceX, spaceY) {

	//Left/right position
	if(spaceX && !spaceY && typeof spaceX == "string") {
		var position = spaceX;
		var xDeg;

		switch(position) {
			case "left":
				xDeg = -45;
				break;

			case "right":
				xDeg = 45;
				break;
		}

		var zDeg = xDeg + 90;

		if (zDeg > 90) {
			zDeg = 180 - zDeg;
		}

		var x = Math.sin(xDeg * (Math.PI / 180));
		var z = Math.sin(zDeg * (Math.PI / 180));

		Audio.panner.setPosition(x, 0, z);
	}
	//x, y position
	else {

	}

	Audio.middlewares.push({ position: [x, 0, z] });

	return Audio;
};

Audio.speed = function(speed) {
	Audio.middlewares.push({ speed: speed });

	return Audio;
};

Audio.time = function() {


	return Audio;
};

Audio.applyMiddlewares = function() {
	var middleware = Audio.middlewares.shift();

	while(middleware) {
		var name = Object.keys(middleware)[0];

		switch(name) {

			case "speed":
				Audio.source.playbackRate.value = middleware[name];
				break;

			default:
				break;
		}

		middleware = Audio.middlewares.shift();
	}
};

Audio.play = function(sound) {
	Audio.source = Audio.ctx.createBufferSource(); // creates a sound source

	Audio.source.buffer = Audio.assets[sound]; // tell the source which sound to play

	Audio.applyMiddlewares(); //Apply every middleware set before

	try {
		Audio.source.connect(Audio.gain);
		Audio.gain.connect(Audio.panner);
		Audio.panner.connect(Audio.ctx.destination); // connect the source to the context's destination (the speakers)
	}
	catch(err) {
		console.error(err);
	}

	Audio.source.start(0); //Choses where to play the sound (in the time)
};

Audio.stop = function() {
	Audio.source.stop();
};