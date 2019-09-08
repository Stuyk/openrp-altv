$(() => {
    alt.emit('fetchItems');
});

function appendItem(itemHash, itemName, itemCount) {
    $('#itemslist').append(`
	<li class="list-group-item">
	  <div class="row">
		<div class="col-md-6 align-middle">
		  <p class="text-small">
			<strong>${itemName}</strong>&nbsp;<small>x${itemCount}</small>
		  </p>
		</div>
		<div class="col-md-6">
			<div class="btn-group w-100" role="group">
				<button type="button" onclick="destroy('${itemHash}');" class="btn btn-secondary btn-sm">Destroy</button>
			  <button type="button" onclick="drop('${itemHash}');" class="btn btn-danger btn-sm">Drop</button>
			  <button type="button" onclick="use('${itemHash}');" class="btn btn-block btn-info btn-sm">Use</button>
			</div>
		</div>
	  </div>
	</li>`);
}

function parseitem(item) {
    appendItem(item.hash, item.label, item.quantity);
    enableAllButtons();
}

function clearitems() {
    $('#itemslist').empty();
}

$('#info').on('click', () => {
    $('#infomodal').show();
});

$('#closemodal').on('click', () => {
    $('#infomodal').hide();
});

$('#close').on('click', () => {
    alt.emit('close');
});

function drop(itemHash) {
    disableAllButtons();
    alt.emit('drop', itemHash);
}

function use(itemHash) {
    console.log(itemHash);
    disableAllButtons();
    alt.emit('use', itemHash);
}

function destroy(itemHash) {
    disableAllButtons();
    alt.emit('destroy', itemHash);
}

function disableAllButtons() {
    $(':button').addClass('disabled');
    $(':button').attr('disabled', true);
}

function enableAllButtons() {
    $(':button').removeClass('disabled');
    $(':button').attr('disabled', false);
}

if ('alt' in window) {
    alt.on('parseitem', parseitem);
    alt.on('enablebuttons', enableAllButtons);
    alt.on('clearitems', clearitems);
}
