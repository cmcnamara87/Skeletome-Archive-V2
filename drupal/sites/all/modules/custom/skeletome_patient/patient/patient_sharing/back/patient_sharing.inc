<?php

function patient_sharing_callback($node) {
  $form_state['build_info']['args'] = array($node);
  return drupal_build_form('patient_sharing_form', $form_state);
}

function patient_sharing_form($node, &$form_state) {
  $base_path = url(NULL, array('absolute' => TRUE));
  $patient_node = $form_state['build_info']['args'][0];
/*
  drupal_add_library('system', 'ui.core');
  drupal_add_library('system', 'ui.dialog');
  drupal_add_library('system', 'ui.widget');
  drupal_add_library('system', 'ui.position');
  drupal_add_library('system', 'ui.size');
  drupal_add_library('system', 'ui.autocomplete');
  drupal_add_library('system', 'ui.selectable');
*/

  drupal_add_library('system', 'ui.button');
  drupal_add_library('system', 'ui.widget');
  drupal_add_library('system', 'ui.position');

  drupal_add_css(drupal_get_path('module', 'patient') . '/patient_sharing/patient_sharing.css', array('group' => CSS_DEFAULT));
  drupal_add_css(drupal_get_path('module', 'patient') . '/patient_sharing/jquery.multiselect.css', array('group' => CSS_DEFAULT));
  drupal_add_js(drupal_get_path('module', 'patient') .'/patient_sharing/jquery.multiselect.min.js', array('group' => JS_DEFAULT));
  drupal_add_js(drupal_get_path('module', 'patient') .'/patient_sharing/patient_sharing.js', array('group' => JS_DEFAULT));

  drupal_add_js(array('patientNid' => $patient_node->nid), 'setting');

  $html = '';
  if (is_current_user_owner($patient_node)) {
    $available_groups = get_available_groups_for_collaboration($patient_node, 'group_audience');
    if (!empty($available_groups)) {
      $available_groups_html = create_combohtml($available_groups, 'available_groups');
//    $sharing_options_html = 'Share with: ' . $available_groups_html . ' <a id="share_button" href="javascript:void(0)"><img src="' . $base_path . 'ra2.png" height="25" style="position: relative; top:7px;" /></a>';
      $sharing_options_html = 'Share with: ' . $available_groups_html . ' <a id="share_button" href="javascript:void(0)">Go</a>';

      $form['sharing_options'] = array(
	'#markup' => '<div class="block-title"><h2 class="title">Sharing options</h2></div>' . $sharing_options_html,
	'#weight' => 1
      );
    }

    $available_discussiongroups = get_available_groups_for_collaboration($patient_node, 'field_patient_discussiongroups');
    if (!empty($available_groups)) {
      $available_discussiongroups_html = create_combohtml($available_discussiongroups, 'available_discussiongroups');
      $discussion_options_html = '<br />';
      $discussion_options_html .= 'Discuss with: ' . $available_discussiongroups_html . ' <a id="discuss_button" href="javascript:void(0)">Go</a><hr style="border:dashed #CCCCCC; border-width:1px 0 0; height:0;" />';

      $form['discussion_options'] = array(
	'#markup' => $discussion_options_html,
	'#weight' => 2
      );
    }
    $sharing_info_html = create_sharing_html($patient_node);
    $form['sharing_info'] = array(
      '#markup' => '<br />' . $sharing_info_html,
      '#weight' => 3
    );

    return $form;
  }
}


function get_available_groups_for_collaboration($patient_node, $property) {
  global $user;

  $already_shared = array();
  if (array_key_exists('und', $patient_node->$property)) {
    foreach ($patient_node->$property['und'] as $group) {
      $already_shared[] = $group['gid'];
    }
  }

  $available_groups = array();
  $public_groups = get_public_groups();
  foreach ($public_groups as $group) {
    $gid = get_gid_for_group($group);
    if (!in_array($gid, $already_shared)) {
      $available_groups[$gid] = $group;
    }
  }

  $user_groups = get_groups_for_entity($user->uid, 'user');
  foreach ($user_groups as $group) {
    if (!array_key_exists($group, $available_groups)) {
      if (!in_array($group, $already_shared)) {
	$nid = get_nid_for_group($group);
	$available_groups[$group] = $nid;
      }
    }
  }

  return $available_groups;
}


