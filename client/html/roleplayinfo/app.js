// General Setup for the Page
$(() => {
    $('#namealert').hide();
    $('#dobalert').hide();
});

const regex = new RegExp('^(([A-Z][a-z]+)(([ _][A-Z][a-z]+)|([ _][A-z]+[ _][A-Z][a-z]+)))$');

$('button').on('click', e => {
    $('#namealert').hide();
    $('#dobalert').hide();
    $('#submit').prop('disabled', true);

    const roleplayName = $('#roleplayname').val();
    const dob = $('#rpdob').val();
    const result = regex.test(roleplayName);

    if (!result) {
        $('#submit').prop('disabled', false);
        $('#namealert').show();
        return;
    }

    if (!moment(dob).isValid()) {
        $('#submit').prop('disabled', false);
        $('#dobalert').show();
        return;
    }

    alt.emit('setinfo', {
        name: roleplayName,
        dob: moment(dob).format('MM/DD/YYYY')
    })
});

$('#rpdob').keypress(function (event) {

    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
        $('#submit').click()
    }

});
$('#rpname').keypress(function (event) {

    var keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode == '13') {
        $('#submit').click()
    }

});