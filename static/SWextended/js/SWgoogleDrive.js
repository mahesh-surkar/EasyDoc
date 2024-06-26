/**!
 * Google Drive File Picker Example
 */



(function() {
	/**
	 * Initialise a Google Driver file picker
	 */
	var FilePicker = window.FilePicker = function(options) {
		// Config
		this.apiKey = options.apiKey;
		this.clientId = options.clientId;
		
		// Elements
		this.buttonEl = options.buttonEl;
		
		// Events
		this.onSelect = options.onSelect;
		this.buttonEl.addEventListener('click', this.open.bind(this));		
	
		// Disable the button until the API loads, as it won't work properly until then.
		this.buttonEl.disabled = true;

		// Load the drive API
		gapi.client.setApiKey(this.apiKey);
		gapi.client.load('drive', 'v2', this._driveApiLoaded.bind(this));
		google.load('picker', '1', { callback: this._pickerApiLoaded.bind(this) });
	}

	FilePicker.prototype = {
		/**
		 * Open the file picker.
		 */
		open: function() {		
			// Check if the user has already authenticated
			var token = gapi.auth.getToken();
			if (token) {
				this._showPicker();
			} else {
				// The user has not yet authenticated with Google
				// We need to do the authentication before displaying the Drive picker.
				this._doAuth(false, function() { this._showPicker(); }.bind(this));
			}
		},
		
		/**
		 * Show the file picker once authentication has been done.
		 * @private
		 */
		_showPicker: function() {
			var accessToken = gapi.auth.getToken().access_token;
			this.picker = new google.picker.PickerBuilder().
				addView(google.picker.ViewId.DOCUMENTS).
				setAppId(this.clientId).
				setOAuthToken(accessToken).
				setCallback(this._pickerCallback.bind(this)).
				build().
				setVisible(true);
		},
		
		/**
		 * Called when a file has been selected in the Google Drive file picker.
		 * @private
		 */
		_pickerCallback: function(data) {
			if (data[google.picker.Response.ACTION] == google.picker.Action.PICKED) {
				var file = data[google.picker.Response.DOCUMENTS][0],
					id = file[google.picker.Document.ID],
					request = gapi.client.drive.files.get({
						fileId: id
					});
					
				request.execute(this._fileGetCallback.bind(this));
			}
		},
		/**
		 * Called when file details have been retrieved from Google Drive.
		 * @private
		 */
		_fileGetCallback: function(file) {
			if (this.onSelect) {
				this.onSelect(file);
			}
		},
		
		/**
		 * Called when the Google Drive file picker API has finished loading.
		 * @private
		 */
		_pickerApiLoaded: function() {
			this.buttonEl.disabled = false;
		},
		
		/**
		 * Called when the Google Drive API has finished loading.
		 * @private
		 */
		_driveApiLoaded: function() {
			this._doAuth(true);
		},
		
		/**
		 * Authenticate with Google Drive via the Google JavaScript API.
		 * @private
		 */
		_doAuth: function(immediate, callback) {	
			gapi.auth.authorize({
				client_id: this.clientId + '.apps.googleusercontent.com',
				scope: 'https://www.googleapis.com/auth/drive.readonly',
				immediate: immediate
			}, callback);
		}
	};
}());

function attachSelectFileFromGoogleDrive(selectFromGoogleDriveBtn, callBackFunction)
{
	var picker = new FilePicker({
		apiKey: 'AIzaSyAYxY7SPUkI4XmN2EiocLOVnmpEfrwST88',//Infotropic api key
		clientId: '650656389951-6dg5k7qkddql0p0jl5miljq6mbsr2l4j',
		
		buttonEl: document.getElementById(selectFromGoogleDriveBtn),
		onSelect: function(file) {
			callBackFunction(file.title);
			//console.log(file);
			//alert('Selected ' + file.title);
		}
	});	
}

function saveFileToGoogleDrive()
{
	var picker = new FilePicker({
		//apiKey: 'AIzaSyAYxY7SPUkI4XmN2EiocLOVnmpEfrwST88',//Infotropic api key
		//clientId: '650656389951-6dg5k7qkddql0p0jl5miljq6mbsr2l4j',
		
		//apiKey: 'AIzaSyB8a8yohsAyEz1eZEFgt2YE-tMgACYWnVs',
		//clientId: 458068379722,
		
		buttonEl: document.getElementById('saveToGoogleDriveBtn'),
		onSelect: function(file) {
			console.log(file);
			alert('Selected ' + file.title);
		}
	});	

}

function initGoogleDriveFilePicker() {

}