function get_available_groups_for_sharing($patient_node) {
  global $user;

  $already_shared = array();
  if (array_key_exists('und', $patient_node->group_audience)) {
    foreach ($patient_node->group_audience['und'] as $group) {
      $already_shared[] = $group['gid'];
    }
  }

  $available_groups = array();
  $public_groups = get_public_groups();
  foreach ($public_groups as $group) {
    $gid = get_gid_for_group($group);
    if (!in_array($gid, $already_shared)) {
      $available_groups[$gid] = $group;
    }
  }

  $user_groups = get_groups_for_entity($user->uid, 'user');
  foreach ($user_groups as $group) {
    if (!array_key_exists($group, $available_groups)) {
      if (!in_array($group, $already_shared)) {
	$nid = get_nid_for_group($group);
	$available_groups[$group] = $nid;
      }
    }
  }

  return $available_groups;
}

function get_available_discussiongroups($patient_node) {
  global $user;

  $already_indiscussion = array();
  if (array_key_exists('und', $patient_node->field_patient_discussiongroups)) {
    foreach ($patient_node->field_patient_discussiongroups['und'] as $group) {
      $already_indiscussion[] = $group['gid'];
    }
  }

  $available_groups = array();
  $public_groups = get_public_groups();
  foreach ($public_groups as $group) {
    $gid = get_gid_for_group($group);
    if (!in_array($gid, $already_indiscussion)) {
      $available_groups[$gid] = $group;
    }
  }

  $user_groups = get_groups_for_entity($user->uid, 'user');
  foreach ($user_groups as $group) {
    if (!array_key_exists($group, $available_groups)) {
      if (!in_array($group, $already_indiscussion)) {
	$nid = get_nid_for_group($group);
	$available_groups[$group] = $nid;
      }
    }
  }

  return $available_groups;

}

function create_combohtml($group_list, $grouplist_id) {
  global $user;
  $user_groups = get_nids_for_groups(get_groups_for_entity($user->uid, 'user'));
  $user_member_available = array();
  $user_nonmember_available = array();
  foreach ($group_list as $group) {
    if (in_array($group, $user_groups)) {
      $user_member_available[] = $group;
    } else {
      $user_nonmember_available[] = $group;
    }
  }

  $html = '<select id="' . $grouplist_id . '" multiple="multiple">';
  if (!empty($user_member_available)) {
    $html .= '<optgroup label="Your groups">';
    foreach ($user_member_available as $group) {
      $group_node = node_load($group);
      $html .= '<option class="' . $group . '" value="' . $group . '">' . $group_node->title . '</option>';
    }
    $html .= '</optgroup>';
  }

  if (!empty($user_nonmember_available)) {
    $html .= '<optgroup label="Other groups">';
    foreach ($user_nonmember_available as $group) {
      $group_node = node_load($group);
      $html .= '<option class="' . $group . '" value="' . $group . '">' . $group_node->title . '</option>';
    }
    $html .= '</optgroup>';
  }
  
  $html .= '</select>';
  return $html;
}

function create_sharing_html($patient_node) {
  $base_path = url(NULL, array('absolute' => TRUE));
  $in_collaboration = FALSE;
  $html = '';

  $user_groups = get_groups_for_entity($patient_node->uid, 'user');

  $html = '<div class="block-title"><h2 class="title">Sharing information</h2></div>';
  if (array_key_exists('und', $patient_node->group_audience)) {
    $member_groups = array();
    $nonmember_groups = array();
    foreach($patient_node->group_audience['und'] as $group) {
      $group_nid = get_nid_for_group($group['gid']);
      $group_node = node_load($group_nid);

      if (in_array($group['gid'], $user_groups)) {
	$member_groups[$group['gid']] = $group_node;
      } else {
	$nonmember_groups[$group['gid']] = $group_node;
      }
    }

    if (!empty($member_groups) || !empty($nonmember_groups)) {
      $in_collaboration = TRUE;

      $html = $html . 'This patient is currently shared with the following groups:';
      $html = $html . '<ul>';

      if (!empty($member_groups)) {
	foreach($member_groups as $gid => $group) {
	  $url = $base_path . 'patient/delete-group/' . $patient_node->nid . '/' . $gid;
	  $html = $html . '<li><a href="' . $group->nid . '">' . $group->title . '</a> (member) <a href="' . $url . '"><img src="' . $base_path . 'delete.png" width="1%" /></a></li>';
	}
      }

      if (!empty($nonmember_groups)) {
	foreach($nonmember_groups as $gid => $group) {
	  $url = $base_path . 'patient/delete-group/' . $patient_node->nid . '/' . $gid;
	  $html = $html . '<li><a href="' . $group->nid . '">' . $group->title . '</a> <a href="' . $url . '"><img src="' . $base_path . 'delete.png" width="1%" /></a></li>';
	}
      }
      
      $html = $html . '</ul>';
    }
  } 

  if (array_key_exists('und', $patient_node->field_patient_discussiongroups)) {
  }

  if (!$in_collaboration) {
    $html = $html . '<i>This patient is not shared or under discussion with any groups.</i><hr style="border:dashed #CCCCCC; border-width:1px 0 0; height:0;" />';
  }

  return $html;
}

