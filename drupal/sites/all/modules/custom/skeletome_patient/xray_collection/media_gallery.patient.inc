<?php

function create_collection_html($xrayNode) {
  $html = '';

  $html_back_to_patient = '<div style="text-align:left;"><a id="back_button" href="#">&lt;&lt; Back to patient overview</a>';
  if (is_current_user_owner($xrayNode)) {
    $html = $html . $html_back_to_patient;
    $base_path = url(NULL, array('absolute' => TRUE));
    $html_add_gm = '<span style="float:right;"><a id="add_button" href="' . $base_path . 'media/browser?render=media-popup" class="media-gallery-add launcher">Add X-Rays</a><a id="edit_button" href="#">Edit report</a><a id="delete_button" href="#">Delete report</a></span></div><hr style="border:dashed #CCCCCC; border-width:1px 0 0; height:0;" /><div id="dialog-confirm" title="Delete report?">
	<span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span>This report and associated X-Rays will be permanently deleted. Are you sure?</div>';
    $html = $html . $html_add_gm;

    $date_html = date_format_date(new DateObject($xrayNode->media_gallery_date['und'][0]['value']), 'full');
    $html = $html . '<strong>Date: </strong>' . $date_html;

    if (array_key_exists('und', $xrayNode->media_gallery_description)) {
      $description = $xrayNode->media_gallery_description['und'][0]['value'];
      $html = $html . '<br/><strong>Description: </strong>' . $description;
    }
    if (array_key_exists('und', $xrayNode->media_gallery_media)) {
      $html = $html . '<h3><u>X-Rays</u></h3>';
    }

  } else {
    $html = $html . '</div><hr style="border:dashed #CCCCCC; border-width:1px 0 0; height:0;" />';
  }

  return $html;
}
