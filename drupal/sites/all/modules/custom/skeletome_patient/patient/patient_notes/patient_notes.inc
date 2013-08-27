<?php

function patient_notes_callback($node) {
  $form_state['build_info']['args'] = array($node);
  return drupal_build_form('patient_notes_form', $form_state);
}

function add_note_callback($node) {
  global $user;

  $text = $_POST['text'];
  $count = 0;
  if (array_key_exists('und', $node->field_patient_note)) {
    $count = count($node->field_patient_note['und']);
  }

  $note_node = new stdClass();
  $note_node->type = 'patient_note';
  $note_node->language = 'und';
  $note_node->title = 'Note';
  $note_node->body['und'][0]['value'] = $text;
  $note_node->uid = $user->uid; 
  $note_node->field_patientnote_patient['und'][0]['nid'] = $node->nid;
  node_save($note_node);

  $node->field_patient_note['und'][$count]['nid'] = $note_node->nid;
  node_save($node);
  exit;
}

function update_note_callback($node, $note_nid) {
  $node_idx = $_POST['idx'];
  $node_nid = $_POST['patientNid'];
  $text = $_POST['text'];
  $note_node = node_load($node_idx);
  $note_node->body['und'][0]['value'] = $text;
  node_save($note_node);
  exit;
}

function edit_note_callback($node, $note_nid) {
  $node_idx = $_POST['idx'];
  $node_nid = $_POST['patientNid'];

  $note_node = node_load($node_idx);
  echo $note_node->body['und'][0]['value'];
  exit;
}

function delete_note_callback($node, $note_nid) {
  $to_keep = array();
  foreach ($node->field_patient_note['und'] as $note) {
    if ($note['nid'] != $note_nid) {
      $to_keep[] = $note;
    }
  }
  $node->field_patient_note['und'] = $to_keep;
  node_save($node);
  node_delete($note_nid);

  drupal_goto('node/' . $node->nid . '/notes');
}

function patient_notes_form($node, &$form_state) {
  $node = $form_state['build_info']['args'][0];

  drupal_add_library('system', 'ui.button');
  drupal_add_library('system', 'ui.dialog');
  drupal_add_library('system', 'ui.accordion');
  drupal_add_js(array('patientNodeId' => $node->nid), 'setting');
  $notes = array();
  $notes_idx = array();
  if (array_key_exists('und', $node->field_patient_note)) {
    drupal_add_js(array('noNotes' => count($node->field_patient_note['und'])), 'setting');
    $count = 0;
    foreach ($node->field_patient_note['und'] as $note) {
      $note_node = node_load($note['nid']);
      if (is_current_user_owner($note_node)) {
	$notes[] = $note_node;
	$notes_idx[$count] = $note_node->nid;
	$count++;
      }
    }
    drupal_add_js(array('notesIdx' => $notes_idx), 'setting');
  } else {
    drupal_add_js(array('noNotes' => 0), 'setting');
    drupal_add_js(array('notesIdx' => array()), 'setting');
  }
  drupal_add_js(drupal_get_path('module', 'patient') .'/patient_notes/patient_notes.js', array('group' => JS_DEFAULT));

  $form['add_note_button'] = array(
    '#markup' => '<div style="text-align:right;"><a id="add_note_button" href="#">Add Note</a></div><hr style="border:dashed #CCCCCC; border-width:1px 0 0; height:0;" />',
    '#weight' => 1
  );

  if (!empty($notes)) {
    $html_accordion = '<div class="note_accordion">';
    foreach ($notes as $note) {
      $html_note = create_html_for_note($note);
      $html_accordion = $html_accordion . $html_note;
    }
    $html_accordion = $html_accordion . '</div>';

    $form['patient_notes'] = array(
      '#markup' => '<div class="block-title"><h2 class="title">Patient notes</h2></div>',
      '#weight' => 2
    );

    $form['notes_accordion'] = array(
      '#markup' => $html_accordion,
      '#weight' => 3
    );
  }

  $form['add_note_form'] = array(
    '#markup' => '<div id="add_note_dialog" title="Add note">
	    <form>
	      <textarea id="note_text" rows="8" cols="30"></textarea>
	    </form></div>',
    '#weight' => 100
  );

  $form['edit_note_form'] = array(
    '#markup' => '<div id="edit_note_dialog" title="Edit note">
	    <form>
	      <textarea id="edit_note_text" rows="8" cols="30"></textarea>
	    </form></div>',
    '#weight' => 101
  );

  return $form;
}

function create_html_for_note($note) {
  $note_content = $note->body['und'][0]['value'];
  
  $html_note = '<h3><a href="#">' . substr($note_content, 0, 30) . ' ... </a></h3>';
  $edit_link = '<a id="edit_button_' . $note->nid . '" href="#">Edit</a>';
  $delete_link = '<a id="delete_button_' . $note->nid . '" href="notes/delete/' . $note->nid . '">Delete</a>';
  $html_note = $html_note . '<div><p>' . $note_content . '</p><div style="text-align:right;">' . $edit_link . ' ' . $delete_link . '</div></div>';

  return $html_note;
}