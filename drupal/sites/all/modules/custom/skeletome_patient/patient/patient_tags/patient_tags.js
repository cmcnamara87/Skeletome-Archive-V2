(function($) {

  var patientTags = {};
  var currentTagSelection = -1;
  var terms;
  var skeletomeBase;
  var patientNid;

  patientTags.removeTerm = function (context) {
    var tag = $(context);
    var term = tag.parent();
    tag.parent().remove();

    var tid;
    term.find('.pt-term-text').each(function (i) {
      var tText = $(this).text().replace(/["]/g, '');
      tid = terms[tText];
    });
    
    link = skeletomeBase + "patient/delete-custom-tag/" + patientNid + "/" + tid;
    $.post(link, function(data){
      window.location.href = skeletomeBase + "node/" + patientNid;
    });
  };

  patientTags.clickTerm = function (context) {
    var tag = $(context);
    tid = terms[tag.text()];
    window.location.href = skeletomeBase + "taxonomy/term/" + tid;
  }
  
  Drupal.behaviors.pTags = {
    attach: function (context, settings) {
      skeletomeBase = Drupal.settings.basePath  || [];
      patientNid = Drupal.settings.patientNid || [];

      $("#add_custom_tag_button").button().click(function() { $("#add_custom_tag_dialog").dialog( "open" ); });
     
      $("#add_custom_tag_dialog").dialog({
	autoOpen: false,
	height: 135,
	width: 550,
	modal: true,
	closeOnEscape:	true,
	resizable: false,
	buttons: {
	  "Add": function() {
	    link = skeletomeBase + "patient/add-custom-tag";
	    tagText = $("#patient_tag").val();
	    if (currentTagSelection == -1) {
	      $.post(link, { patientNid: patientNid, tagTid: currentTagSelection, tagText: tagText}, function(data){
		$("#patient_tag").val('');
		$("#add_custom_tag_dialog").dialog( "close" );
	      });
	    } else {
	      $.post(link, { patientNid: patientNid, tagTid: currentTagSelection}, function(data){
		$("#patient_tag").val('');
		$("#add_custom_tag_dialog").dialog( "close" );
	      });
	    }
	  },
	  Cancel: function() {
	    $("#patient_tag").val('');
	    $("#add_custom_tag_dialog").dialog( "close" );
	  }
	},
	open: function() {
	  $("#patient_tag").focus();
	  $("#add_custom_tag_dialog").keyup(function(e) {
	    if (e.keyCode == $.ui.keyCode.ENTER) {
	      link = skeletomeBase + "patient/add-custom-tag";
	      tagText = $("#patient_tag").val();
	      if (currentTagSelection == -1) {
		$.post(link, { patientNid: patientNid, tagTid: currentTagSelection, tagText: tagText}, function(data){
		  $("#patient_tag").val('');
		  $("#add_custom_tag_dialog").dialog( "close" );
		});
	      } else {
		$.post(link, { patientNid: patientNid, tagTid: currentTagSelection}, function(data){
		  $("#patient_tag").val('');
		  $("#add_custom_tag_dialog").dialog( "close" );
		});
	      }
	    }
	  });
	},
	close: function() {
	  $("#patient_tag").val('');
	  window.location.href = skeletomeBase + "node/" + patientNid;
	}
      });
     
      $("#patient_tag").autocomplete({
	source: function( request, response ) {
	  $.ajax({
	    url: skeletomeBase + "skeletome-util/get-custom-tags",
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
	  $("#patient_tag").removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
	},
	close: function() {
	  $("#patient_tag").removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
	}
      });
    }
  };
  
  Drupal.behaviors.patientTagsTermClick = {
    attach: function (context, settings) {
      terms = Drupal.settings.terms || [];
      
      $('span.pt-term-text:not(.patientTagsRemove-processed)', context)
	.addClass('patientTagsRemove-processed')
	.each(function () {
	  $(this).click(function () {
	    patientTags.clickTerm(this);
	  })
	});
    }
  };

  Drupal.behaviors.patientTagsRemove = {
    attach: function (context, settings) {
      $('span.pt-term-action-remove:not(.patientTagsRemove-processed)', context)
	.addClass('patientTagsRemove-processed')
	.each(function () {
	  $(this).click(function () {
	    patientTags.removeTerm(this);
	  })
	});
    }
  };
  
  
})(jQuery);
