(function($) {

  var patientNid;
  var selectedGroups;
  var selectedDiscussionGroups;
  var forumNids;

  Drupal.behaviors.patientSharing = {
    attach: function (context, settings) {
      skeletomeBase = Drupal.settings.basePath  || [];
      patientNid = Drupal.settings.patientNid || [];
      forumNids = Drupal.settings.forumNids || [];
      selectedGroups = [];
      selectedDiscussionGroups = [];

      $("#available_groups").multiselect({
	header: "Choose groups below",
	click: function(event, ui){
	  if (ui.checked) {
	    selectedGroups.push(ui.value);
	  } else {
	    idx = -1;
	    for ( var i = 0; i < selectedGroups.length; i++ ) {
	      if (selectedGroups[i] === ui.value) {
		idx = i;
		break;
	      }
	    }
	    selectedGroups.splice(idx, 1);
	  }
	},
      });

    $("#available_discussiongroups").multiselect({
	header: "Choose groups below",
	click: function(event, ui){
	  if (ui.checked) {
	    selectedDiscussionGroups.push(ui.value);
	  } else {
	    idx = -1;
	    for ( var i = 0; i < selectedDiscussionGroups.length; i++ ) {
	      if (selectedGroups[i] === ui.value) {
		idx = i;
		break;
	      }
	    }
	    selectedDiscussionGroups.splice(idx, 1);
	  }
	},
      });

      $("#share_button").button().click(function() {
	link = skeletomeBase + "patient/share";
	$.post(link, { patientNid: patientNid, groupNids: selectedGroups}, function(data){
	  window.location.href = skeletomeBase + "node/" + patientNid + "/sharing";
	});
      });

      $("#discuss_button").button().click(function() {
	link = skeletomeBase + "patient/discuss";
	$.post(link, { patientNid: patientNid, groupNids: selectedDiscussionGroups}, function(data){
	  window.location.href = skeletomeBase + "node/" + patientNid + "/sharing";
	});
      });

      for (i = 0; i < forumNids.length; i++) {
	$("#forum_summary_" + forumNids[i]).editable(function(value, settings) {
	  link = skeletomeBase + "node/" + patientNid + "/forum-summary/set";
	  $.post(link, { forumNid: settings.id, summary: value});
	  if (value === '') {
	    value = '<i>(Please click to add a summary)</i>';
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
	  id		: forumNids[i],
	  select	: true,
	});
      }
      
    }
  };
  
})(jQuery);
