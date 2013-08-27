<?php

function patient_ci_callback($node) {
  $form_state['build_info']['args'] = array($node);
  return drupal_build_form('patient_ci_form', $form_state);
}

function patient_ci_form($node, &$form_state) {
  $node = $form_state['build_info']['args'][0];

  $html = create_contact_info($node);
  drupal_add_library('system', 'ui.button');
  drupal_add_library('system', 'ui.dialog');
  drupal_add_js(array('patientNodeId' => $node->nid), 'setting');
  drupal_add_css(drupal_get_path('module', 'patient') . '/patient_ci/patient_ci.css', array('group' => CSS_DEFAULT));
  drupal_add_js(drupal_get_path('module', 'patient') .'/patient_ci/jquery.jeditable.min.js', array('group' => JS_DEFAULT));
  drupal_add_js(drupal_get_path('module', 'patient') .'/patient_ci/patient_ci.js', array('group' => JS_DEFAULT));

  $error_message = '<div id="error-dialog" title="Error">
	<span class="ui-icon ui-icon-alert" style="float:left; margin:0 7px 20px 0;"></span>The date you have entered is invalid.</div>';

  $form['contact_info'] = array(
    '#markup' => '<div class="block-title"><h2 class="title">Contact Information</h2></div>' . $html . $error_message,
    '#weight' => 1
  );

  return $form;
}

function create_contact_info($patient_node) {
  $ci_node = node_load($patient_node->field_patient_ci['und'][0]['nid']);
  $html = '';

  $html = $html . '<h4><u>General</u></h4>';
  $html = $html . '<table id="box-table-b"><tbody>';

  $html = $html . '<tr><td>';
  if (!empty($ci_node->field_patient_firstname)) {
    $name = $ci_node->field_patient_firstname['und'][0]['value'];
    $name_html = '<span class="edit" id="patient_firstname">' . $name . '</span>';
    $html = $html . '<strong>First name: </strong> ' . $name_html;
  } else {
    $name_html = '<span class="edit" id="patient_firstname"><i>(Please click to add a first name)</i></span>';
    $html = $html . '<strong>First name: </strong> ' . $name_html;
  }
  $html = $html . '</td></tr>';

  $html = $html . '<tr><td>';
  if (!empty($ci_node->field_patient_lastname)) {
    $name = $ci_node->field_patient_lastname['und'][0]['value'];
    $name_html = '<span class="edit" id="patient_lastname">' . $name . '</span>';
    $html = $html . '<strong>Last name: </strong> ' . $name_html;
  } else {
    $name_html = '<span class="edit" id="patient_lastname"><i>(Please click to add a last name)</i></span>';
    $html = $html . '<strong>Last name: </strong> ' . $name_html;
  }
  $html = $html . '</td></tr>';

  $html = $html . '<tr><td>';
  if (!empty($ci_node->field_patient_alias)) {
    $alias = $ci_node->field_patient_alias['und'][0]['value'];
    $alias_html = '<span class="edit" id="patient_alias">' . $alias . '</span>';
    $html = $html . '<strong>Alias: </strong> ' . $alias_html;
  } else {
    $alias_html = '<span class="edit" id="patient_alias"><i>(Please click to add an alias)</i></span>';
    $html = $html . '<strong>Alias: </strong> ' . $alias_html;
  }
  $html = $html . '</td></tr>';

  $html = $html . '<tr><td>';
  if (!empty($ci_node->field_patient_dob)) {
    $dob = $ci_node->field_patient_dob['und'][0]['value'];

    $dateObj = new DateObject($dob);
    $date_array = $dateObj->toArray();
    if (strlen($date_array['day']) == 1) {
      $day = '0' . $date_array['day'];
    } else {
      $day = $date_array['day'];
    }
    if (strlen($date_array['month']) == 1) {
      $month = '0' . $date_array['month'];
    } else {
      $month = $date_array['month'];
    }

    $dob_html = $day . '/' . $month . '/' . $date_array['year'];
    $dob_html = '<span class="edit" id="patient_dob">' . $dob_html . '</span>';
    $html = $html . '<strong>Date of birth: </strong> ' . $dob_html;
  } else {
    $dob_html = '<span class="edit" id="patient_dob"><i>(Please click to add a date of birth)</i></span>';
    $html = $html . '<strong>Date of birth: </strong> ' . $dob_html;
  }
  $html = $html . '</td></tr>';

  $html = $html . '<tr><td>';
  if (!empty($ci_node->field_patient_gender)) {
    $gender_code = $ci_node->field_patient_gender['und'][0]['value'];
    if ($gender_code === '1') {
      $gender = 'Male';
    } else {
      $gender = 'Female';
    }
    $gender_html = '<span class="edit" id="patient_gender">' . $gender . '</span>';
    $html = $html . '<strong>Gender: </strong> ' . $gender_html;
  } else {
    $gender_html = '<span class="edit" id="patient_gender"><i>(Please click to set the gender)</i></span>';
    $html = $html . '<strong>Gender: </strong> ' . $gender_html;
  }
  $html = $html . '</td></tr>';

  $html = $html . '<tr><td>';
  if (!empty($ci_node->field_patient_ethnicity)) {
    $ethnicity = $ci_node->field_patient_ethnicity['und'][0]['value'];
    $ethnicity_html = '<span class="edit" id="patient_ethnicity">' . $ethnicity . '</span>';
    $html = $html . '<strong>Ethnicity: </strong> ' . $ethnicity_html;
  } else {
    $ethnicity_html = '<span class="edit" id="patient_ethnicity"><i>(Please click to add an ethnicity)</i></span>';
    $html = $html . '<strong>Ethnicity: </strong> ' . $ethnicity_html;
  }
  $html = $html . '</td></tr></tbody></table>';

  $html = $html . '<h4><u>Address</u></h4>';
  $html = $html . '<table id="box-table-b"><tbody>';
  $html = $html . '<tr><td>';
  if (!empty($ci_node->field_patient_addressstreet)) {
    $address = $ci_node->field_patient_addressstreet['und'][0]['value'];
    $address_html = '<span class="edit" id="patient_addressstreet">' . $address . '</span>';
    $html = $html . '<strong>Street: </strong> ' . $address_html;
  } else {
    $address_html = '<span class="edit" id="patient_addressstreet"><i>(Please click to add a street)</i></span>';
    $html = $html . '<strong>Street: </strong> ' . $address_html;
  }
  $html = $html . '</td></tr>';

  $html = $html . '<tr><td>';
  if (!empty($ci_node->field_patient_addresscity)) {
    $address = $ci_node->field_patient_addresscity['und'][0]['value'];
    $address_html = '<span class="edit" id="patient_addresscity">' . $address . '</span>';
    $html = $html . '<strong>City: </strong> ' . $address_html;
  } else {
    $address_html = '<span class="edit" id="patient_addresscity"><i>(Please click to add a city)</i></span>';
    $html = $html . '<strong>City: </strong> ' . $address_html;
  }
  $html = $html . '</td></tr>';

  $html = $html . '<tr><td>';
  if (!empty($ci_node->field_patient_addressstate)) {
    $address = $ci_node->field_patient_addressstate['und'][0]['value'];
    $address_html = '<span class="edit" id="patient_addressstate">' . $address . '</span>';
    $html = $html . '<strong>State: </strong> ' . $address_html;
  } else {
    $address_html = '<span class="edit" id="patient_addressstate"><i>(Please click to add a state)</i></span>';
    $html = $html . '<strong>State: </strong> ' . $address_html;
  }
  $html = $html . '</td></tr>';

  $html = $html . '<tr><td>';
  if (!empty($ci_node->field_patient_addresspostcode)) {
    $address = $ci_node->field_patient_addresspostcode['und'][0]['value'];
    $address_html = '<span class="edit" id="patient_addresspostcode">' . $address . '</span>';
    $html = $html . '<strong>Postcode: </strong> ' . $address_html;
  } else {
    $address_html = '<span class="edit" id="patient_addresspostcode"><i>(Please click to add a postcode)</i></span>';
    $html = $html . '<strong>Postcode: </strong> ' . $address_html;
  }
  $html = $html . '</td></tr>';

  $html = $html . '<tr><td>';
  if (!empty($ci_node->field_patient_addresscountry)) {
    $address = $ci_node->field_patient_addresscountry['und'][0]['value'];
    $address_html = '<span class="edit" id="patient_addresscountry">' . $address . '</span>';
    $html = $html . '<strong>Country: </strong> ' . $address_html;
  } else {
    $address_html = '<span class="edit" id="patient_addresscountry"><i>(Please click to add a country)</i></span>';
    $html = $html . '<strong>Country: </strong> ' . $address_html;
  }

  $html = $html . '</td></tr></tbody></table>';

  return $html;
}

