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

  drupal_add_js(drupal_get_path('module', 'patient') .'/patient_ci/jquery.jeditable.min.js', array('group' => JS_DEFAULT));

  drupal_add_js(array('patientNid' => $patient_node->nid), 'setting');

  $html = '';
  $exists = FALSE;
  $available_groups = get_available_groups_for_collaboration($patient_node, 'group_audience', 'gid');
  if (!empty($available_groups)) {
    $exists = TRUE;
    $available_groups_html = create_combohtml($available_groups, 'available_groups');
//    $sharing_options_html = 'Share with: ' . $available_groups_html . ' <a id="share_button" href="javascript:void(0)"><img src="' . $base_path . 'ra2.png" height="25" style="position: relative; top:7px;" /></a>';
    $sharing_options_html = 'Share with: ' . $available_groups_html . ' <a id="share_button" href="javascript:void(0)">Go</a>';
    $html .= $sharing_options_html;
/*
    $form['sharing_options'] = array(
      '#markup' => '<div class="block-title"><h2 class="title">Sharing options</h2></div>' . $sharing_options_html,
      '#weight' => 1
    );
*/
  }

  $available_discussiongroups = get_available_groups_for_collaboration($patient_node, 'field_patient_discussiongroups', 'nid');
  if (!empty($available_discussiongroups)) {
    $exists = TRUE;
    $available_discussiongroups_html = create_combohtml($available_discussiongroups, 'available_discussiongroups');
    $discussion_options_html = '<br />';
    $discussion_options_html .= 'Discuss with: ' . $available_discussiongroups_html . ' <a id="discuss_button" href="javascript:void(0)">Go</a><hr style="border:dashed #CCCCCC; border-width:1px 0 0; height:0;" />';
    $html .= $discussion_options_html;
/*
    $form['discussion_options'] = array(
      '#markup' => $discussion_options_html,
      '#weight' => 2
    );
*/
  }

  if ($exists) {
    $form['sharing_options'] = array(
      '#markup' => '<div class="block-title"><h2 class="title">Sharing options</h2></div>' . $html,
      '#weight' => 1
    );
  }


  $sharing_info_html = create_sharing_html($patient_node);
  $form['sharing_info'] = array(
    '#markup' => '<br />' . $sharing_info_html,
    '#weight' => 2
  );

  if (array_key_exists('und', $patient_node->field_patient_forum)) {
    $html = create_forum_list($patient_node);

    $form['forum_entries'] = array(
      '#markup' => '<div class="block-title"><h2 class="title">Forum entries</h2></div>' . $html,
      '#weight' => 3
    );
  }

  return $form;
}

