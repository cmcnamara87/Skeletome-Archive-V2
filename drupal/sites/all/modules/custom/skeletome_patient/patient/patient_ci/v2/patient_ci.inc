<?php

function patient_ci_callback($node) {
  $form_state['build_info']['args'] = array($node);
  return drupal_build_form('patient_ci_form', $form_state);
}

function patient_ci_form($node, &$form_state) {
  $node = $form_state['build_info']['args'][0];

  drupal_add_library('system', 'ui.button');
  drupal_add_js(array('ciNodeId' => $node->field_patient_ci['und'][0]['nid']), 'setting');
  drupal_add_js(drupal_get_path('module', 'patient') .'/patient_ci/patient_ci.js', array('group' => JS_DEFAULT));

  $view = views_embed_view('patient_contact_information', 'contact_info', $node->nid);

  $form['contact_information'] = array(
    '#markup' => '<div class="block-title"><h2 class="title">Contact Information</h2></div>' . $view,
    '#weight' => 1
  );

  $form['edit_button'] = array(
    '#markup' => '<div style="text-align:right;"><a id="edit_button" href="#">Edit</a></div><hr style="border:dashed #CCCCCC; border-width:1px 0 0; height:0;" />',
    '#weight' => 1
  );


  return $form;
}
