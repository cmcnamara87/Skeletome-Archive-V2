(function($) {

  var currentNid = -1;
  var currentGMNid = -1;
  var genrepNids;
  var genrepGms;

  Drupal.behaviors.patientGenRep = {
    attach: function (context, settings) {
      skeletomeBase = Drupal.settings.basePath || [];
      patientNid = Drupal.settings.patientNodeId || [];

      noGmReps = Drupal.settings.noGmReps || 0;
      genrepNids = Drupal.settings.genrepNids || [];
      genrepGms = Drupal.settings.genrepGms || [];

      $("#dialog-confirm").dialog({
	autoOpen: false,
	resizable: false,
	height:		'auto',
	modal:		true,
	closeOnEscape:	true,
	buttons: {
	  "Delete": function() {
	    link = skeletomeBase + "node/" + patientNid + "/genetic-reports/delete/" + currentNid;
	    $.post(link, { genrepNid: currentNid}, function(data){
	      $("#dialog-confirm").dialog( "close" );
	      window.location.href = skeletomeBase + "node/" + patientNid + "/genetic-reports";
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
      $("#dialog-confirm-gm").dialog({
	autoOpen: false,
	resizable: false,
	height:		'auto',
	modal:		true,
	closeOnEscape:	true,
	buttons: {
	  "Delete": function() {
	    link = skeletomeBase + "node/" + patientNid + "/genetic-reports/delete-mutation/" + currentGMNid;
	    $.post(link, { currentGMNid: currentGMNid}, function(data){
	      $("#dialog-confirm").dialog( "close" );
	      window.location.href = skeletomeBase + "node/" + patientNid + "/genetic-reports";
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

      $("#add_button").button().click(function() { window.location.href = skeletomeBase + "node/add/genetic-report/" + patientNid; });

      for (i = 0; i < noGmReps; i++) {
	$("#genrep_add_" + genrepNids[i]).button().click(function(i) {
	  elem_id = $(i.currentTarget)[0].id;
	  nid = elem_id.substring(elem_id.lastIndexOf("_") + 1);
	  window.location.href = skeletomeBase + "node/add/gene-mutation/" + nid;
	});
	$("#genrep_edit_" + genrepNids[i]).button().click(function(i) { 
	  elem_id = $(i.currentTarget)[0].id;
	  nid = elem_id.substring(elem_id.lastIndexOf("_") + 1);
	  window.location.href = skeletomeBase + "node/" + nid + "/edit"; 
	});
	$("#genrep_delete_" + genrepNids[i]).button().click(function(i) { 
	  elem_id = $(i.currentTarget)[0].id;
	  nid = elem_id.substring(elem_id.lastIndexOf("_") + 1);
	  currentNid = nid;
	  $("#dialog-confirm").dialog( "open" );
	});
      }

      for (i = 0; i < noGmReps; i++) {
	for (j = 0; j < genrepGms[i].length; j++) {
	  $("#edit_" + genrepGms[i][j]).click(function(i) {
	    elem_id = $(i.currentTarget)[0].id;
	    nid = elem_id.substring(elem_id.lastIndexOf("_") + 1);
	    window.location.href = skeletomeBase + "node/" + nid + "/edit";
	  });
	  $("#delete_" + genrepGms[i][j]).click(function(i) {
	    elem_id = $(i.currentTarget)[0].id;
	    nid = elem_id.substring(elem_id.lastIndexOf("_") + 1);
	    currentGMNid = nid;
	    $("#dialog-confirm-gm").dialog( "open" );
	  });
	}
      }
      
    }
  };
})(jQuery);
