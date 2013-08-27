<?php

function patient_genrep_callback($node) {
  $form_state['build_info']['args'] = array($node);
  return drupal_build_form('patient_genrep_form', $form_state);
}

function patient_genrep_form($node, &$form_state) {
  $node = $form_state['build_info']['args'][0];

  drupal_add_library('system', 'ui.button');
  drupal_add_library('system', 'ui.dialog');
  drupal_add_js(array('patientNodeId' => $node->nid), 'setting');
  drupal_add_js(drupal_get_path('module', 'patient') .'/patient_genrep/patient_genrep.js', array('group' => JS_DEFAULT));

  if (array_key_exists('und', $node->field_patient_genrep)) {
    drupal_add_js(array('noGmReps' => count($node->field_patient_genrep['und'])), 'setting');
    $genreps = array();
    $genrepGms = array();
    foreach ($node->field_patient_genrep['und'] as $genrep) {
      $genreps[] = $genrep['nid'];
      $genrepGms[] = get_gm_nids($genrep['nid']);
    }
    drupal_add_js(array('genrepNids' => $genreps), 'setting');
    drupal_add_js(array('genrepGms' => $genrepGms), 'setting');
  } else {
    drupal_add_js(array('noGmReps' => 0), 'setting');
    drupal_add_js(array('genrepNids' => array()), 'setting');
    drupal_add_js(array('genrepGms' => array()), 'setting');
  }

  $confirm_html = '<div id="dialog-confirm" title="Delete report?">
	<span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span>This report and associated gene mutations will be permanently deleted. Are you sure?</div><div id="dialog-confirm-gm" title="Delete mutation?">
	<span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span>This gene mutation will be permanently deleted. Are you sure?</div>';
  $form['confirm_dialog'] = array(
    '#markup' => $confirm_html,
    '#weight' => 99999
  );

  if (is_current_user_owner($node)) {
    $form['add_button'] = array(
      '#markup' => '<div style="text-align:right;"><a id="add_button" href="#">Add genetic report</a></div><hr style="border:dashed #CCCCCC; border-width:1px 0 0; height:0;" />',
      '#weight' => 1
    );
  }

  if (array_key_exists('und', $node->field_patient_genrep)) {
    $count = 0;

    foreach ($node->field_patient_genrep['und'] as $genrep) {
      $genrep_node = node_load($genrep['nid']);

      $date_html = date_format_date(new DateObject($genrep_node->field_genrep_date['und'][0]['value']), 'custom', 'd/m/Y');
      $title = $genrep_node->title . ' (' . $date_html . ')';

      $form['genrep_title_' . (string)$genrep_node->nid] = array(
	'#markup' => '<div class="block-title"><h2 class="title">' . $title . '</h2></div>',
	'#weight' => ((7 * $count) + 2)
      );
      
      if (is_current_user_owner($node)) {
	$form['genrep_add_' . (string)$genrep_node->nid] = array(
	  '#markup' => '<div style="text-align:right;"><a id="genrep_add_' . (string)$genrep_node->nid . '" href="#">Add gene mutation</a>',
	  '#weight' => ((7 * $count) + 3)
	);

	$form['genrep_edit_' . (string)$genrep_node->nid] = array(
	  '#markup' => '<a id="genrep_edit_' . (string)$genrep_node->nid . '" href="#">Edit report</a>',
	  '#weight' => ((7 * $count) + 4)
	);

	$form['genrep_delete_' . (string)$genrep_node->nid] = array(
	  '#markup' => '<a id="genrep_delete_' . (string)$genrep_node->nid . '" href="#">Delete report</a></div>',
	  '#weight' => ((7 * $count) + 5)
	);
      }

      if (array_key_exists('und', $genrep_node->field_genrep_gm)) {
	if (is_current_user_owner($node)) {
	  $genrep_body = views_embed_view('genetic_report_gene_mutations', 'genrep_gm_block', $genrep_node->nid);
	} else {
	  $genrep_body = views_embed_view('genetic_report_gene_mutations_ro', 'genrep_gm_block', $genrep_node->nid);
	}
	$form['genrep_' . (string)$count] = array(
	  '#markup' => '<hr style="border:dashed #CCCCCC; border-width:1px 0 0; height:0;" /><h3><u>Gene mutations</u></h3>' . $genrep_body,
	  '#weight' => ((7 * $count) + 6)
	);
      } else {
	$form['genrep_' . (string)$count] = array(
	  '#markup' => '<hr style="border:dashed #CCCCCC; border-width:1px 0 0; height:0;" /><i>This report currently contains no gene mutations.</i>',
	  '#weight' => ((7 * $count) + 6)
	);
      }


      $form['genrep_hr_' . (string)$count] = array(
	'#markup' => '<hr style="border:dashed #CCCCCC; border-width:1px 0 0; height:0;" />',
	'#weight' => ((7 * $count) + 7)
      );


      $count++;
    }
  }

  return $form;
}

function delete_genrep_callback($genrep_nid) {
  node_delete($genrep_nid);
  exit;
}

function delete_gm_callback($gm_nid) {
  node_delete($gm_nid);
  exit;
}

function get_gm_nids($genrep_nid) {
  $genrep_node = node_load($genrep_nid);
  $gm_nids = array();
  
  if (array_key_exists('und', $genrep_node->field_genrep_gm)) {
    foreach ($genrep_node->field_genrep_gm['und'] as $gm) {
      $gm_nids[] = $gm['nid'];
    }
  }

  return $gm_nids;
}
