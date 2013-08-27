<?php

function patient_cs_callback($node) {
  $form_state['build_info']['args'] = array($node);
  return drupal_build_form('patient_cs_form', $form_state);
}

function patient_cs_form($node, &$form_state) {
  $node = $form_state['build_info']['args'][0];
  $form = array();
  drupal_add_library('system', 'ui.button');
  drupal_add_js(array('patientNid' => $node->nid), 'setting');

  drupal_add_css(drupal_get_path('module', 'patient') . '/patient_cs/patient_cs.css', array('group' => CSS_DEFAULT));

  if (array_key_exists('und', $node->field_patient_clinicalsummary)) {
    drupal_add_js(array('csNid' => $node->field_patient_clinicalsummary['und'][0]['nid']), 'setting');
  }
  drupal_add_js(drupal_get_path('module', 'patient') .'/patient_cs/patient_cs.js', array('group' => JS_DEFAULT));

  if (array_key_exists('und', $node->field_patient_clinicalsummary)) {
    $cs_node = node_load($node->field_patient_clinicalsummary['und'][0]['nid']);
    $cs_body = $cs_node->field_cs_clinicalsummary['und'][0]['value'];

    if (is_current_user_owner($node)) {
      $form['edit_button'] = array(
	'#markup' => '<div style="text-align:right;"><a id="edit_button" href="#">Edit clinical summary</a>',
	'#weight' => 1
      );
      $form['delete_button'] = array(
	'#markup' => '<a id="delete_button" href="#">Delete</a></div>',
	'#weight' => 2
      );
    }

    $form['clinical_summary'] = array(
      '#markup' => '<div class="block-title"><h2 class="title">Clinical summary</h2></div>',
      '#weight' => 3
    );

    $form['cs_body'] = array(
      '#markup' => $cs_body,
      '#weight' => 4
    );

    if (is_current_user_owner($node)) {
      $tags_html = create_tags_for_owner($cs_node);
    } else {
      $tags_html = create_tags($cs_node);
    }
    if ($tags_html !== '') {
      $form['cs_tags'] = array(
	'#markup' => '<strong>HPO terms: </strong>' . $tags_html,
	'#weight' => 5
      );
    }

    $form['hr'] = array(
      '#markup' => '<hr style="border:dashed #CCCCCC; border-width:1px 0 0; height:0;" />',
      '#weight' => 6
    );

  } else {
    if (is_current_user_owner($node)) {
      $form['add_button'] = array(
	'#markup' => '<div style="text-align:right;"><a id="add_button" href="#">Add clinical summary</a></div>',
	'#weight' => 1
      );

      $form['hr'] = array(
	'#markup' => '<hr style="border:dashed #CCCCCC; border-width:1px 0 0; height:0;" />',
	'#weight' => 6
      );
    }
  }

  return $form;
}


function create_tags($cs_node) {
  $html = '';
  $terms = array();

  if (array_key_exists('und', $cs_node->field_cs_tags)) {
    foreach($cs_node->field_cs_tags['und'] as $tag) {
      $term = taxonomy_term_load($tag['tid']);
      $terms[$term->name] = $term->tid;

      $term_html = '<div class="pt-term pt-term-remove">';
      $term_html = $term_html . '<span class="pt-term-text">' . $term->name . '</span>';
      $term_html = $term_html . '</div>';
      $html = $html . $term_html;
    }
    drupal_add_js(array('terms' => $terms), 'setting');
  }
  return $html;
}

function create_tags_for_owner($cs_node) {
  $html = '';
  $terms = array();

  if (array_key_exists('und', $cs_node->field_cs_tags)) {
    foreach($cs_node->field_cs_tags['und'] as $tag) {
      $term = taxonomy_term_load($tag['tid']);
      $terms[$term->name] = $term->tid;

      $term_html = '<div class="pt-term pt-term-remove">';
      $term_html = $term_html . '<span class="pt-term-text">' . $term->name . '</span>';
      $term_html = $term_html . '<span class="pt-term-action-remove">x</span>'; 
      $term_html = $term_html . '</div>';
      $html = $html . $term_html;
    }
    drupal_add_js(array('terms' => $terms), 'setting');
  }

  return $html;
}

function delete_cstag_callback($patient_node, $tid) {
  $cs_node = node_load($patient_node->field_patient_clinicalsummary['und'][0]['nid']);
  remove_from_array($cs_node, 'field_cs_tags', 'tid', $tid, TRUE);
  if (property_exists($cs_node, 'field_skeletome_tags')) {
    remove_from_array($cs_node, 'field_skeletome_tags', 'tid', $tid, TRUE);
  }

  exit;
}

function delete_cs_callback($node) {
  $cs_nid = $node->field_patient_clinicalsummary['und'][0]['nid'];
  $node->field_patient_clinicalsummary = array();
  node_delete($cs_nid);

  drupal_goto('node/' . $node->nid . '/clinical-summary');
}