<?php

function patient_xray_callback($node) {
  $form_state['build_info']['args'] = array($node);
  return drupal_build_form('patient_xray_form', $form_state);
}

function patient_xray_form($node, &$form_state) {
  $node = $form_state['build_info']['args'][0];

  drupal_add_library('system', 'ui.button');
  drupal_add_library('system', 'ui.dialog');
  drupal_add_js(array('patientNodeId' => $node->nid), 'setting');
  drupal_add_js(drupal_get_path('module', 'patient') .'/patient_xray/patient_xray.js', array('group' => JS_DEFAULT));

  if (array_key_exists('und', $node->field_patient_xrayreport)) {
    drupal_add_js(array('noXRays' => count($node->field_patient_xrayreport['und'])), 'setting');
    $xrays = array();
    foreach ($node->field_patient_xrayreport['und'] as $xray) {
      $xrays[] = $xray['nid'];
    }
    drupal_add_js(array('xRayNids' => $xrays), 'setting');
  } else {
    drupal_add_js(array('noXRays' => 0), 'setting');
    drupal_add_js(array('xRayNids' => array()), 'setting');
  }

  $confirm_html = '<div id="dialog-confirm" title="Delete report?">
	<span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span>This report and associated X-Rays will be permanently deleted. Are you sure?</div>';
  $form['confirm_dialog'] = array(
    '#markup' => $confirm_html,
    '#weight' => 99999
  );

  if (is_current_user_owner($node)) {
    $form['add_button'] = array(
      '#markup' => '<div style="text-align:right;"><a id="add_button" href="#">Add X-Ray report</a></div><hr style="border:dashed #CCCCCC; border-width:1px 0 0; height:0;" />',
      '#weight' => 1
    );
  }

  if (array_key_exists('und', $node->field_patient_xrayreport)) {
    $count = 0;

    foreach ($node->field_patient_xrayreport['und'] as $xray) {
      $xray_report_node = node_load($xray['nid']);
      
      $xray_body = '';
      $description = '';

      if (array_key_exists('und', $xray_report_node->media_gallery_media)) {
	$xray_body = drupal_render(node_view($xray_report_node, 'media_gallery_block'));
      }
      if (array_key_exists('und', $xray_report_node->media_gallery_description)) {
	$description = $xray_report_node->media_gallery_description['und'][0]['value'];
      }

      $date_html = date_format_date(new DateObject($xray_report_node->media_gallery_date['und'][0]['value']), 'custom', 'd/m/Y');
      $title = $xray_report_node->title . ' (' . $date_html . ')';

      $form['xray_title_' . (string)$count] = array(
	'#markup' => '<div class="block-title"><h2 class="title">' . $title . '</h2></div>',
	'#weight' => ((5 * $count) + 2)
      );

      if (is_current_user_owner($node)) {
	$form['xray_goto_' . (string)$xray_report_node->nid] = array(
	  '#markup' => '<div style="text-align:right;"><a id="xray_goto_' . (string)$xray_report_node->nid . '" href="#">Manage report</a>',
	  '#weight' => ((5 * $count) + 3)
	);

	$form['xray_delete_' . (string)$xray_report_node->nid] = array(
	  '#markup' => '<a id="xray_delete_' . (string)$xray_report_node->nid . '" href="#">Delete report</a></div>',
	  '#weight' => ((5 * $count) + 4)
	);
      }

      $xray_body = remove_contextual_links($xray_body);

//      debug($xray_body);

      $content = '';
      if (($description !== '') && ($xray_body !== '')) {
	$content = $content . '<strong>Description: </strong>' . $description;
	$content = $content . '<h3><u>X-Rays</u></h3>';
	$content = $content . $xray_body;
	$content = $content . '<hr style="border:dashed #CCCCCC; border-width:1px 0 0; height:0;" />';
      } else {
	if ($description !== '') {
	  $content = '<hr style="border:dashed #CCCCCC; border-width:1px 0 0; height:0;" />';
	  $content = $content . '<strong>Description: </strong>' . $description;
	  $content = $content . '<h3><u>X-Rays</u></h3>';
	  $content = $content . '<i>This report contains no X-Rays.</i>';
	  $content = $content . '<hr style="border:dashed #CCCCCC; border-width:1px 0 0; height:0;" />';
	}
	if ($xray_body !== '') {
	  $content = '<hr style="border:dashed #CCCCCC; border-width:1px 0 0; height:0;" />';
	  $content = $content . '<h3><u>X-Rays</u></h3>';
	  $content = $content . $xray_body;
	  $content = $content . '<hr style="border:dashed #CCCCCC; border-width:1px 0 0; height:0;" />';
	}
      }

      if (($description === '') && ($xray_body === '')) {
	  $content = $content . '<i>This report currently contains no X-Rays.</i>';
	  $content = $content . '<hr style="border:dashed #CCCCCC; border-width:1px 0 0; height:0;" />';
      }
      $form['xray_content_' . (string)$count] = array(
	'#markup' => $content,
	'#weight' => ((5 * $count) + 5),
      );

      $count++;
    }

  }

  return $form;
}

function remove_contextual_links($xray_body) {
  if ($xray_body !== '') {
    $new_body = '';
    $tmp = $xray_body;
    $idx = strpos($tmp, '<div class="contextual-links-wrapper">');
    if ($idx !== FALSE) {
      $new_body = substr($tmp, 0, $idx);
      $tmp = substr($tmp, $idx);
      $idx = strpos($tmp, '</div>');
      $new_body = $new_body . substr($tmp, $idx + 6);
      return $new_body;
    }
  }

  return $xray_body;
}

function delete_xray_callback($xray_nid) {
  node_delete($xray_nid);
  exit;
}

function delete_xraytag_callback($xraycoll_nid, $xray_nid, $tid) {
  $file = file_load($xray_nid);

  $to_keep = array();
  $und_array = $file->field_tags;

  foreach ($und_array['und'] as $item) {
    if ($item['tid'] != $tid) {
      $to_keep[] = $item;
    }
  }

  $und_array['und'] = $to_keep;
  $file->field_tags = $und_array;
  file_save($file);
  $title = '';
  if (array_key_exists('und', $file->media_title)) {
    $title = $file->media_title['und'][0]['value'];
  }
  $description = '';
  if (array_key_exists('und', $file->media_description)) {
    $description = $file->media_description['und'][0]['value'];
  }

  update_correponding_xray($xray_nid, $title, $to_keep, $description);
  exit;
}