function create_forum_list($patient_node) {
  global $user;
  $user_groups = get_groups_for_entity($user->uid, 'user');
  $forum_nids = array();

  $html = '';

  $html .= '<div class="view-content"><table class="views-table cols-3" ><thead><tr>';
  $html .= '<th class="views-field views-field-forum-entry" width="20%">Forum entry</th>';
  $html .= '<th class="views-field views-field-group" width="30%">Group</th>';
  $html .= '<th class="views-field views-field-forum-summary" >Summary</th>';
  $html .= '</tr></thead>';
  $html .= '<tbody>';

  $count = 1;
  foreach($patient_node->field_patient_forum['und'] as $forum_nid) {
    $forum_nids[] = $forum_nid['nid'];
    $forum_node = node_load($forum_nid['nid']);
    $tid = $forum_node->taxonomy_forums['und'][0]['tid'];
    $group_nid = get_group_for_forum($tid);
    $group_gid = get_gid_for_group($group_nid);
    $group_node = node_load($group_nid);

    $row = '';

    if ($count == 1) {
      if (count($patient_node->field_patient_forum['und']) > 1) {
	$row .= '<tr class="odd views-row-first">';
      } else {
	$row .= '<tr class="odd views-row-first views-row-last">';
      }
    } else {
      $mod = $count % 2;

      if ($mod == 1) {
	if ($count == count($patient_node->field_patient_forum['und']) - 1) {
	  $row .= '<tr class="odd views-row-last">';
	} else {
	  $row .= '<tr class="odd">';
	}
      } else {
	if ($count == count($patient_node->field_patient_forum['und']) - 1) {
	  $row .= '<tr class="even views-row-last">';
	} else {
	  $row .= '<tr class="even">';
	}
      }
    }

    if (in_array($group_gid, $user_groups)) {
      $row .= '<td class="views-field views-field-forum-entry" ><a href="/skelarch/node/' . $forum_nid['nid'] . '">' . $forum_node->title . '</a></td>';
    } else {
      if (array_key_exists('und', $forum_node->field_forum_useraudience)) {
	if ($forum_node->field_forum_useraudience['und'][0]['uid'] == $user->uid) {
	  $row .= '<td class="views-field views-field-forum-entry" ><a href="/skelarch/node/' . $forum_nid['nid'] . '">' . $forum_node->title . '</a></td>';
	} else {
	  $row .= '<td class="views-field views-field-forum-entry" ><i>The forum moderator has limited the access to the discussion.</i></td>';
	}
      } else {
	$row .= '<td class="views-field views-field-forum-entry" ><i>The forum moderator has limited the access to the discussion.</i></td>';
      }
    }
    $row .= '<td class="views-field views-field-group" ><a href="/skelarch/node/' . $group_nid . '">' . $group_node->title . '</a></td>';

    $forum_summary_nid = get_forumsummary($forum_nid['nid'], $patient_node->nid);
    if ($forum_summary_nid === NULL) {
      $row .= '<td class="views-field views-field-forum-summary" ><span class="edit" id="forum_summary_' . $forum_nid['nid'] . '"><i>(Please click to add a summary)</i></span></td>';
    } else {
      $forum_summary_node = node_load($forum_summary_nid);
      $row .= '<td class="views-field views-field-forum-summary" ><span class="edit" id="forum_summary_' . $forum_nid['nid'] . '">' . $forum_summary_node->body['und'][0]['value'] . '</span></td>';
    }
    $row .= '</tr>';

    $html .= $row;
    $count++;
  }

  $html .= '</tbody></table></div>';

  drupal_add_js(array('forumNids' => $forum_nids), 'setting');

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
	  $url = $base_path . 'patient/unshare/' . $patient_node->nid . '/' . $gid;
	  $html = $html . '<li><a href="' . $base_path . 'node/' . $group->nid . '">' . $group->title . '</a> (member) <a href="' . $url . '"><img src="' . $base_path . 'delete.png" width="1%" /></a></li>';
	}
      }

      if (!empty($nonmember_groups)) {
	foreach($nonmember_groups as $gid => $group) {
	  $url = $base_path . 'patient/unshare/' . $patient_node->nid . '/' . $gid;
	  $html = $html . '<li><a href="' . $base_path . 'node/' . $group->nid . '">' . $group->title . '</a> <a href="' . $url . '"><img src="' . $base_path . 'delete.png" width="1%" /></a></li>';
	}
      }
      
      $html = $html . '</ul>';
    }
  } 

  if (array_key_exists('und', $patient_node->field_patient_discussiongroups)) {
    $member_groups = array();
    $nonmember_groups = array();
    foreach($patient_node->field_patient_discussiongroups['und'] as $group) {
      $group_node = node_load($group['nid']);

      if (in_array($group['nid'], $user_groups)) {
	$member_groups[$group['nid']] = $group_node;
      } else {
	$nonmember_groups[$group['nid']] = $group_node;
      }
    }

    if (!empty($member_groups) || !empty($nonmember_groups)) {
      $in_collaboration = TRUE;

      $html = $html . 'This patient is currently in discussion with the following groups:';
      $html = $html . '<ul>';

      if (!empty($member_groups)) {
	foreach($member_groups as $nid => $group) {
	  $url = $base_path . 'patient/undiscuss/' . $patient_node->nid . '/' . $nid;
	  $html = $html . '<li><a href="' . $base_path . 'node/' . $group->nid . '">' . $group->title . '</a> (member) <a href="' . $url . '"><img src="' . $base_path . 'delete.png" width="1%" /></a></li>';
	}
      }

      if (!empty($nonmember_groups)) {
	foreach($nonmember_groups as $nid => $group) {
	  $url = $base_path . 'patient/undiscuss/' . $patient_node->nid . '/' . $nid;
	  $html = $html . '<li><a href="' . $base_path . 'node/' . $group->nid . '">' . $group->title . '</a> <a href="' . $url . '"><img src="' . $base_path . 'delete.png" width="1%" /></a></li>';
	}
      }
      
      $html = $html . '</ul>';
    }
  }

  if (!$in_collaboration) {
    $html = $html . '<i>This patient is not shared or under discussion with any groups.</i><hr style="border:dashed #CCCCCC; border-width:1px 0 0; height:0;" />';
  }

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

  // CREATE FORUM ENTRIES
  $patient_forums = array();
  $count = 0;
  if (array_key_exists('und', $patient_node->field_patient_forum)) {
    $count = count($patient_node->field_patient_forum['und']);
    foreach ($patient_node->field_patient_forum['und'] as $forum_entry) {
      $patient_forums[] = $forum_entry['nid'];
    }
  }

  foreach($groupNids as $group_nid) {
    $forum_tid = get_entity_for_param('field_data_field_forum_group', 'field_forum_group_nid', $group_nid);
    $forum_topics = get_forumtopics_for_forum($forum_tid[0]);
    $intersect = array_intersect($forum_topics, $patient_forums);
    if (!empty($intersect)) {
      foreach ($intersect as $id => $nid) {
	$forum_node = node_load($nid);
	$forum_node->field_forum_patient['und'][0]['nid'] = $patient_node->nid;
	node_save($forum_node);
      }
    } else {
      $forum_nid = create_forum_entry($patient_node, $group_nid);
      $patient_node->field_patient_forum['und'][$count]['nid'] = $forum_nid;
      $count++;
    }
  }

  node_save($patient_node);
  if (!empty($to_share_with)) {
    update_group_access($patient_node);
  }

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

  $group_nid = get_nid_for_group($group_gid);

  if (array_key_exists('und', $patient_node->field_patient_discussiongroups)) {
    $index = -1;
    for($i = 0; $i < count($patient_node->field_patient_discussiongroups['und']); $i++) {
      if ($patient_node->field_patient_discussiongroups['und'][$i]['nid'] === $group_nid) {
	$index =$i;
      }
    }
    array_splice($patient_node->field_patient_discussiongroups['und'], $index, 1);
  }

  node_save($patient_node);
  update_group_access($patient_node);

  $patient_topics = get_forumtopics_for_patient($patient_node->nid);
  undiscuss_with_group($patient_topics, $group_nid);

  drupal_goto('node/' . $patient_node->nid . '/sharing');
}

