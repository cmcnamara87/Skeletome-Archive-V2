(function($) {

  var letterNids;
  var currentLetterNid = -1;

  Drupal.behaviors.patientLetters = {
    attach: function (context, settings) {
      skeletomeBase = Drupal.settings.basePath || [];
      patientNid = Drupal.settings.patientNodeId || [];
      letterNids = Drupal.settings.letterNids || [];

      $("#dialog-confirm").dialog({
	autoOpen: false,
	resizable: false,
	height:		'auto',
	modal:		true,
	closeOnEscape:	true,
	buttons: {
	  "Delete": function() {
	    link = skeletomeBase + "node/" + patientNid + "/letters/delete/" + currentLetterNid;
	    $.post(link, { currentLetterNid: currentLetterNid}, function(data){
	      $("#dialog-confirm").dialog( "close" );
	      window.location.href = skeletomeBase + "node/" + patientNid + "/letters";
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

      $("#add_letter_button").button().click(function() { 
	window.location.href = skeletomeBase + "node/add/reference-letter/" + patientNid; 
      });

      for (i = 0; i < letterNids.length; i++) {
	$("#edit_" + letterNids[i]).click(function(i) {
	  elem_id = $(i.currentTarget)[0].id;
	  nid = elem_id.substring(elem_id.lastIndexOf("_") + 1);
	  window.location.href = skeletomeBase + "node/" + nid + "/edit";
	});
	$("#delete_" + letterNids[i]).click(function(i) {
	  elem_id = $(i.currentTarget)[0].id;
	  nid = elem_id.substring(elem_id.lastIndexOf("_") + 1);
	  currentLetterNid = nid;
	  $("#dialog-confirm").dialog( "open" );
	});
      }
      
    }
  };
})(jQuery);
