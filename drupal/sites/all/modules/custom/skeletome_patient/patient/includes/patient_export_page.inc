<?php

require('patient_export.inc');

function export_patient($patient_nid) {
  variable_set('4545nndfkj32435jb', $patient_nid);
  return drupal_get_form('export_patient_form');
}

function export_patient_form() {
  $export_test_form = array();

  $options = array();
  $options[0] = t('Export personal data');
  $options[1] = t('Export clinical information');
  $options[2] = t('Export X-Rays');
  $options[3] = t('Export genetic reports');

  $export_test_form['export-options'] = array(
    '#type' => 'checkboxes',
    '#title' => 'Export options',
    '#description' => t('Please specify what type of data should be included in the report.'),
    '#default_value' => array(0, 1, 2, 3),
    '#options' => $options,
  );

  $export_test_form['submit'] = array(
    '#type' => 'submit',
    '#value' => 'Submit',
  );

  return $export_test_form;
}

function export_patient_form_validate($form, &$form_state) {
  $input = $form_state['input']['export-options'];
  $options = array();
  foreach ($input as $element => $value) {
    if ($value != NULL) {
      $options[] = $element;
    }
  }
  if (count($options) == 0) {
    drupal_set_message('Please select at least one of the export options.', 'error');
  }
}

function export_patient_form_submit($form, &$form_state) {
  $patient_nid = variable_get('4545nndfkj32435jb');
  variable_set('4545nndfkj32435jb', '');
  $input = $form_state['input']['export-options'];
  $options = array();
  foreach ($input as $element => $value) {
    if ($value != NULL) {
      $options[] = $element;
    }
  }

  if (count($options) > 0) {
    $export_sesitive = FALSE;
    $export_xray = FALSE;
    $export_genrep = FALSE;
    $export_cs = FALSE;

    foreach ($options as $option) {
      if ($option == 0) {
	$export_sesitive = TRUE;
      }
      if ($option == 1) {
	$export_cs = TRUE;
      }
      if ($option == 2) {
	$export_xray = TRUE;
      }
      if ($option == 3) {
	$export_genrep = TRUE;
      }
    }
    export_case($patient_nid, $export_sesitive, $export_xray, $export_genrep, $export_cs);
    drupal_goto('node/' . $patient_nid);
  }
}
