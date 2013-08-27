<?php

function create_owner_overview($node) {
  $html = '';
  drupal_add_library('system', 'ui.core');
  drupal_add_library('system', 'ui.button');
  drupal_add_library('system', 'ui.dialog');
  drupal_add_library('system', 'ui.widget');
  drupal_add_library('system', 'ui.position');
  drupal_add_library('system', 'ui.size');
  drupal_add_library('system', 'ui.autocomplete');
  drupal_add_library('system', 'ui.selectable');

  drupal_add_css(drupal_get_path('module', 'patient') . '/patient_tags/patient_tags.css', array('group' => CSS_DEFAULT));
  drupal_add_css(drupal_get_path('module', 'patient') . '/patient_overview/patient_overview.css', array('group' => CSS_DEFAULT));
  drupal_add_js(drupal_get_path('module', 'patient') .'/patient_tags/patient_tags.js', array('group' => JS_DEFAULT));
  drupal_add_js(drupal_get_path('module', 'patient') .'/patient_overview/patient_overview.js', array('group' => JS_DEFAULT));
    
  drupal_add_js(array('patientNid' => $node->nid), 'setting');

  $buttons = '<div style="text-align:right;"><a id="add_custom_tag_button" href="javascript:void(0)">Add Tag</a><a id="add_identifier_button" href="javascript:void(0)">Add Identifier</a><a id="delete_patient" href="javascript:void(0)">Delete patient</a></div><hr style="border:dashed #CCCCCC; border-width:1px 0 0; height:0;" />';

  $add_identifier_dialog = '<div id="add_identifier_dialog" title="Add identifier"><form>
      <div class="ui-widget"><div style="float:left;"><label for="identifier_input">Identifier: </label></div><div style="float:right;"><input id="identifier_input" /></div></div>
      </form></div>';

  $delete_patient_dialog = '<div id="delete_patient_dialog" title="Delete patient?">
	<span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span>This patient and all associated information will be permanently deleted. Are you sure?</div>';

  $add_tag_dialog = '<div id="add_custom_tag_dialog" title="Add tag"><form>
      <div class="ui-widget"><div style="float:left;"><label for="patient_tag">Tag: </label></div><div style="float:right;"><input id="patient_tag" /></div></div>
      </form></div>';

  $html .= $add_identifier_dialog . $delete_patient_dialog . $add_tag_dialog . $buttons;
  $html .= create_tags_html($node);
  $html .= create_identifiers_html($node);

  return $html;
}