function create_grouplist_html($available_groups) {
  global $user;
  $user_groups = get_groups_for_entity($user->uid, 'user');

  $html = '<ol id="group_list">';
  $groups = array();

  foreach ($available_groups as $gid => $nid) {
    if (in_array($gid, $user_groups)) {
      $node = node_load($nid);
      $group_name = $node->title;
      if (strlen($group_name) > 40) {
	$group_name = substr($group_name, 0, 40) . ' ...';
      }

      $html .= '<li class="ui-widget-content">' . $group_name . '</li>';
      $groups[] = $nid;
    }
  }


/*
  foreach ($available_groups as $gid => $nid) {
    $node = node_load($nid);
    $group_name = $node->title;
    if (strlen($group_name) > 40) {
      $group_name = substr($group_name, 0, 40) . ' ...';
    }

    if (in_array($gid, $user_groups)) {
      $group_name .= ' (member)';
    }
    
    $html .= '<li class="ui-widget-content">' . $group_name . '</li>';
    $groups[] = $nid;
  }
*/
  $html .= '</ol>';
  drupal_add_js(array('groupNids' => $groups), 'setting');

  return $html;
}

function create_nonmember_grouplist_html($available_groups) {
  global $user;
  $user_groups = get_groups_for_entity($user->uid, 'user');

  $html = '<ol id="nonmember_group_list">';
  $groups = array();

  foreach ($available_groups as $gid => $nid) {
    if (!in_array($gid, $user_groups)) {
      $node = node_load($nid);
      $group_name = $node->title;
      if (strlen($group_name) > 40) {
	$group_name = substr($group_name, 0, 40) . ' ...';
      }

      $html .= '<li class="ui-widget-content">' . $group_name . '</li>';
      $groups[] = $nid;
    }
  }

  $html .= '</ol>';
  drupal_add_js(array('nonmemberGroupNids' => $groups), 'setting');

  return $html;
}

function share_withgroups_callback() {
  $now = getdate();
  $groupNids = $_POST['groupNids'];
  $patientNid = $_POST['patientNid'];

  $patient_node = node_load($patientNid);
  $count = 0;
  if (array_key_exists('und', $patient_node->group_audience)) {
    $count = count($patient_node->group_audience['und']);
  }

  foreach($groupNids as $group_nid) {
    $gid = get_gid_for_group($group_nid);
    $patient_node->group_audience['und'][$count]['gid'] = $gid;
    $patient_node->group_audience['und'][$count]['state'] = '1';
    $patient_node->group_audience['und'][$count]['created'] = $now[0];

    $count++;
  }
  
  node_save($patient_node);
  update_group_access($patient_node);

  exit;
}

function discuss_withgroups_callback() {
  $now = getdate();
  $groupNids = $_POST['groupNids'];
  $patientNid = $_POST['patientNid'];

  $patient_node = node_load($patientNid);
  $count = 0;
  if (array_key_exists('und', $patient_node->field_patient_discussiongroups)) {
    $count = count($patient_node->field_patient_discussiongroups['und']);
  }

  $shared_groups = array();
  $to_share_with = array();
  $shared_count = 0;
  if (array_key_exists('und', $patient_node->group_audience)) {
    $shared_count = count($patient_node->group_audience['und']);
    foreach($patient_node->group_audience['und'] as $group) {
      $group_nid = get_nid_for_group($group['gid']);
      $shared_groups[] = $group_nid;
    }
  }

  foreach($groupNids as $group_nid) {
    $patient_node->field_patient_discussiongroups['und'][$count]['nid'] = $group_nid;
    if (!in_array($group_nid, $shared_groups)) {
      $to_share_with[] = $group_nid;
    }
    $count++;
  }
  
  foreach($to_share_with as $group_nid) {
    $gid = get_gid_for_group($group_nid);
    $patient_node->group_audience['und'][$shared_count]['gid'] = $gid;
    $patient_node->group_audience['und'][$shared_count]['state'] = '1';
    $patient_node->group_audience['und'][$shared_count]['created'] = $now[0];

    $shared_count++;
  }

  // CREATE FORUM ENTRY

  node_save($patient_node);
  update_group_access($patient_node);

  exit;
}


