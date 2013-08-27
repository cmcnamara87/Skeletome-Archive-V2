(function($) {

  var currentNid = -1;

  Drupal.behaviors.patientXRays = {
    attach: function (context, settings) {
      skeletomeBase = Drupal.settings.basePath  || [];
      patientNid = Drupal.settings.patientNodeId  || [];

      noXRays = Drupal.settings.noXRays  || [];
      xRayNids = Drupal.settings.xRayNids  || [];

      $("#dialog-confirm").dialog({
	autoOpen: false,
	resizable: false,
	height:		'auto',
	modal:		true,
	closeOnEscape:	true,
	buttons: {
	  "Delete": function() {
	    link = skeletomeBase + "node/" + patientNid + "/xrays/delete/" + currentNid;
	    $.post(link, { xrayNid: currentNid}, function(data){
	      $("#dialog-confirm").dialog( "close" );
	      window.location.href = skeletomeBase + "node/" + patientNid + "/xrays";
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

      $("#add_button").button().click(function() { window.location.href = skeletomeBase + "node/add/media-gallery/" + patientNid; });

      for (i = 0; i < noXRays; i++) {
	currentIndex = i;
	$("#xray_goto_" + xRayNids[i]).button().click(function(i) { 
	  elem_id = $(i.currentTarget)[0].id;
	  nid = elem_id.substring(elem_id.lastIndexOf("_") + 1);
	  window.location.href = skeletomeBase + "node/" + nid; 
	});
	$("#xray_edit_" + xRayNids[i]).button().click(function(i) { 
	  elem_id = $(i.currentTarget)[0].id;
	  nid = elem_id.substring(elem_id.lastIndexOf("_") + 1);
	  window.location.href = skeletomeBase + "node/" + nid + "/edit"; 
	});
	$("#xray_delete_" + xRayNids[i]).button().click(function(i) { 
	  elem_id = $(i.currentTarget)[0].id;
	  nid = elem_id.substring(elem_id.lastIndexOf("_") + 1);
	  currentNid = nid;
	  $("#dialog-confirm").dialog( "open" );
//	  window.location.href = skeletomeBase + "node/" + nid + "/delete"; 
	});
      }
     
    }
  };
  
})(jQuery);
