function playAudio(name, panValue = 0, volume = 0.35) {
    console.log(`Playing: ${name} ${panValue} ${volume}`);

    var audio = new Audio(`./sounds/${name}.ogg`);
    const ambientContext = new AudioContext();
    const source = ambientContext.createMediaElementSource(audio);
    const ambientPan = ambientContext.createStereoPanner();
    source.connect(ambientPan);
    ambientPan.connect(ambientContext.destination);
    ambientPan.pan.value = panValue;
    audio.loop = false;
    audio.volume = volume;
    audio.autoplay = true;
    audio.play();
}

if ('alt' in window) {
    alt.on('playAudio', playAudio);
}
