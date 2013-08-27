(function($) {

  var patientNid;

  Drupal.behaviors.patientOverview = {
    attach: function (context, settings) {
      skeletomeBase = Drupal.settings.basePath  || [];
      patientNid = Drupal.settings.patientNid || [];

      $("#add_identifier_button").button().click(function() { 
	$("#add_identifier_dialog").dialog( "open" ); 
      });

      $("#add_identifier_dialog").dialog({
	autoOpen: false,
	height: 135,
	width: 550,
	modal: true,
	closeOnEscape:	true,
	resizable: false,
	buttons: {
	  "Add": function() {
	    link = skeletomeBase + "patient/add-identifier/" + patientNid;
	    idText = $("#identifier_input").val();
	    $.post(link, { identifier: idText}, function(data){
	      $("#identifier_input").val('');
	      $("#add_identifier_dialog").dialog( "close" );
	    });
	  },
	  Cancel: function() {
	    $("#identifier_input").val('');
	    $("#add_identifier_dialog").dialog( "close" );
	  }
	},
	open: function() {
	  $("#identifier_input").focus();
	  $("#add_identifier_dialog").keyup(function(e) {
	    if (e.keyCode == $.ui.keyCode.ENTER) {
	      link = skeletomeBase + "patient/add-identifier/" + patientNid;
	      idText = $("#identifier_input").val();
	      $.post(link, { identifier: idText}, function(data){
		$("#identifier_input").val('');
		$("#add_identifier_dialog").dialog( "close" );
	      });
	      $("#add_identifier_dialog").dialog( "close" );
	    }
	  });
	},
	close: function() {
	  $("#identifier_input").val('');
	  window.location.href = skeletomeBase + "node/" + patientNid;
	}
      });
      
      $("#delete_patient").button().click(function() { 
	$("#delete_patient_dialog").dialog( "open" ); 
      });
      
      $("#delete_patient_dialog").dialog({
	autoOpen: false,
	resizable: false,
	height:		'auto',
	modal:		true,
	closeOnEscape:	true,
	buttons: {
	  "Delete": function() {
	    link = skeletomeBase + "patient/delete-patient";
	    $.post(link, { patientNid: patientNid}, function(data){
	      $("#dialog-confirm").dialog( "close" );
	      window.location.href = skeletomeBase;
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

    }
  };
  
})(jQuery);
