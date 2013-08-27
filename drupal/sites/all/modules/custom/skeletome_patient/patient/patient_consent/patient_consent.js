(function($) {

  var consentNids;
  var currentConsentNid = -1;
  
  Drupal.behaviors.patientConsent = {
    attach: function (context, settings) {
      skeletomeBase = Drupal.settings.basePath || [];
      patientNid = Drupal.settings.patientNodeId || [];
      consentNids = Drupal.settings.consentNids || [];

      $("#dialog-confirm").dialog({
	autoOpen: false,
	resizable: false,
	height:		'auto',
	modal:		true,
	closeOnEscape:	true,
	buttons: {
	  "Delete": function() {
	    link = skeletomeBase + "node/" + patientNid + "/consent/delete/" + currentConsentNid;
	    $.post(link, { currentConsentNid: currentConsentNid}, function(data){
	      $("#dialog-confirm").dialog( "close" );
	      window.location.href = skeletomeBase + "node/" + patientNid + "/consent";
	    });
	  },
	  Cancel: function() {
	    $( this ).dialog( "close" );
	  }
	},
	open: function() {
	  $(this).parents('.ui-dialog-buttonpane button:eq(0)').focus();
	},
      });

      $("#add_consent_button").button().click(function() { 
	window.location.href = skeletomeBase + "node/add/consent-item/" + patientNid; 
      });
      
      for (i = 0; i < consentNids.length; i++) {
	$("#edit_" + consentNids[i]).click(function(i) {
	  elem_id = $(i.currentTarget)[0].id;
	  nid = elem_id.substring(elem_id.lastIndexOf("_") + 1);
	  window.location.href = skeletomeBase + "node/" + nid + "/edit";
	});
	$("#delete_" + consentNids[i]).click(function(i) {
	  elem_id = $(i.currentTarget)[0].id;
	  nid = elem_id.substring(elem_id.lastIndexOf("_") + 1);
	  currentConsentNid = nid;
	  $("#dialog-confirm").dialog( "open" );
	});
      }

    }
  };
})(jQuery);
