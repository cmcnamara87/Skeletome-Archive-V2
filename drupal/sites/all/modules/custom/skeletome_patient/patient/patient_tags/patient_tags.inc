<?php

function add_custom_tag_callback() {
  $tagText = NULL;
  $tagTid = $_POST['tagTid'];
  if ($tagTid === '-1') {
    $tagText = $_POST['tagText'];
    exit;
//    $tagTid = create_custom_tag($tagText);
  }
  $patient_nid = $_POST['patientNid'];

  $patient_node = node_load($patient_nid);
  if (array_key_exists('und', $patient_node->field_patient_customtags)) {
    $found = FALSE;
    foreach($patient_node->field_patient_customtags['und'] as $custom_tag) {
      if ($custom_tag['tid'] == $tagTid) {
	$found = TRUE;
	break;
      }
    }
    if (!$found) {
      $count = count($patient_node->field_patient_customtags['und']);
      $patient_node->field_patient_customtags['und'][$count]['tid'] = $tagTid;
      node_save($patient_node);
    }
  } else {
    $patient_node->field_patient_customtags['und'][0]['tid'] = $tagTid;
    node_save($patient_node);
  }

  exit;
}

function delete_custom_tag_callback($patient_nid, $tag_tid) {
  $patient_node = node_load($patient_nid);
  remove_from_array($patient_node, 'field_patient_customtags', 'tid', $tag_tid, TRUE);
  exit;
}

function create_tags_html($patient_node) {
  $base_path = url(NULL, array('absolute' => TRUE));
  $terms = array();

  $html = '<div class="block-title"><h2 class="title">Tags</h2></div>';
  if (array_key_exists('und', $patient_node->field_patient_customtags)) {
    $html = $html . '<div class="pt-term-list">';
    foreach($patient_node->field_patient_customtags['und'] as $custom_tag) {
      $term = taxonomy_term_load($custom_tag['tid']);
      $terms[$term->name] = $term->tid;

      $term_html = '<div class="pt-term pt-term-remove">';
      $term_html = $term_html . '<span class="pt-term-text">' . $term->name . '</span>'; 
      $term_html = $term_html . '<span class="pt-term-action-remove">x</span>'; 
      $term_html = $term_html . '</div>';
      $html = $html . $term_html;
    }
    drupal_add_js(array('terms' => $terms), 'setting');
    $html = $html . '</div><hr style="border:dashed #CCCCCC; border-width:1px 0 0; height:0;" />';
  } else {
    $html = $html . '<i>No tags have been added to this patient.</i><hr style="border:dashed #CCCCCC; border-width:1px 0 0; height:0;" />';
  }

  return $html;
}
