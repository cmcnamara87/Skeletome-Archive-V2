<?php

function patient_consent_callback($node) {
  $form_state['build_info']['args'] = array($node);
  return drupal_build_form('patient_consent_form', $form_state);
}

function patient_consent_form($node, &$form_state) {
  $node = $form_state['build_info']['args'][0];

  drupal_add_library('system', 'ui.button');
  drupal_add_library('system', 'ui.dialog');
  drupal_add_js(array('patientNodeId' => $node->nid), 'setting');
  drupal_add_css(drupal_get_path('module', 'patient') . '/patient_consent/patient_consent.css', array('group' => CSS_DEFAULT));
  drupal_add_js(drupal_get_path('module', 'patient') .'/patient_consent/patient_consent.js', array('group' => JS_DEFAULT));

  $confirm_html = '<div id="dialog-confirm" title="Delete consent?">
	<span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span>This consent and associated information will be permanently deleted. Are you sure?</div>';

  $form['add_button'] = array(
    '#markup' => '<div style="text-align:right;"><a id="add_consent_button" href="#">Add consent</a></div><hr style="border:dashed #CCCCCC; border-width:1px 0 0; height:0;" />',
    '#weight' => 1
  );

  $form['confirm_dialog'] = array(
    '#markup' => $confirm_html,
    '#weight' => 99999
  );

  if (array_key_exists('und', $node->field_patient_consent)) {
    $consent_nids = array();
    foreach ($node->field_patient_consent['und'] as $consent) {
      $consent_nids[] = $consent['nid'];
    }
    drupal_add_js(array('consentNids' => $consent_nids), 'setting');

    $title = '<div class="block-title"><h2 class="title">Current consent forms</h2></div>';    
    $consent_body = views_embed_view('patient_consent_items', 'view_block', $node->nid);

    $form['consent_body'] = array(
      '#markup' => $title . $consent_body . '<hr style="border:dashed #CCCCCC; border-width:1px 0 0; height:0;" />',
      '#weight' => 2
    );
  }

  return $form;
}

function delete_consent_callback($patient_node, $consent_nid) {
  remove_from_array($patient_node, 'field_patient_consent', 'nid', $consent_nid, TRUE);
  node_delete($consent_nid);
  exit;
}