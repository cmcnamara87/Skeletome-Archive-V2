(function($) {
  
  var skeletomeBase;
  
  function wordanalyser_keyhandler(ed, event) {
    if (Drupal.settings.wysiwyg!=null) {
      text=tinyMCE.activeEditor.contentDocument.body.textContent;
    }

    if ( $("#node-form") ){
      var action = $("#node-form").context.URL;
      var node_id = "";
      if ( action.indexOf('edit') > 0) {
	//The id starts after 'node/' until '/edit'
	node_id = action.substring( (action.indexOf('node/')+'node/'.length), (action.indexOf('/edit') ) );
      }
    }
    
    var base=window.location.protocol + "//" + window.location.host + "" + skeletomeBase;
    if ((event.charCode == $.ui.keyCode.SPACE) || (event.keyCode == $.ui.keyCode.ENTER) || (event.keyCode == $.ui.keyCode.DELETE) ||
	(event.keyCode == $.ui.keyCode.BACKSPACE) || (event.charCode == 44) || (event.charCode == 46) || (event.charCode == 59) || (event.charCode == 58)) {
      $.post(base + "clinicalsummary/recommend_tags", {
		                text: text
                   },function(data){
                       $('div.weighted_tag_suggestions').html(data);
                       TagRecommendation.updateTags();
                   },"html");
    }
  }

$(document).ready(
    function(){
      skeletomeBase = Drupal.settings.basePath  || [];
      ncboActive = Drupal.settings.ncbo_active || false;
      
      if ((Drupal.settings.wysiwyg != null) && (ncboActive)) {
	intervalid=setInterval(function () {
	  if ($("#edit-body-und-0-value").contents().find('body').length>=0) { 
	    tinyMCE.activeEditor.onKeyPress.add(wordanalyser_keyhandler);
            clearInterval(intervalid);
	  }                                          
	}, 500);
      }
    }
  );


})(jQuery);
