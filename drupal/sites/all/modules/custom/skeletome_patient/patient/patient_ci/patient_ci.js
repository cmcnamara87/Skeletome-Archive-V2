(function($) {

  var patientNodeId = -1;
  var gender = [];
  
  Drupal.behaviors.patientContactInfo = {
    attach: function (context, settings) {
      skeletomeBase = Drupal.settings.basePath || [];
      patientNodeId = Drupal.settings.patientNodeId || -1;

      gender[0] = 'Female';
      gender[1] = 'Male';
            
      $("#error-dialog").dialog({
	autoOpen: false,
	resizable: false,
	height:		'auto',
	modal:		true,
	closeOnEscape:	true,
	buttons: {
	  Ok: function() {
	    $( this ).dialog( "close" );
	  }
	},
	open: function() {
	  $(this).parents('.ui-dialog-buttonpane button:eq(0)').focus();
	},
	close: function() {
	    $("#patient_dob").html('<i>(Please click to add a date of birth)</i>');
	},
      });
      
      $("#patient_firstname").editable(function(value, settings) {
	link = skeletomeBase + "node/" + patientNodeId + "/contact-info/set";
	$.post(link, { firstname: value});
	if (value === '') {
	  value = '<i>(Please click to add a first name)</i>';
	}
	return(value);
      }, {
	data: function(value, settings) {
	  var retval = value;
	  if (value.substring(0, 3) === '<i>') {
	    retval = '';
	  }
	  return retval;
	},
	indicator	: '<img src="throbber.gif">',
	tooltip		: 'Click to edit...',
	width		: 'none',
	cancel		: 'Cancel',
	submit		: 'OK',
	style		: 'display: inline',
      });

      $("#patient_lastname").editable(function(value, settings) {
	link = skeletomeBase + "node/" + patientNodeId + "/contact-info/set";
	$.post(link, { lastname: value});
	if (value === '') {
	  value = '<i>(Please click to add a last name)</i>';
	}
	return(value);
      }, {
	data: function(value, settings) {
	  var retval = value;
	  if (value.substring(0, 3) === '<i>') {
	    retval = '';
	  }
	  return retval;
	},
	indicator	: '<img src="throbber.gif">',
	tooltip		: 'Click to edit...',
	width		: 'none',
	cancel		: 'Cancel',
	submit		: 'OK',
	style		: 'display: inline',
      });
      

      $("#patient_alias").editable(function(value, settings) {
	link = skeletomeBase + "node/" + patientNodeId + "/contact-info/set";
	$.post(link, { alias: value});
	if (value === '') {
	  value = '<i>(Please click to add an alias)</i>';
	}
	return(value);
      }, {
	data: function(value, settings) {
	  var retval = value;
	  if (value.substring(0, 3) === '<i>') {
	    retval = '';
	  }
	  return retval;
	},
	indicator	: '<img src="throbber.gif">',
	tooltip		: 'Click to edit...',
	width		: 'none',
	cancel		: 'Cancel',
	submit		: 'OK',
	style		: 'display: inline',
      });

      $("#patient_dob").editable(function(value, settings) {
	link = skeletomeBase + "node/" + patientNodeId + "/contact-info/set";
	$.post(link, { date: value}, function(data){
	  if (data == 'ERROR') {
	    $("#error-dialog").dialog( "open" );
	  }
	});
	if (value === '') {
	  value = '<i>(Please click to add a date of birth)</i>';
	}
	return(value);
      }, { 
	data: function(value, settings) {
	  var retval = value;
	  if (value.substring(0, 3) === '<i>') {
	    retval = '';
	  }
	  return retval;
	},
	indicator	: '<img src="throbber.gif">',
	tooltip		: 'Click to edit...',
	width		: 'none',
	cancel		: 'Cancel',
	submit		: 'OK',
	style		: 'display: inline',
      });

      $("#patient_gender").editable(function(value, settings) {
	link = skeletomeBase + "node/" + patientNodeId + "/contact-info/set";
	$.post(link, { gender: value});
	if (value === '0') {
	  value = 'Female';
	} else {
	  value = 'Male';
	}
	return(value);
      }, {
	data: function(value, settings) {
	  return gender;
	},
	type		: 'select',
	style		: 'inherit',
	indicator	: '<img src="throbber.gif">',
	tooltip		: 'Click to edit...',
	width		: 'none',
	cancel		: 'Cancel',
	submit		: 'OK',
	style		: 'display: inline',
      });

      $("#patient_ethnicity").editable(function(value, settings) {
	link = skeletomeBase + "node/" + patientNodeId + "/contact-info/set";
	$.post(link, { ethnicity: value});
	if (value === '') {
	  value = '<i>(Please click to add an ethnicity)</i>';
	}
	return(value);
      }, {
	data: function(value, settings) {
	  var retval = value;
	  if (value.substring(0, 3) === '<i>') {
	    retval = '';
	  }
	  return retval;
	},
	indicator	: '<img src="throbber.gif">',
	tooltip		: 'Click to edit...',
	width		: 'none',
	cancel		: 'Cancel',
	submit		: 'OK',
	style		: 'display: inline',
      });

      $("#patient_addressstreet").editable(function(value, settings) {
	link = skeletomeBase + "node/" + patientNodeId + "/contact-info/set";
	$.post(link, { street: value});
	if (value === '') {
	  value = '<i>(Please click to add a street)</i>';
	}
	return(value);
      }, {
	data: function(value, settings) {
	  var retval = value;
	  if (value.substring(0, 3) === '<i>') {
	    retval = '';
	  }
	  return retval;
	},
	indicator	: '<img src="throbber.gif">',
	tooltip		: 'Click to edit...',
	width		: 'none',
	cancel		: 'Cancel',
	submit		: 'OK',
	style		: 'display: inline',
      });
      $("#patient_addresscity").editable(function(value, settings) {
	link = skeletomeBase + "node/" + patientNodeId + "/contact-info/set";
	$.post(link, { city: value});
	if (value === '') {
	  value = '<i>(Please click to add a city)</i>';
	}
	return(value);
      }, {
	data: function(value, settings) {
	  var retval = value;
	  if (value.substring(0, 3) === '<i>') {
	    retval = '';
	  }
	  return retval;
	},
	indicator	: '<img src="throbber.gif">',
	tooltip		: 'Click to edit...',
	width		: 'none',
	cancel		: 'Cancel',
	submit		: 'OK',
	style		: 'display: inline',
      });
      $("#patient_addressstate").editable(function(value, settings) {
	link = skeletomeBase + "node/" + patientNodeId + "/contact-info/set";
	$.post(link, { state: value});
	if (value === '') {
	  value = '<i>(Please click to add a state)</i>';
	}
	return(value);
      }, {
	data: function(value, settings) {
	  var retval = value;
	  if (value.substring(0, 3) === '<i>') {
	    retval = '';
	  }
	  return retval;
	},
	indicator	: '<img src="throbber.gif">',
	tooltip		: 'Click to edit...',
	width		: 'none',
	cancel		: 'Cancel',
	submit		: 'OK',
	style		: 'display: inline',
      });
      $("#patient_addresspostcode").editable(function(value, settings) {
	link = skeletomeBase + "node/" + patientNodeId + "/contact-info/set";
	$.post(link, { postcode: value});
	if (value === '') {
	  value = '<i>(Please click to add a postcode)</i>';
	}
	return(value);
      }, {
	data: function(value, settings) {
	  var retval = value;
	  if (value.substring(0, 3) === '<i>') {
	    retval = '';
	  }
	  return retval;
	},
	indicator	: '<img src="throbber.gif">',
	tooltip		: 'Click to edit...',
	width		: 'none',
	cancel		: 'Cancel',
	submit		: 'OK',
	style		: 'display: inline',
      });
      $("#patient_addresscountry").editable(function(value, settings) {
	link = skeletomeBase + "node/" + patientNodeId + "/contact-info/set";
	$.post(link, { country: value});
	if (value === '') {
	  value = '<i>(Please click to add a country)</i>';
	}
	return(value);
      }, {
	data: function(value, settings) {
	  var retval = value;
	  if (value.substring(0, 3) === '<i>') {
	    retval = '';
	  }
	  return retval;
	},
	indicator	: '<img src="throbber.gif">',
	tooltip		: 'Click to edit...',
	width		: 'none',
	cancel		: 'Cancel',
	submit		: 'OK',
	style		: 'display: inline',
      });
    }
  };
  
})(jQuery);
