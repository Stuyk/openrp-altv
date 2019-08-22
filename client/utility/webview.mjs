import * as alt from 'alt';
import * as native from 'natives';
import * as panelsPanelStatus from 'client/panels/panelstatus.mjs';

export const pages = {
  inventory: 'http://resources/orp/client/html/inventory/index.html',
}

export class WebView {

  events = [];

  constructor(page, showCursor = true) {
    if (!pages[page]) {
      return 'Error - Invalid page';
    }

    this.page = page;
    if (panelsPanelStatus.isAnyPanelOpen()) return;
    alt.emit('panel:SetStatus', this.page, true);
    
    this.view = new alt.WebView(pages[this.page]);
    this.view.focus();
    alt.showCursor(showCursor);

    this.view.on('close', this.close.bind(this));
    alt.on('update', this.disableControls);
    alt.toggleGameControls(false);
  }

  on(name, func) {
    this.events.push({
      name,
      func,
    });

    this.view.on(name, func);
  }

  emit(name) {
    this.view.emit(name);
  }

  close() {
    this.view.off('close', this.close);

    if (this.events.length) {
      this.events.forEach(e => {
        this.view.off(e.name, e.func);
      });
    }

    this.view.unfocus();
    this.view.destroy();
    this.view = undefined;
    alt.showCursor(false);
    alt.off('update', this.disableControls);
    alt.toggleGameControls(true);
    alt.emit('panel:SetStatus', this.page, false);
  }

  disableControls() {
    native.disableControlAction(0, 24, true);
    native.disableControlAction(0, 25, true);
  }
}
