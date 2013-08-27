<?php

function patient_letters_callback($node) {
  $form_state['build_info']['args'] = array($node);
  return drupal_build_form('patient_letters_form', $form_state);
}

function patient_letters_form($node, &$form_state) {
  $node = $form_state['build_info']['args'][0];

  drupal_add_library('system', 'ui.button');
  drupal_add_library('system', 'ui.dialog');
  drupal_add_js(array('patientNodeId' => $node->nid), 'setting');
  drupal_add_css(drupal_get_path('module', 'patient') . '/patient_letters/patient_letters.css', array('group' => CSS_DEFAULT));
  drupal_add_js(drupal_get_path('module', 'patient') .'/patient_letters/patient_letters.js', array('group' => JS_DEFAULT));

  $confirm_html = '<div id="dialog-confirm" title="Delete letter?">
	<span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span>This letter and associated information will be permanently deleted. Are you sure?</div>';

  $form['add_button'] = array(
    '#markup' => '<div style="text-align:right;"><a id="add_letter_button" href="#">Add reference letter</a></div><hr style="border:dashed #CCCCCC; border-width:1px 0 0; height:0;" />',
    '#weight' => 1
  );

  $form['confirm_dialog'] = array(
    '#markup' => $confirm_html,
    '#weight' => 99999
  );

  if (array_key_exists('und', $node->field_patient_letter)) {
    $letter_nids = array();
    foreach ($node->field_patient_letter['und'] as $letter) {
      $letter_nids[] = $letter['nid'];
    }
    drupal_add_js(array('letterNids' => $letter_nids), 'setting');

    $title = '<div class="block-title"><h2 class="title">Current reference letters</h2></div>';
    $letters_body = views_embed_view('patient_reference_letters', 'view_block', $node->nid);

    $form['letters_body'] = array(
      '#markup' => $title . $letters_body . '<hr style="border:dashed #CCCCCC; border-width:1px 0 0; height:0;" />',
      '#weight' => 2
    );
  }

  return $form;
}

function delete_letter_callback($patient_node, $letter_nid) {
  remove_from_array($patient_node, 'field_patient_letter', 'nid', $letter_nid, TRUE);
  node_delete($letter_nid);
  exit;
}