function create_nonowner_overview($node) {
  $html = '';

  $html = '<div class="block-title"><h2 class="title">Case overview</h2></div>';

  $date_html = date_format_date(new DateObject($node->field_entry_date['und'][0]['value']), 'short');
  $html .= '<strong>Entry date: </strong>' . $date_html;

  $cs_html = '';
  if (array_key_exists('und', $node->field_patient_clinicalsummary)) {
    $cs_node = node_load($node->field_patient_clinicalsummary['und'][0]['nid']);
    if (array_key_exists('und', $cs_node->body)) {
      $cs_html = $cs_node->body['und'][0]['value'];
    } else {
      $cs_html = '<i>No clinical summary has yet been introduced.</i>';
    }
  } else {
    $cs_html = '<i>No clinical summary has yet been introduced.</i>';
  }
  $html .= '<br/><strong>Clinical summary: </strong>' . $cs_html;

  $xray_html = '';
  if (array_key_exists('und', $node->field_patient_xrayreport)) {
    $xray_html = count($node->field_patient_xrayreport['und']);
  } else {
    $xray_html = '0';
  }
  $html .= '<br/><strong>Number of X-Ray reports: </strong>' . $xray_html;

  $genrep_html = '';
  if (array_key_exists('und', $node->field_patient_genrep)) {
    $genrep_html = count($node->field_patient_genrep['und']);
  } else {
    $genrep_html = '0';
  }
  $html .= '<br/><strong>Number of genetic reports: </strong>' . $genrep_html;

  $diag_html = '';
  if (array_key_exists('und', $node->field_patient_diagnosis)) {
    $count = count($node->field_patient_diagnosis['und']);
    if ($count >1) {
      $diag_html = '<ul>';
      foreach($node->field_patient_diagnosis['und'] as $diag) {
	$diag_node = node_load($diag['nid']);
	$bd_diag = taxonomy_term_load($diag_node->field_diagnosis_bd['und'][0]['tid']);
	$diag_html .= '<li>' . $bd_diag->name . '</li>';
      }
      $diag_html = '</ul>';
    } else {
      $diag_node = node_load($node->field_patient_diagnosis['und'][0]['nid']);
      $bd_diag = taxonomy_term_load($diag_node->field_diagnosis_bd['und'][0]['tid']);
      $diag_html = $bd_diag->name;
    }
  } else {
    $diag_html = '<i>No diagnosis has yet been established.</i>';
  }
  $html .= '<br/><strong>Diagnosis: </strong>' . $diag_html;

  if (array_key_exists('und', $node->field_patient_discussiongroups)) {
    global $user;
    $user_groups = get_groups_for_entity($user->uid, 'user');
    $group_nids = get_nids_for_groups($user_groups);
    $discussion_groups = array();

    foreach ($node->field_patient_discussiongroups['und'] as $group) {
      if (in_array($group['nid'], $group_nids)) {
	$discussion_groups[] = $group['nid'];
      }
    }

    if (!empty($discussion_groups)) {
      $base_path = url(NULL, array('absolute' => TRUE));
      $forums_html = '';
      $patient_topics = get_entity_for_param('field_data_field_forum_patient', 'field_forum_patient_nid', $node->nid);
      $forum_nids = array();

      foreach($discussion_groups as $group_nid) {
	$forum_tid = get_entity_for_param('field_data_field_forum_group', 'field_forum_group_nid', $group_nid);
	$forum_topics = get_forumtopics_for_forum($forum_tid[0]);
	$intersect = array_intersect($forum_topics, $patient_topics);
	if (!empty($intersect)) {
	  foreach ($intersect as $id => $nid) {
	    $forum_nids[$group_nid] = $nid;
	  }
	}
      }

      if (count($forum_nids) == 1) {
	foreach ($forum_nids as $group_nid => $forum_nid) {
	  $group_node = node_load($group_nid);
	  $forum_node = node_load($forum_nid);
	  $forums_html .= '<a href="' . $base_path . 'node/' . $forum_nid . '">' . $forum_node->title . '</a> discussion in the ' . '<a href="' . $base_path . 'node/' . $group_nid . '">' . $group_node->title . '</a> forum';
	}
      } else {
	$forums_html .= '<ul>';
	
	foreach ($forum_nids as $group_nid => $forum_nid) {
	  $group_node = node_load($group_nid);
	  $forum_node = node_load($forum_nid);

	  $forums_html .= '<li>' . '<a href="' . $base_path . 'node/' . $forum_nid . '">' . $forum_node->title . '</a> discussion in the ' . '<a href="' . $base_path . 'node/' . $group_nid . '">' . $group_node->title . '</a> forum' . '</li>';
	}
  
	$forums_html .= '</ul>';
      }

      $html .= '<br/><strong>Forum discussions: </strong>' . $forums_html;
    }
  }

  $html .= '<hr style="border:dashed #CCCCCC; border-width:1px 0 0; height:0;" />';
  return $html;
}

function create_identifiers_html($patient_node) {
  $base_path = url(NULL, array('absolute' => TRUE));
  $terms = array();

  $html = '<div class="block-title"><h2 class="title">Identifiers</h2></div>';

  if (array_key_exists('und', $patient_node->field_patient_identifier)) {
    $html .= 'This patient has the current identifiers attached:';
    $html .= '<ul>';

    $idx = 0;
    foreach($patient_node->field_patient_identifier['und'] as $identifier) {
      $url = $base_path . 'patient/delete-identifier/' . $patient_node->nid . '/' . $idx;
      $html .= '<li>' . $identifier['value'] . ' <a href="' . $url . '"><img src="' . $base_path . 'delete.png" width="1%" /></a></li>';

      $idx++;
    }

    $html .= '</ul>';
    $html .= '<hr style="border:dashed #CCCCCC; border-width:1px 0 0; height:0;" />';
  } else {
    $html = $html . '<i>No identifiers have been added to this patient.</i><hr style="border:dashed #CCCCCC; border-width:1px 0 0; height:0;" />';
  }

  return $html;
}

function add_identifier_callback($patient_nid) {
  $idText = $_POST['identifier'];
  $patient_node = node_load($patient_nid);

  $count = 0;
  if (array_key_exists('und', $patient_node->field_patient_identifier)) {
    $count = count($patient_node->field_patient_identifier['und']);
  }
  
  $patient_node->field_patient_identifier['und'][$count]['value'] = $idText;
  $patient_node->field_patient_identifier['und'][$count]['safe_value'] = $idText;

  node_save($patient_node);

  exit;
}

function delete_identifier_callback($patient_nid, $id_idx) {
  $patient_node = node_load($patient_nid);

  array_splice($patient_node->field_patient_identifier['und'], $id_idx, 1);
  node_save($patient_node);
  drupal_goto('node/' . $patient_node->nid);
}


