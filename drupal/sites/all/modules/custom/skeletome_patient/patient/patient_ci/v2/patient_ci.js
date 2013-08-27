(function($) {

  Drupal.behaviors.patientNotes = {
    attach: function (context, settings) {
      skeletomeBase = Drupal.settings.basePath  || [];
      ciNid = Drupal.settings.ciNodeId  || [];

      $("#edit_button").button().click(function() { window.location.href = skeletomeBase + "node/" + ciNid + "/edit"; });

    }
  };
  
})(jQuery);