function unshare_callback($patient_nid, $group_gid) {
  $patient_node = node_load($patient_nid);

  $index = -1;
  for($i = 0; $i < count($patient_node->group_audience['und']); $i++) {
    if ($patient_node->group_audience['und'][$i]['gid'] === $group_gid) {
      $index =$i;
    }
  }

  array_splice($patient_node->group_audience['und'], $index, 1);
  node_save($patient_node);

  update_group_access($patient_node);

  drupal_goto('node/' . $patient_node->nid);
}

function undiscuss_callback($patient_nid, $group_gid) {
}

function update_group_access($patient_node) {

  // Contact information
  $ci_nid = $patient_node->field_patient_ci['und'][0]['nid'];
  $ci_node = node_load($ci_nid);
  $ci_node->group_audience = $patient_node->group_audience;
  node_save($ci_node);

  // Clinical summary
  if (array_key_exists('und', $patient_node->field_patient_clinicalsummary)) {
    $cs_nid = $patient_node->field_patient_clinicalsummary['und'][0]['nid'];
    $cs_node = node_load($cs_nid);
    $cs_node->group_audience = $patient_node->group_audience;
    node_save($cs_node);
  }

  // X-Rays
  if (array_key_exists('und', $patient_node->field_patient_xrayreport)) {
    foreach ($patient_node->field_patient_xrayreport['und'] as $xray) {
      $xray_node = node_load($xray['nid']);
      $xray_node->group_audience = $patient_node->group_audience;
      node_save($xray_node);
      update_xrays_group_access($xray_node);
    }
  }

  // Genetic reports
  if (array_key_exists('und', $patient_node->field_patient_genrep)) {
    foreach ($patient_node->field_patient_genrep['und'] as $genrep) {
      $genrep_node = node_load($genrep['nid']);
      $genrep_node->group_audience = $patient_node->group_audience;
      node_save($genrep_node);
      update_genemutation_group_access($genrep_node);
    }
  }

  // Diagnoses
  if ($patient_node->field_patient_published['und'][0]['value'] === 'YES') {
    if (array_key_exists('und', $patient_node->field_patient_diagnosis)) {
      foreach ($patient_node->field_patient_diagnosis['und'] as $diag) {
	$diag_node = node_load($diag['nid']);
	$diag_node->group_audience = $patient_node->group_audience;
	node_save($diag_node);
      }
    
      $forum_entries = patient_has_forum($patient_node->nid);
      foreach($forum_entries as $forum_entry) {
	$forum_node = node_load($forum_entry);
	$forum_node->group_audience = $patient_node->group_audience;
	node_save($forum_node);
      }
    }
  }

}

function update_xrays_group_access($xray_node) {
  if (array_key_exists('und', $xray_node->media_gallery_media )) {
    foreach ($xray_node->media_gallery_media['und'] as $xray) {
      $xray_nid = find_xray_for_fid($xray['fid']);
      if ($xray_nid !== NULL) {
	$x_node = node_load($xray_nid);
	$x_node->group_audience = $xray_node->group_audience;

	if (array_key_exists('und', $x_node->field_xray_xraydescription)) {
	  foreach($x_node->field_xray_xraydescription['und'] as $desc) {	
	    $desc_node = node_load($desc['nid']);
	    $desc_node->group_audience = $x_node->group_audience;
	    node_save($desc_node);
	  }
	}

	node_save($x_node);
      }
    }
  }
}

function update_genemutation_group_access($genrep_node) {
  if (array_key_exists('und', $genrep_node->field_genrep_gm)) {
    foreach ($genrep_node->field_genrep_gm['und'] as $gm) {
      $gm_node = node_load($gm['nid']);
      $gm_node->group_audience = $genrep_node->group_audience;
      node_save($gm_node);
    }
  }
}

/*

  if (is_current_user_owner($node)) {
    $enable_diagnosis_groups = get_sharedgroups_enableddiagnosis($node);
    $disabled_groups = $enable_diagnosis_groups['disabled'];
    $enabled_groups = $enable_diagnosis_groups['enabled'];

    if (!empty($disabled_groups)) {
      // TODO: Create groups list

      $html_buttons = $html_buttons . '<a id="enable_button" href="javascript:void(0)">Enable diagnosis for sharing groups</a>';
    }

    if (!empty($enabled_groups)) {
      // TODO: Create groups list

      $html_buttons = $html_buttons . '<a id="disable_button" href="javascript:void(0)">Disable diagnosis for sharing groups</a>';
    }
  }


*/

