$(() => {
    $('#passwordtwo').hide();
    $('#alert').hide();
    $('#alertSuccess').hide();
});

var selection = 0;
// 0 - Existing
// 1 - Register

$('button').on('click', e => {
    $('#alert').hide();
    $('#alertSuccess').hide();
    changeButtonFocus(e.target.id);

    if (e.target.id === 'existing') {
        selection = 0;
        $('#pagetitle').addClass('animated flipOutX');
        $('#register').removeClass('btn-primary');
        $('#register').addClass('btn-secondary');
        setTimeout(() => {
            $('#passwordtwo').slideUp(200);
            $('#pagetitle').removeClass('animated flipOutX');
            $('#pagetitle').addClass('animated flipInX');
            $('#pagetitle').html('Existing');
        }, 300);
        return;
    }

    if (e.target.id === 'register') {
        selection = 1;
        $('#pagetitle').addClass('animated flipOutX');
        $('#existing').removeClass('btn-primary');
        $('#existing').addClass('btn-secondary');

        setTimeout(() => {
            $('#passwordtwo').slideDown(200);
            $('#pagetitle').removeClass('animated flipOutX');
            $('#pagetitle').addClass('animated flipInX');
            $('#pagetitle').html('Register');
        }, 300);
        return;
    }

    if (e.target.id === 'submit') {
        console.log('submitting');
        $('#submit').prop('disabled', true);

        var username = $('#username').val();
        var password = $('#password').val();
        var password2 = $('#passwordtwo').val();

        if (username.length <= 5) {
            showAlertMessage(
                'Username must be greater than or equal to 6 characters.'
            );
            return;
        }

        if (password.length <= 5) {
            showAlertMessage(
                'Password must be greater than or equal to 6 characters.'
            );
            return;
        }

        if (selection === 0) {
            // Existing Account
            // Send emit
            alt.emit('existingAccount', username, password);
        } else {
            // Register Account
            if (password !== password2) {
                showAlertMessage('Passwords do not match.');
                return;
            }

            alt.emit('registerAccount', username, password);
        }
        return;
    }
});

function changeButtonFocus(id) {
    $(`#${id}`).addClass('btn-primary');
    $(`#${id}`).removeClass('btn-secondary');
}

function showAlertMessage(message) {
    $('#submit').prop('disabled', false);
    $('#alert').html(`Error: ${message}`);
    $('#alert').show();
}

function showAlertSuccessMessage(message) {
    $('#submit').prop('disabled', false);
    $('#alertSuccess').html(`Success! ${message}`);
    $('#alertSuccess').show();
}

if ('alt' in window) {
    alt.on('error', errorName => {
        showAlertMessage(errorName);
    });

    alt.on('success', successMessage => {
        showAlertSuccessMessage(successMessage);
    });
}
