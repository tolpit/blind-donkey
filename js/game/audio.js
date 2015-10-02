"use strict";

window.AudioContext = window.AudioContext||window.webkitAudioContext;

var assets = {};
var ctx = new AudioContext();
var stereoPanner = ctx.createStereoPanner();

function Audio() { }

Audio.loadConfig = function() {
    var self = this;
    var xhr  = new XMLHttpRequest();

    xhr.onload = function() {
        try {
            self.assets = JSON.parse(xhr.responseText);
        }
        catch(err) {
            console.error(err);
        }
    };

    xhr.open('GET', '/audio.json');
    xhr.send(null);
};

Audio.load = function(sound, callback) {
    if(!this.assets[sound]) return;

    var request = new XMLHttpRequest();
    var self = this;

    request.open('GET', this.assets[sound], true);
    request.responseType = 'arraybuffer';

    // Decode asynchronously
    request.onload = function() {
        ctx.decodeAudioData(request.response, function(buffer) {
            callback(buffer);
        });
    };

    request.send(null);
};

Audio.play = function(sound, position) {
    var self = this;

    this.load(sound, function(buffer) {
        var source = ctx.createBufferSource(); // creates a sound source

        source.buffer = buffer;                    // tell the source which sound to play

        //Choses where to play the sound
        switch(position) {

            case "left":
                stereoPanner.pan.value = -1;
                break;

            case "right":
                stereoPanner.pan.value = 1;
                break;

        }

        source.connect(stereoPanner);
        stereoPanner.connect(ctx.destination); // connect the source to the context's destination (the speakers)

        source.start(0);
    });
};