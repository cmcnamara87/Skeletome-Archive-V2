(function($) {

  var patientNodeId = -1;
  var gender = [];
  
  Drupal.behaviors.patientContactInfo = {
    attach: function (context, settings) {
      skeletomeBase = Drupal.settings.basePath || [];
      patientNodeId = Drupal.settings.patientNodeId || -1;

      gender[0] = 'Female';
      gender[1] = 'Male';
      
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
	  value = '<i>(Please click to add a lasat name)</i>';
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
	$.post(link, { date: value});
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
	console.log(value);
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

      $("#patient_address").editable(function(value, settings) { 
	link = skeletomeBase + "node/" + patientNodeId + "/contact-info/set";
	$.post(link, { address: value});
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
	type		: 'textarea',
	select		: true,
	cssclass	: 'patient_address_textarea'
      });

    }
  };
  
})(jQuery);
