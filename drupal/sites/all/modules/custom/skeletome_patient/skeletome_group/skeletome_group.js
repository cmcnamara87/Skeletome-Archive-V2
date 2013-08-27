(function($) {

  Drupal.behaviors.patientGroup = {
    attach: function (context, settings) {
      skeletomeBase = Drupal.settings.basePath || [];
      groupNid = Drupal.settings.groupNodeId || [];
      userId = Drupal.settings.userId || [];

      $("#subscribe-dialog").dialog({
	autoOpen:	false,
	resizable:	false,
	height:		'auto',
	modal:		true,
	closeOnEscape:	true,
	buttons: {
	  "Subscribe": function() {
	    link = skeletomeBase + "node/" + groupNid + "/subscribe/" + userId;
	    $.post(link, { userId: userId}, function(data){
	      $("#subscribe-dialog").dialog( "close" );
	      window.location.href = skeletomeBase + "node/" + groupNid;
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

      $("#unsubscribe-dialog").dialog({
	autoOpen: false,
	resizable: false,
	width:		360,
	height:		'auto',
	modal:		true,
	closeOnEscape:	true,
	buttons: {
	  "Unsubscribe": function() {
	    link = skeletomeBase + "node/" + groupNid + "/unsubscribe/" + userId;
	    $.post(link, { userId: userId}, function(data){
	      $("#unsubscribe-dialog").dialog( "close" );
	      window.location.href = skeletomeBase + "node/" + groupNid;
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
