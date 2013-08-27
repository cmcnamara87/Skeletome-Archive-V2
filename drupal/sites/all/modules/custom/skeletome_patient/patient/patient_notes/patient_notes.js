(function($) {

  var NoteEdit = {};
  var NoteHandler = {};
  var currentIndex = 0;
  var notesIdx;
  
  NoteEdit.updateText = function(text) {
    actualText = text;
    idx = text.indexOf("<div");
    if (idx != -1) {
      actualText = text.substring(0, idx);
    }
    $("#edit_note_text").val(actualText);
    $("#edit_note_dialog").dialog( "open" );
  }
    
  Drupal.behaviors.patientNotes = {
    attach: function (context, settings) {
      skeletomeBase = Drupal.settings.basePath  || [];
      patientNodeId = Drupal.settings.patientNodeId  || [];
      
      noNotes = Drupal.settings.noNotes || 0;
      notesIdx = Drupal.settings.notesIdx || [];

      var n_icons = {
	      header: "ui-icon-circle-arrow-e",
	      headerSelected: "ui-icon-circle-arrow-s"
      };
      $('.note_accordion').accordion({
	autoHeight: false,
	collapsible: true,
	icons: n_icons,
      });
      $('.note_accordion').bind('accordionchange', function(event, ui) {
	currentIndex = $('.note_accordion').accordion('option', 'active');
      });
      
      $("#add_note_dialog").dialog({
	      autoOpen: false,
	      height: 'auto',
	      width: 300,
	      closeOnEscape:	true,
	      modal: true,
	      resizable: false,
	      buttons: {
		      "Save": function() {
			link = skeletomeBase + "node/" + patientNodeId + "/notes/add";
			noteText = $("#note_text").val();
			if (noteText !== "") {
			  $.post(link, { text: noteText}, function(data){
			    $("#note_text").val('');
			    $("#add_note_dialog").dialog( "close" );
			  });
			}
		      },
		      Cancel: function() {
			$("#note_text").val('');
			$("#add_note_dialog").dialog( "close" );
		      }
	      },
	      open: function() {
		$("#note_text").focus();
	      },
	      close: function() {
		$("#note_text").val('');
		window.location.href = skeletomeBase + "node/" + patientNodeId + "/notes";
	      }
      });
      $("#edit_note_dialog").dialog({
	      autoOpen: false,
	      height: 'auto',
	      width: 300,
	      closeOnEscape:	true,
	      modal: true,
	      resizable: false,
	      buttons: {
		      "Save": function() {
			link = skeletomeBase + "node/" + patientNodeId + "/notes/update/" + notesIdx[currentIndex];
			noteText = $("#edit_note_text").val();
			if (noteText !== "") {
			  $.post(link, { idx: notesIdx[currentIndex], patientNid: patientNodeId, text:noteText}, function(data){
			    $("#edit_note_text").val('');
			    $("#edit_note_dialog").dialog( "close" );
			  });
			}
		      },
		      Cancel: function() {
			$("#edit_note_text").val('');
			$("#edit_note_dialog").dialog( "close" );
		      }
	      },
	      open: function() {
		$("#note_text").focus();
	      },
	      close: function() {
		$("#edit_note_text").val('');
		window.location.href = skeletomeBase + "node/" + patientNodeId + "/notes";
	      }
      });

      $("#add_note_button").button().click(function() { $("#add_note_dialog").dialog( "open" ); });
      for (i = 0; i < noNotes; i++) {
	$("#edit_button_" + notesIdx[i]).button().click(
	  function() {
	      editLink = skeletomeBase + "node/" + patientNodeId + "/notes/edit/" + notesIdx[currentIndex];
	      $.post(editLink, 
		    { idx: notesIdx[currentIndex], patientNid: patientNodeId}, 
		    function(data){
		      NoteEdit.updateText(data);
		    }
	      );
	    }
	  );
      }
      for (i = 0; i < noNotes; i++) {
	$("#delete_button_" + notesIdx[i]).button().click(function() { window.location.href = skeletomeBase + "node/" + patientNodeId + "/notes/delete/" . notesIdx[currentIndex]; });
      }
    }
  };
  
})(jQuery);
