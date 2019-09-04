$(() => {
    $('#alert').hide();
    $('#alertSuccess').hide();
    setBankBalance(0);
    setCashBalance(0);
    alt.emit('ready', true);
});

var bankBalance = 0;
var cashBalance = 0;

$(`#withdraw`).on('click', () => {
    $(`#alert`).hide();
    let withdrawAmount = $('#amount').val() * 1;

    if (withdrawAmount <= 0) {
        $(`#alert`).show();
        $(`#alert`).html('Value must be positive.');
        return;
    }

    if (withdrawAmount > bankBalance) {
        $(`#alert`).show();
        $(`#alert`).html('You do not have that much bank balance.');
        return;
    }

    alt.emit('atm:Withdraw', withdrawAmount);
});

$(`#deposit`).on('click', () => {
    $(`#alert`).hide();
    let depositAmount = $('#amount').val() * 1;

    if (depositAmount <= 0) {
        $(`#alert`).show();
        $(`#alert`).html('Value must be positive.');
        return;
    }

    if (depositAmount > cashBalance) {
        $(`#alert`).show();
        $(`#alert`).html('You do not have that much cash.');
        return;
    }

    alt.emit('atm:Deposit', depositAmount);
});

$(`#close`).on('click', () => {
    alt.emit('close');
});

function showSuccess(message) {
    console.log(message);
    $(`#alertSuccess`).show();
    $(`#alertSuccess`).html(`${message}`);
}

function setBankBalance(money) {
    console.log(`bank from Webview: ${money}`);
    $('#bankbalance').html(`$${money}`);
    bankBalance = money;
}

function setCashBalance(money) {
    console.log(`Cash from Webview: ${money}`);
    $('#cashbalance').html(`$${money}`);
    cashBalance = money;
}

if ('alt' in window) {
    alt.on('setBank', setBankBalance);
    alt.on('setCash', setCashBalance);
    alt.on('showSuccess', showSuccess);
}
