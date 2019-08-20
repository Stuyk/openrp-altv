function playAudio(name) {
    var audio = new Audio(`./sounds/${name}.ogg`);
    audio.loop = false;
    audio.volume = 0.35;
    audio.autoplay = true;
    audio.play();
}

if ('alt' in window) {
    alt.on('playAudio', playAudio);
}
