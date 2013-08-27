(function($) {

  var currentTagSelection = -1;
  var currentIndex = 0;
  var forumNid = -1;
  var currentNid = -1;
  var diagNids;

  Drupal.behaviors.patientDiagnosis = {
    attach: function (context, settings) {
      skeletomeBase = Drupal.settings.basePath || [];
      patientNid = Drupal.settings.patientNodeId || [];
      forumNid = Drupal.settings.forumNid;

      diagNids = Drupal.settings.diagNids || [];
      noDiags = Drupal.settings.noDiags || 0;

      $("#add_button").button().click(function() { $("#add_diagnosis_dialog").dialog( "open" ); });
      
      for (i = 0; i < noDiags; i++) {
	$("#comment_" + diagNids[i]).editable(function(value, settings) {
	  link = skeletomeBase + "node/" + patientNid + "/diagnosis/comment/set";
	  $.post(link, { diagNid: settings.id, comment: value});
	  if (value === '') {
	    value = '<i>(Please click to add a comment)</i>';
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
	  tooltip	: 'Click to edit...',
	  width		: 'none',
	  cancel	: 'Cancel',
	  submit	: 'OK',
	  type		: 'textarea',
	  id		: diagNids[i],
	  select	: true,
	});
      }

      
      for (i = 0; i < noDiags; i++) {
	$("#delete_" + diagNids[i]).click(function(i) { 
	  elem_id = $(i.currentTarget)[0].id;
	  nid = elem_id.substring(elem_id.lastIndexOf("_") + 1);
	  currentNid = nid;
	  $("#dialog-confirm").dialog( "open" );
	});
      }

      $("#dialog-confirm").dialog({
	autoOpen: false,
	resizable: false,
	height:		'auto',
	modal:		true,
	closeOnEscape:	true,
	buttons: {
	  "Delete": function() {
	    link = skeletomeBase + "node/" + patientNid + "/diagnosis/delete/" + currentNid;
	    $.post(link, { diagNid: currentNid}, function(data){
	      $("#dialog-confirm").dialog( "close" );
	      window.location.href = skeletomeBase + "node/" + patientNid + "/diagnosis";
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
      
      $("#add_diagnosis_dialog").dialog({
	autoOpen: false,
	width: 550,
	height: 135,
	modal:		true,
	closeOnEscape:	true,
	resizable: false,
	buttons: {
	  "Add": function() {
	    link = skeletomeBase + "node/" + patientNid + "/diagnosis/add/";
	    tagText = $("#patient_diag").val();
	    if (currentTagSelection == -1) {
	      link = link + currentTagSelection;
	      $.post(link, { bdTid: currentTagSelection, tagText: tagText}, function(data){
		$("#patient_diag").val('');
		$("#add_diagnosis_dialog").dialog( "close" );
	      });
	    } else {
	      link = link + currentTagSelection;
	      $.post(link, { bdTid: currentTagSelection}, function(data){
		$("#patient_diag").val('');
		$("#add_diagnosis_dialog").dialog( "close" );
	      });
	    }
	  },
	  Cancel: function() {
	    $("#patient_diag").val('');
	    $("#add_diagnosis_dialog").dialog( "close" );
	  }
	},
	open: function() {
	  $("#patient_diag").focus();
	  $("#add_diagnosis_dialog").keyup(function(e) {
	    if (e.keyCode == $.ui.keyCode.ENTER) {
	      link = skeletomeBase + "node/" + patientNid + "/diagnosis/add/";
	      tagText = $("#patient_diag").val();
	      if (currentTagSelection == -1) {
		link = link + currentTagSelection;
		$.post(link, { bdTid: currentTagSelection, tagText: tagText}, function(data){
		  $("#patient_diag").val('');
		  $("#add_diagnosis_dialog").dialog( "close" );
		});
	      } else {
		link = link + currentTagSelection;
		$.post(link, { bdTid: currentTagSelection}, function(data){
		  $("#patient_diag").val('');
		  $("#add_diagnosis_dialog").dialog( "close" );
		});
	      }
	    }
	  });
	},
	close: function() {
	  $("#patient_diag").val('');
	  window.location.href = skeletomeBase + "node/" + patientNid + "/diagnosis";
	}
      });
            
      $("#patient_diag").autocomplete({
	source: function( request, response ) {
	  $.ajax({
	    url: skeletomeBase + "skeletome-util/get-dysplasias",
	    data: {
	      max_count: 10,
	      tags_startsWith: request.term
	    },
	    success: function( data ) {
	      var actualData;
	      idx = data.indexOf("<div");
	      if (idx != -1) {
		actualData = data.substring(0, idx);
	      } else {
		actualData = data;
	      }
	      var JSON_data = eval('(' + actualData + ')');
	      response( $.map( JSON_data.terms, function( item ) {
		return {
		  label: item.term,
		  value: item.term,
		  id: item.tid
		}
	      }));
	    }
	  });
	},
	minLength: 2,
	select: function( event, ui ) {
	  currentTagSelection = ui.item.id;
	},
	open: function() {
	  $("#patient_diag").removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
	},
	close: function() {
	  $("#patient_diag").removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
	}
      });
      
    }
  };
  
})(jQuery);
