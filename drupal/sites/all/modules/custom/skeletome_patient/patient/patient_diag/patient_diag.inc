<?php

function patient_diagnosis_callback($node) {
  $form_state['build_info']['args'] = array($node);
  return drupal_build_form('patient_diagnosis_form', $form_state);
}

function patient_diagnosis_form($node, &$form_state) {
  $node = $form_state['build_info']['args'][0];

  drupal_add_library('system', 'ui.core');
  drupal_add_library('system', 'ui.button');
  drupal_add_library('system', 'ui.dialog');
  drupal_add_library('system', 'ui.widget');
  drupal_add_library('system', 'ui.position');
  drupal_add_library('system', 'ui.size');
  drupal_add_library('system', 'ui.autocomplete');
  drupal_add_js(array('patientNodeId' => $node->nid), 'setting');
  drupal_add_css(drupal_get_path('module', 'patient') . '/patient_diag/patient_diag.css', array('group' => CSS_DEFAULT));
  drupal_add_js(drupal_get_path('module', 'patient') .'/patient_diag/patient_diag.js', array('group' => JS_DEFAULT));
  drupal_add_js(drupal_get_path('module', 'patient') .'/patient_ci/jquery.jeditable.min.js', array('group' => JS_DEFAULT));

  if (array_key_exists('und', $node->field_patient_diagnosis)) {
    drupal_add_js(array('noDiags' => count($node->field_patient_diagnosis['und'])), 'setting');
    $diags = array();
    foreach ($node->field_patient_diagnosis['und'] as $diag) {
      $diags[] = $diag['nid'];
    }
    drupal_add_js(array('diagNids' => $diags), 'setting');
  } else {
    drupal_add_js(array('noDiags' => 0), 'setting');
    drupal_add_js(array('diagNids' => array()), 'setting');
  }

  $html_buttons = '<div style="text-align:right;"><a id="add_button" href="javascript:void(0)">Add diagnosis</a></div><hr style="border:dashed #CCCCCC; border-width:1px 0 0; height:0;" />';
  $html_buttons = $html_buttons . '<div id="add_diagnosis_dialog" title="Add diagnosis"><form>
		    <div class="ui-widget"><div style="float:left;"><label for="patient_diag">Bone dysplasia: </label></div><div style="float:right;"><input id="patient_diag" /></div></div>
		    </form></div>';
  $html_buttons = $html_buttons . '<div id="dialog-confirm" title="Delete diagnosis?">
	<span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span>This diagnosis will be permanently deleted. Are you sure?</div>';

  $to_return = FALSE;
  if (is_current_user_owner($node)) {
    $form['buttons'] = array(
      '#markup' => $html_buttons,
      '#weight' => 1
    );

    $to_return = TRUE;
  }

  if (array_key_exists('und', $node->field_patient_diagnosis)) {
    $to_return = TRUE;
    if (is_current_user_owner($node)) {
      $diags_body = views_embed_view('patient_diagnosis', 'patient_diagnosis_block', $node->nid);
    } else {
      $diags_body = views_embed_view('patient_diagnosis_ro', 'patient_diagnosis_block', $node->nid);
    }

    $form['diagnoses'] = array(
      '#markup' => '<div class="block-title"><h2 class="title">Diagnoses</h2></div>' . $diags_body,
      '#weight' => 2
    );
  }

  if ($to_return) {
    return $form;
  }
}

function add_diagnosis_callback($patient, $diagnosis) {
  $bdTid = $_POST['bdTid'];
  if ($bdTid !== '-1') {
    if (array_key_exists('und', $patient->field_patient_diagnosis)) {
      $found = FALSE;
      foreach ($patient->field_patient_diagnosis['und'] as $diag) {
	$diag_node = node_load($diag['nid']);
	if ($diag_node->field_diagnosis_bd['und'][0]['tid'] === $bdTid) {
	  $found = TRUE;
	  break;
	}
      }

      if (!$found) {
	$count = count($patient->field_patient_diagnosis['und']);
	$diagnosis_nid = create_diagnosis($bdTid, $patient);
	$patient->field_patient_diagnosis['und'][$count]['nid'] = $diagnosis_nid;
	node_save($patient);
      }
    } else {
      $diagnosis_nid = create_diagnosis($bdTid, $patient);
      $patient->field_patient_diagnosis['und'][0]['nid'] = $diagnosis_nid;
      node_save($patient);
    }
  }
  exit;
}

function delete_diagnosis_callback($patient, $diagnosis) {
  $diag_node = node_load($diagnosis);
  if (array_key_exists('und', $diag_node->field_diagnosis_diagcomment)) {
    node_delete($diag_node->field_diagnosis_diagcomment['und'][0]['nid']);
  }
  node_delete($diagnosis);
  exit;
}

function set_comment_callback($patient_node) {
  global $user;
  $diag_nid = $_POST['diagNid'];
  $comment = $_POST['comment'];

  $diag_node = node_load($diag_nid);
  if (array_key_exists('und', $diag_node->field_diagnosis_diagcomment)) {
    $diag_comment_node = node_load($diag_node->field_diagnosis_diagcomment['und'][0]['nid']);
    $diag_comment_node->body['und'][0]['value'] = $comment;
    node_save($diag_comment_node);
  } else {
    $diag_comment_node = new stdClass();
    $diag_comment_node->type = 'diagnosis_comment';
    $diag_comment_node->language = 'und';
    $diag_comment_node->uid = $user->uid;
    
    $diag_comment_node->title = 'Diagnosis comment';
    $diag_comment_node->field_diagnosiscomment_diagnosis['und'][0]['nid'] = $diag_nid;

    $diag_comment_node->body['und'][0]['value'] = $comment;
    node_save($diag_comment_node);

    $diag_node->field_diagnosis_diagcomment['und'][0]['nid'] = $diag_comment_node->nid;
    node_save($diag_node);
  }

  exit;
}

function create_diagnosis($bdTid, $patient_node) {
  global $user;

  $diagnosis_node = new stdClass();
  $diagnosis_node->type = 'diagnosis';
  $diagnosis_node->language = 'und';
  $diagnosis_node->uid = $user->uid;

  $bd_term = taxonomy_term_load($bdTid);
  $diagnosis_node->title = $bd_term->name;
  $diagnosis_node->field_diagnosis_bd['und'][0]['tid'] = $bdTid;

  $date = new DateObject();
  $diagnosis_node->field_diagnosis_date['und'][0]['value'] = $date->format(DATE_FORMAT_ISO);
  $diagnosis_node->field_diagnosis_date['und'][0]['value2'] = $date->format(DATE_FORMAT_ISO);

  $diagnosis_node->field_diagnosis_patient['und'][0]['nid'] = $patient_node->nid;

  trasfer_group_membership($patient_node, $diagnosis_node);
  node_save($diagnosis_node);

  return $diagnosis_node->nid;
}
