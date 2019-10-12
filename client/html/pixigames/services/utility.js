function rgbToHex(r, g, b) {
    return '0x' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function setDescription(text) {
    document.querySelector(
        '#description'
    ).innerHTML = `${text} <br><br> Press 'ESC' to leave at any time. You will fail the job if you do.`;
}
