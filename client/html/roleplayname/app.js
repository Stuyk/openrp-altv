// General Setup for the Page
$(() => {
    $('#alert').hide();
});

const regex = new RegExp('^(([A-Z][a-z]+)(([ _][A-Z][a-z]+)|([ _][A-z]+[ _][A-Z][a-z]+)))$');

$('button').on('click', e => {
    $('#alert').hide();
    $('#submit').prop('disabled', true);

    const roleplayName = $('#roleplayname').val();
    const result = regex.test(roleplayName);

    if (!result) {
        $('#submit').prop('disabled', false);
        $('#alert').show();
        $('#alert').html('That name is not roleplay format.');
        return;
    }

    alt.emit('setname', roleplayName);
});

if ('alt' in window) {
    alt.on('nameTaken', () => {
        $('#alert').show();
        $('#alert').html('That name is already in use.');
        $('#submit').prop('disabled', false);
    });
}
