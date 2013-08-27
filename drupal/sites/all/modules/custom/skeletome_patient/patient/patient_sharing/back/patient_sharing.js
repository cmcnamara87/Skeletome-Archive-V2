(function($) {

  var patientNid;
  var groupNids;
  var selectedGroups;

  var nonmemberGroupNids;
  var selectedNonMemberGroups;

  Drupal.behaviors.patientSharing = {
    attach: function (context, settings) {
      skeletomeBase = Drupal.settings.basePath  || [];
      patientNid = Drupal.settings.patientNid || [];
      groupNids = Drupal.settings.groupNids || [];
      nonmemberGroupNids = Drupal.settings.nonmemberGroupNids || [];

      $("#available_groups").multiselect({
	header: "Choose groups below",
	click: function(event, ui){
	    alert(ui.value + ' ' + (ui.checked ? 'checked' : 'unchecked') );
	},
      });
      
      $("#share_patient_button").button().click(function() { 
	$("#add_group_dialog").dialog( "open" ); 
      });
      
      $("#send_patient_button").button().click(function() { 
	$("#add_nonmember_group_dialog").dialog( "open" ); 
      });
      
      $("#add_group_dialog").dialog({
	autoOpen: false,
	height: 285,
	width: 550,
	modal: true,
	resizable: false,
	buttons: {
	  "Share": function() {
	    link = skeletomeBase + "patient/add-groups";
	    $.post(link, { patientNid: patientNid, groupNids: selectedGroups}, function(data){
	      $("#add_group_dialog").dialog( "close" );
	      window.location.href = skeletomeBase + "node/" + patientNid;
	    });
	  },
	  Cancel: function() {
	    $("#add_group_dialog").dialog( "close" );
	  }
	}
      });
     
      $("#group_list").selectable({
	stop: function(event, ui) {
	  selectedGroups = new Array();
	  $( ".ui-selected", this ).each(function() {
	    var index = $( "#group_list li" ).index( this );
	    selectedGroups.push(groupNids[index]);
	  });
	}
      });

      $("#enable_diag_dialog").dialog({
	autoOpen: false,
	resizable: false,
	height:140,
	modal: true,
	buttons: {
	  "Yes": function() {
	    diagEnabled = true;
	    link = skeletomeBase + "patient/add-nonmember-groups";
	    $.post(link, { patientNid: patientNid, groupNids: selectedNonMemberGroups, diagEnabled: diagEnabled}, function(data){
	      $("#enable_diag_dialog").dialog( "close" );
	      $("#add_nonmember_group_dialog").dialog( "close" );
	      window.location.href = skeletomeBase + "node/" + patientNid;
	    });
	  },
	  "No": function() {
	    diagEnabled = false;
	    link = skeletomeBase + "patient/add-nonmember-groups";
	    $.post(link, { patientNid: patientNid, groupNids: selectedNonMemberGroups, diagEnabled: diagEnabled}, function(data){
	      $("#enable_diag_dialog").dialog( "close" );
	      $("#add_nonmember_group_dialog").dialog( "close" );
	      window.location.href = skeletomeBase + "node/" + patientNid;
	    });
	  }
	}
      });

    $("#add_nonmember_group_dialog").dialog({
	autoOpen: false,
	height: 285,
	width: 550,
	modal: true,
	resizable: false,
	buttons: {
	  "Send": function() {
	    $("#enable_diag_dialog").dialog("open");
	  },
	  Cancel: function() {
	    $("#add_nonmember_group_dialog").dialog( "close" );
	  }
	}
      });

    $("#nonmember_group_list").selectable({
	stop: function(event, ui) {
	  selectedNonMemberGroups = new Array();
	  $( ".ui-selected", this ).each(function() {
	    var index = $( "#nonmember_group_list li" ).index( this );
	    selectedNonMemberGroups.push(nonmemberGroupNids[index]);
	  });
	}
      });

    }
  };
  
})(jQuery);