function set_ci_callback($patient_node) {
  $ci_node = node_load($patient_node->field_patient_ci['und'][0]['nid']);

  if (array_key_exists('firstname', $_POST)) {
    $name = $_POST['firstname'];
    $ci_node->field_patient_firstname['und'][0]['value'] = $name;
    node_save($ci_node);
  }
  if (array_key_exists('lastname', $_POST)) {
    $name = $_POST['lastname'];
    $ci_node->field_patient_lastname['und'][0]['value'] = $name;
    node_save($ci_node);
  }
  if (array_key_exists('alias', $_POST)) {
    $alias = $_POST['alias'];
    $ci_node->field_patient_alias['und'][0]['value'] = $alias;
    node_save($ci_node);
  }
  if (array_key_exists('ethnicity', $_POST)) {
    $ethnicity = $_POST['ethnicity'];
    $ci_node->field_patient_ethnicity['und'][0]['value'] = $ethnicity;
    node_save($ci_node);
  }
  if (array_key_exists('gender', $_POST)) {
    $gender = $_POST['gender'];
    $ci_node->field_patient_gender['und'][0]['value'] = $gender;
    node_save($ci_node);
  }

  if (array_key_exists('date', $_POST)) {
    $dob = $_POST['date'];
    $dateObj = new DateObject($dob, NULL);
    if (!date_is_date($dateObj)) {
      echo 'ERROR';
      exit;
    } else {
      $ci_node->field_patient_dob['und'][0]['value'] = $dateObj->format(DATE_FORMAT_ISO);
      $ci_node->field_patient_dob['und'][0]['value2'] = $dateObj->format(DATE_FORMAT_ISO);
      node_save($ci_node);
    }
  }

  if (array_key_exists('street', $_POST)) {
    $address = $_POST['street'];
    $ci_node->field_patient_addressstreet['und'][0]['value'] = $address;
    node_save($ci_node);
  }
  if (array_key_exists('city', $_POST)) {
    $address = $_POST['city'];
    $ci_node->field_patient_addresscity['und'][0]['value'] = $address;
    node_save($ci_node);
  }
  if (array_key_exists('state', $_POST)) {
    $address = $_POST['state'];
    $ci_node->field_patient_addressstate['und'][0]['value'] = $address;
    node_save($ci_node);
  }
  if (array_key_exists('postcode', $_POST)) {
    $address = $_POST['postcode'];
    $ci_node->field_patient_addresspostcode['und'][0]['value'] = $address;
    node_save($ci_node);
  }
  if (array_key_exists('country', $_POST)) {
    $address = $_POST['country'];
    $ci_node->field_patient_addresscountry['und'][0]['value'] = $address;
    node_save($ci_node);
  }

  exit;
}