function undiscuss_callback($patient_nid, $group_nid) {
  $patient_node = node_load($patient_nid);

  $index = -1;
  for($i = 0; $i < count($patient_node->field_patient_discussiongroups['und']); $i++) {
    if ($patient_node->field_patient_discussiongroups['und'][$i]['nid'] === $group_nid) {
      $index =$i;
    }
  }

  array_splice($patient_node->field_patient_discussiongroups['und'], $index, 1);
  node_save($patient_node);

  $patient_topics = get_entity_for_param('field_data_field_forum_patient', 'field_forum_patient_nid', $patient_node->nid);
  undiscuss_with_group($patient_topics, $group_nid);

  drupal_goto('node/' . $patient_node->nid . '/sharing');
}

function undiscuss_with_group($patient_topics, $group_nid) {
  $forum_tid = get_forum_for_group($group_nid);
  $forum_topics = get_forumtopics_for_forum($forum_tid);
  $intersect = array_intersect($patient_topics, $forum_topics);

  if (!empty($intersect)) {
    foreach ($intersect as $id => $nid) {
      $forum_node = node_load($nid);
      $forum_node->field_forum_patient = array();

      node_save($forum_node);
    }
  }
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
  if (array_key_exists('und', $patient_node->field_patient_diagnosis)) {
    foreach ($patient_node->field_patient_diagnosis['und'] as $diag) {
      $diag_node = node_load($diag['nid']);
      $diag_node->group_audience = $patient_node->group_audience;
      node_save($diag_node);
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

function create_forum_entry($patient_node, $group_nid) {
  global $user;

  $forum_node = new stdClass();
  $forum_node->type = 'forum';
  $forum_node->language = 'und';
  $forum_node->uid = $user->uid;
  $forum_node->comment = '2';

  $forum_node->title = $patient_node->title;

  $tid = get_forum_for_group($group_nid);
  $forum_node->taxonomy_forums['und'][0]['tid'] = $tid;
  $forum_node->field_forum_patient['und'][0]['nid'] = $patient_node->nid;
  $forum_node->field_forum_patientprovenance['und'][0]['nid'] = $patient_node->nid;

  node_save($forum_node);

  return $forum_node->nid;
}

function set_forumsummary_callback($patient_node) {
  $summary = $_POST['summary'];
  $forum_nid = $_POST['forumNid'];

  $forum_summary_nid = get_forumsummary($forum_nid, $patient_node->nid);
  if ($forum_summary_nid === NULL) {
    global $user;

    $forum_summary_node = new stdClass();
    $forum_summary_node->type = 'forum_summary';
    $forum_summary_node->language = 'und';
    $forum_summary_node->uid = $user->uid;
    $forum_summary_node->title = $patient_node->title;
    $forum_summary_node->body['und'][0]['value'] = $summary;

    $forum_summary_node->field_forumsummary_forum['und'][0]['nid'] = $forum_nid;
    $forum_summary_node->field_forumsummary_patient['und'][0]['nid'] = $patient_node->nid;

    node_save($forum_summary_node);
  } else {
    $forum_summary_node = node_load($forum_summary_nid);
    $forum_summary_node->body['und'][0]['value'] = $summary;
  }

  exit;
}