function get_sharedgroups_enableddiagnosis($patient_node) {
  $disabled_groups = array();
  $enabled_groups = array();

  $node_gids = get_groups_for_entity($patient_node->nid, 'node');
  if (!empty($node_gids)) {
    global $user;
    $node_nids = get_nids_for_groups($node_gids);
    $user_group_gids = get_groups_for_entity($user->uid, 'user');
    $user_group_nids = get_nids_for_groups($user_group_gids);

    if (array_key_exists('und', $patient_node->field_patient_diagnosisenabled)) {
      foreach ($user_group_nids as $group_nid) {
	if (in_array($group_nid, $node_nids)) {
	  $found = FALSE;

	  foreach ($patient_node->field_patient_diagnosisenabled['und'] as $group) {
	    if ($group['nid'] === $group_nid) {
	      $found = TRUE;
	    }
	  }

	  if (!$found) {
	    $disabled_groups[] = $group_nid;
	  } else {
	    $enabled_groups[] = $group_nid;
	  }
	}
      }

    } else {
      $disabled_groups = $node_nids;
    }
  }

  $groups['enabled'] = $enabled_groups;
  $groups['disabled'] = $disabled_groups;

  return $groups;
}

function enable_diagnosis_callback($patient_node) {
  $patient_node->field_patient_published['und'][0]['value'] = 'YES';

  $entries = patient_has_forum($patient_node->nid);
  if (empty($entries)) {
    $forum_nid = create_forum_entry($patient_node);
    $patient_node->field_patient_forum['und'][0]['nid'] = $forum_nid;
  } else {
    if (array_key_exists('und', $patient_node->group_audience)) {
      foreach($entries as $forum_entry) {
	$forum_node = node_load($forum_entry);
	$forum_node->group_audience['und'] = $patient_node->group_audience['und'];
	node_save($forum_node);
      }
    }
  }

  node_save($patient_node);

  if (array_key_exists('und', $patient_node->field_patient_diagnosis)) {
    if (array_key_exists('und', $patient_node->group_audience)) {
      foreach ($patient_node->field_patient_diagnosis['und'] as $diag) {
	$diag_node = node_load($diag['nid']);
	$diag_node->group_audience['und'] = $patient_node->group_audience['und'];
	node_save($diag_node);
      }
    }
  }

  exit;
}

function disable_diagnosis_callback($patient_node) {
  $patient_node->field_patient_published['und'][0]['value'] = 'NO';
  node_save($patient_node);

  if (array_key_exists('und', $patient_node->field_patient_diagnosis)) {
    foreach ($patient_node->field_patient_diagnosis['und'] as $diag) {
      $diag_node = node_load($diag['nid']);
      $diag_node->group_audience['und'] = array();
      node_save($diag_node);
    }
  }

  $entries = patient_has_forum($patient_node->nid);
  if (empty($entries)) {
    foreach($entries as $forum_entry) {
      $forum_node = node_load($forum_entry);
      $forum_node->group_audience['und'] = array();
      node_save($forum_node);
    }
  }

  exit;
}

function create_forum_entry($patient_node) {
  global $user;

  $forum_node = new stdClass();
  $forum_node->type = 'forum';
  $forum_node->language = 'und';
  $forum_node->uid = $user->uid;
  $forum_node->comment = '2';

  $forum_node->title = $patient_node->title;
  $forum_node->field_forum_patient['und'][0]['nid'] = $patient_node->nid;

  $fid = find_forum_with_name('Patient discussions');
  $forum_node->taxonomy_forums['und'][0]['tid'] = $fid;

  trasfer_group_membership($xray_node, $node);

  $forum_node->group_content_access['und'][0]['value'] = $patient_node->group_content_access['und'][0]['value']; 

  if (array_key_exists('und', $patient_node->group_audience)) {
    $group_audience = $patient_node->group_audience['und'];
    $count = 0;
    foreach ($group_audience as $ga) {
      $forum_node->group_audience['und'][$count]['gid'] = $ga['gid'];
      $forum_node->group_audience['und'][$count]['state'] = $ga['state'];
      $forum_node->group_audience['und'][$count]['created'] = $ga['created'];
      $count++;
    }
  }
  node_save($forum_node);

  return $forum_node->nid;
}


function patient_has_forum($patient_nid) {
  $entries = array();
  $sql = 'SELECT entity_id, field_patient_forum_nid FROM {field_data_field_patient_forum} f WHERE f.entity_id = :entity_id';
  $result = db_query($sql, array(':entity_id' => $patient_nid));
  foreach ($result as $row) {
    $entries[] = $row->field_patient_forum_nid;
  }

  return $entries;
}
