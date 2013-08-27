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
    
    link = skeletomeBase + "node/" + patientNid + "/clinical-summary/delete-tag/" + tid;
    $.post(link);
  };

  patientTags.clickTerm = function (context) {
    var tag = $(context);
    tid = terms[tag.text()];
    window.location.href = skeletomeBase + "taxonomy/term/" + tid;
  }
  
  Drupal.behaviors.clinicalSummary = {
    attach: function (context, settings) {
      skeletomeBase = Drupal.settings.basePath  || [];
      patientNid = Drupal.settings.patientNid || [];
      csNid = Drupal.settings.csNid || [];
      
      $("#add_button").button().click(function() { window.location.href = skeletomeBase + "node/add/clinical-summary/" + patientNid; });
      $("#edit_button").button().click(function() { window.location.href = skeletomeBase + "node/" + csNid + "/edit"; });
      $("#delete_button").button().click(function() { window.location.href = skeletomeBase + "node/" + patientNid + "/clinical-summary/delete"; });
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
