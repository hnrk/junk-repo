/* -*- mode: js2; js2-basic-offset: 4; indent-tabs-mode: nil -*- */

const St = imports.gi.St;
const Main = imports.ui.main;
const Lang = imports.lang;
const PanelMenu = imports.ui.panelMenu;
const Panel = imports.ui.panel;
const Gettext = imports.gettext;
 
const _ = Gettext.gettext;

function CloseButton() {
    this._init();
}
 
CloseButton.prototype = {
    __proto__: Panel.AppMenuButton.prototype,
 
    _init: function() {
        Panel.AppMenuButton.prototype._init.call(this, null);
        this.actor = new St.Bin({ style_class: 'panel-button',
                                  reactive: true,
                                  can_focus: true,
                                  x_fill: true,
                                  y_fill: false,
                                  track_hover: true });
        this._icon =  new St.Icon({ icon_name: 'window-close-symbolic',
                                        icon_type: St.IconType.SYMBOLIC,
                                        style_class: 'system-status-icon' });
        this.actor.set_child(this._icon);
        Main.panel._leftBox.add(this.actor, { y_fill: true });
        this.actor.hide();
    	this.focused_window = null;
		
		//Will be used for displaying the title of the window. (?)
        // this.actor.connect('enter-event', Lang.bind(this, this._onMouseEnter));
        // this.actor.connect('leave-event', Lang.bind(this, this._onMouseLeave)); 
        
        //This sort of works. Need to figure out better events to connect to.
        this.actor.connect('button-press-event', Lang.bind(this, this._closeWindow));
        global.stage.connect("captured-event", Lang.bind(this, this._onCapturedEvent));
        Main.overview.connect('hiding', Lang.bind(this, function () {
            this._toggleCloseButton();
        }));
        Main.overview.connect('showing', Lang.bind(this, function () {
            this._toggleCloseButton();
        }));
        
        this._toggleCloseButton();
    },
 
    _onDestroy: function() {},
    
    _toggleCloseButton: function() {
		/* 
		Toggle the close button if:
    		window has focus
    		window is maximaized (horizontally and vertically)
    		
    	This is still a bit buggy.
		*/
    
    	let windows = global.get_window_actors();
    	if (windows) {
			for (i = 0; i < windows.length; i++) {
		    	let win = windows[i].get_meta_window();
		    	if (win.has_focus() && 
		    		win.maximized_vertically &&
		    		win.maximized_horizontally) {
						this.focused_window = windows[i];
						this.actor.show();
			    		return;
			    }
			}
    	}
    	this.focused_window = null;
        this.actor.hide();
    },
    
    _onCapturedEvent: function() {
    	this._toggleCloseButton();
    },
    
    /*
    _onMouseEnter: function() {	
    	global.log("MOUSING IN");
    },
    
    _onMouseLeave: function() {	
    	global.log("MOUSING OUT");
    },
    */

	_closeWindow: function() {
		this._toggleCloseButton();
		if (this.focused_window) {
			this.focused_window.get_meta_window().delete(global.get_current_time());
		}
	}
};
 
function main(extensionMeta) {
 
    let closeButton = new CloseButton();
}
