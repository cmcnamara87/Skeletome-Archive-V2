(function($) {

  var xrayTags = {};
  var terms;
  var xrayNodeId = -1;
  var xrayNid = -1;
  var fid = -1;
  var patientNodeId = -1;

  xrayTags.removeTerm = function (context) {
    var tag = $(context);
    var term = tag.parent();
    tag.parent().remove();

    var tid;
    term.find('.pt-term-text').each(function (i) {
      var tText = $(this).text().replace(/["]/g, '');
      tid = terms[tText];
    });
    
    link = skeletomeBase + "node/" + patientNodeId + "/xrays/delete-tag/" + xrayNodeId + "/" + fid + "/" + tid;
    $.post(link);
  };

  xrayTags.clickTerm = function (context) {
    var tag = $(context);
    tid = terms[tag.text()];
    window.location.href = skeletomeBase + "taxonomy/term/" + tid;
  }

  Drupal.behaviors.xrayCollection = {
    attach: function (context, settings) {
      skeletomeBase = Drupal.settings.basePath  || [];
      xrayNodeId = Drupal.settings.xrayNodeId  || [];
      patientNodeId = Drupal.settings.patientNodeId  || [];
      fid = Drupal.settings.fid || [];
      xrayNid = Drupal.settings.xrayNid || [];
      descNid = Drupal.settings.descNid || [];

      $("#dialog-confirm").dialog({
	autoOpen: false,
	resizable: false,
	height:'auto',
	closeOnEscape:	true,
	modal: true,
	buttons: {
	  "Delete": function() {
	    link = skeletomeBase + "node/" + patientNodeId + "/xrays/delete/" + xrayNodeId;
	    $.post(link, { xrayNid: xrayNodeId}, function(data){
	      $("#dialog-confirm").dialog( "close" );
	      window.location.href = skeletomeBase + "node/" + patientNodeId + "/xrays";
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
      
      $("#dialog-confirm-xray").dialog({
	autoOpen: false,
	resizable: false,
	height:'auto',
	closeOnEscape:	true,
	modal: true,
	buttons: {
	  "Delete": function() {
	    link = skeletomeBase + "media-gallery/detail/" + xrayNodeId + "/" + fid + "/remove";
	    $.post(link, { xrayNodeId: xrayNodeId, fid: fid}, function(data){
	      $("#dialog-confirm-xray").dialog( "close" );
	      window.location.href = skeletomeBase + "node/" + xrayNodeId;
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
      
      $("#dialog-confirm-xraydesc").dialog({
	autoOpen: false,
	resizable: false,
	height:'auto',
	closeOnEscape:	true,
	modal: true,
	buttons: {
	  "Delete": function() {
	    link = skeletomeBase + "node/" + descNid + "/delete-description";
	    $.post(link, { descNid: descNid}, function(data){
	      $("#dialog-confirm-xraydesc").dialog( "close" );
	      window.location.href = skeletomeBase + "node/" + xrayNid;
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

      $("#add_button").button();

      $("#back_button").button().click(function() { 
	window.location.href = skeletomeBase + "node/" + patientNodeId + "/xrays";
      });
      $("#edit_button").button().click(function() { 
	window.location.href = skeletomeBase + "node/" + xrayNodeId + "/edit"; 
      });
      $("#delete_button").button().click(function(i) {
	  $("#dialog-confirm").dialog( "open" );
      });

      $("#edit_image_button").button().click(function() { 
	window.location.href = skeletomeBase + "media-gallery/detail/" + xrayNodeId + "/" + fid + "/edit"; 
      });
      $("#delete_image_button").button().click(function(i) {
	$("#dialog-confirm-xray").dialog( "open" );
      });
    
      $("#add_userdesc_button").button().click(function() { 
	window.location.href = skeletomeBase + "node/add/xray-description/" + xrayNid + "/" + fid; 
      });
      
      $("#edit_userdesc_button").button().click(function() { 
	window.location.href = skeletomeBase + "node/" + descNid + "/edit"; 
      });

      $("#delete_userdesc_button").button().click(function() { 
	$("#dialog-confirm-xraydesc").dialog("open");
      });

    }
  };
  
  Drupal.behaviors.xrayTagsTermClick = {
    attach: function (context, settings) {
      terms = Drupal.settings.terms || [];
      
      $('span.pt-term-text:not(.patientTagsRemove-processed)', context)
	.addClass('patientTagsRemove-processed')
	.each(function () {
	  $(this).click(function () {
	    xrayTags.clickTerm(this);
	  })
	});
    }
  };
  
  Drupal.behaviors.xrayTagsRemove = {
    attach: function (context, settings) {
      $('span.pt-term-action-remove:not(.patientTagsRemove-processed)', context)
	.addClass('patientTagsRemove-processed')
	.each(function () {
	  $(this).click(function () {
	    xrayTags.removeTerm(this);
	  })
	});
    }
  };
  
})(jQuery);
