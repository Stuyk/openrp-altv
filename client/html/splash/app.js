let fade = 1.0;

$('html').css('background-color', 'rgba(0, 0, 0, 1.0)');
$('body').css('background-color', 'rgba(0, 0, 0, 1.0)');

setTimeout(() => {
    let interval = setInterval(() => {
        fade -= 0.01;
        if (fade <= 0) {
            fade = 0;
            $('body').attr(
                'style',
                `background-color: rgba(0, 0, 0, ${fade}) !important; opacity: ${fade} !important`
            );
            $('html').attr(
                'style',
                `background-color: rgba(0, 0, 0, ${fade}) !important; opacity: ${fade} !important`
            );
            clearInterval(interval);
            alt.emit('done');
        } else {
            $('body').attr(
                'style',
                `background-color: rgba(0, 0, 0, ${fade}) !important; opacity: ${fade} !important`
            );
            $('html').attr(
                'style',
                `background-color: rgba(0, 0, 0, ${fade}) !important; opacity: ${fade} !important`
            );
        }
    }, 15);
}, 3000);
