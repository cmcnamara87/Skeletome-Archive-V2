<?php

define('_CS_FILENAME_', 'patient_data.txt');
define('_XRAY_DESC_FILENAME_', 'xray_descriptions.txt');

function export_group_cases($gid) {
}

function export_cases($uid) {
}

function export_case($patient_nid, $export_sesitive = FALSE, $export_xray = TRUE, $export_genrep = TRUE, $export_cs = TRUE) {
  $sesitive_data = NULL;
  $xray_data = NULL;
  $cs_data = NULL;
  $genrep_data = NULL;

  $patient_node = node_load($patient_nid);
  if ($export_sesitive) {
    $sesitive_data = get_sensitive_data($patient_node);
  }
  if ($export_xray) {
    $xray_data = get_xray_data($patient_node);
  }
  if ($export_genrep) {
    $genrep_data = get_genrep_data($patient_node);
  }
  if ($export_cs) {
    $cs_data = get_cs_data($patient_node);
    if ($cs_data === '') {
      $cs_data = NULL;
    }
  }

  if (($export_sesitive && ($sesitive_data != NULL)) || ($export_xray && ($xray_data != NULL)) || 
      ($export_genrep && ($genrep_data != NULL)) || ($export_cs && ($cs_data != NULL))) {
    $tmp_dir = drupal_realpath('public://') . '/tmp_export';
    $r = mkdir($tmp_dir);
    if (!$r) {
      drupal_set_message('Unable to create the temporary files required for the export.', 'error');
      return;
    }

    $archive_dir = drupal_realpath('public://') . '/archive';
    $r = mkdir($archive_dir);
    if (!$r) {
      drupal_set_message('Unable to create the temporary files required for the export.', 'error');
      return;
    }

    $case_folder = $tmp_dir . '/' . $patient_node->title;
    $r = mkdir($case_folder);
    if (!$r) {
      drupal_set_message('Unable to create the temporary files required for the export.', 'error');
      return;
    }

    if ($export_cs && ($cs_data != NULL)) {
      $cs_file = $case_folder . '/' . _CS_FILENAME_;
      if ($fh = fopen($cs_file, 'w+')) {
	fwrite($fh, $cs_data);
	fclose($fh);
      }
    }

    if ($export_xray && ($xray_data != NULL)) {
      $xray_text = "";
      foreach($xray_data as $file_name => $file) {
	copy($file['path'], $case_folder . '/' . $file_name);
	if (array_key_exists('description', $file)) {
	  $description = $file['description'];
	  if ($description != '') {
	    $xray_text = $xray_text . $file_name . "\n" . "--------------------\n" . $description . "\n\n";
	  }
	}
      }

      if ($xray_text !== "") {
	$xd_file = $case_folder . '/' . _XRAY_DESC_FILENAME_;
	if ($fh = fopen($xd_file, 'w+')) {
	  fwrite($fh, $xray_text);
	  fclose($fh);
	}
      }
    }

    chdir($case_folder);
    $zip_filename = $archive_dir . '/' . $patient_node->title . '.zip';
    $r = create_zip($case_folder, $zip_filename);
    if ($r) {
      $r = remove_folder($tmp_dir);
      if (!$r) {
	drupal_set_message('Unable to remove the temporary export files.', 'error');
      }
      download_file($zip_filename);
    } else {
      drupal_set_message('Unable to create the patient data archive.', 'error');
    }
  }
}

function get_sensitive_data($patient_node) {
/*
field_patient_consentfile
field_patient_refno
field_patient_gender
field_patient_dob
field_patient_ethnicity
field_patient_name
field_patient_address
*/

}

function get_xray_data($patient_node) {
  $files = array();

  if (array_key_exists('und', $patient_node->field_patient_xrayreport)) {
    foreach ($patient_node->field_patient_xrayreport['und'] as $xray_report) {
      $xray_rep_node = node_load($xray_report['nid']);
      
      if (array_key_exists('und', $xray_rep_node->media_gallery_media)) {
	foreach ($xray_rep_node->media_gallery_media['und'] as $media_item) {
	  $file = file_load($media_item['fid']);
	  
	  $files[$file->filename]['path'] = drupal_realpath($file->uri);
	  if (property_exists($file, 'media_description')) {
	    if (array_key_exists('und', $file->media_description)) {
	      $files[$file->filename]['description'] = strip_tags($file->media_description['und'][0]['value']);
	    }
	  }
	}
      }
    }
  }

  return $files;
}

function get_genrep_data($patient_node) {
/*
field_patient_genrep
*/
}

function get_cs_data($patient_node) {
  $cs_text = '';
  $diags = array();

  if (array_key_exists('und', $patient_node->field_patient_clinicalsummary)) {
    $cs_nid = $patient_node->field_patient_clinicalsummary['und'][0]['nid'];
    $cs_node = node_load($cs_nid);
    if (array_key_exists('und', $cs_node->body)) {
      $cs_text = $cs_node->body['und'][0]['value'];
    }
  }

  if (array_key_exists('und', $patient_node->field_patient_diagnosis)) {
    foreach ($patient_node->field_patient_diagnosis['und'] as $diag) {
      $diag_node = node_load($diag['nid']);
      if (array_key_exists('und', $diag_node->field_diag_bonedysplasia)) {
	$bd_nid = $diag_node->field_diag_bonedysplasia['und'][0]['nid'];
	$bd_node = node_load($bd_nid);

	$comments = get_comments($diag['nid']);
	ksort($comments);
	$diags[$bd_node->title] = $comments;
      }
    }
  }

  $cs_data = '';
  if ($cs_text !== '') {
    $cs_data = "Clinical summary:\n-----------------\n" . strip_tags($cs_text);
  }

  if (!empty($diags)) {
    $cs_data = $cs_data . "\n==============\n" . "Diagnosis:\n----------\n";
    foreach ($diags as $diag => $comments) {
      $cs_data = $cs_data . " * " . $diag;
      if (!empty($comments)) {
	$cs_data = $cs_data . "\n" . "Comments:" . "\n";
	foreach ($comments as $created => $comment) {
	  $cs_data = $cs_data . strip_tags($comment) . "\n";
	}
      }
    }
  }

  return $cs_data;
}

function get_comments($nid) {
  $comments = array();
  $users = array();
  $sql = 'SELECT cid, nid, uid, created FROM {comment} c WHERE c.nid = :nid';
  $result = db_query($sql, array(':nid' => $nid));
  $cids = array();
  foreach ($result as $row) {
    $cids[$row->cid] = $row->created;
    $users[$row->cid] = $row->uid;
  }

  foreach ($cids as $cid => $created) {
    $c_text = get_comment_text($cid);
    if ($c_text != NULL) {
      $user = user_load($users[$cid]);
      $comments[$created] = $user->name . ': ' . $c_text;
    }
  }

  return $comments;
}

function get_comment_text($cid) {
  $sql = 'SELECT entity_id, comment_body_value FROM {field_data_comment_body} c WHERE c.entity_id = :cid';
  $result = db_query($sql, array(':cid' => $cid));
  foreach ($result as $row) {
    return $row->comment_body_value;
  }

  return NULL;
}

function create_zip($folder, $destination = '') {
  if(file_exists($destination)) {
    return false;
  }

  $valid_files = array();
  if ($dh = opendir($folder)) {
    while (($file = readdir($dh)) !== false) {
      if (($file === '..') || ($file === '.')) {
	continue;
      }
      $valid_files[] = $file;
    }
    closedir($dh);
  }

  if(count($valid_files)) {
    $zip = new ZipArchive();
    if($zip->open($destination, ZIPARCHIVE::CREATE) !== true) {
      return false;
    }

    foreach($valid_files as $file) {
      $zip->addFile($file,$file);
    }
    $zip->close();
    return file_exists($destination);
  } else {
    return false;
  }
}

function remove_folder($directory, $empty = FALSE) {
  if(substr($directory, -1) == '/') {
    $directory = substr($directory, 0, -1);
  }
  if(!file_exists($directory) || !is_dir($directory)) {
    return FALSE;
  } elseif(is_readable($directory)) {
    $handle = opendir($directory);
    while (FALSE !== ($item = readdir($handle))) {
      if($item != '.' && $item != '..') {
	$path = $directory . '/' . $item;
	if(is_dir($path)) {
	  remove_folder($path);
	} else {
	  unlink($path);
	}
      }
    }
    
    closedir($handle);
    if($empty == FALSE) {
      if(!rmdir($directory)) {
	return FALSE;
      }
    }
  }

  return TRUE;
}

function download_file($file) {
  $mm_type="application/octet-stream";

  header("Pragma: public");
  header("Expires: 0");
  header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
  header("Cache-Control: public");
  header("Content-Description: File Transfer");
  header("Content-Type: " . $mm_type);
  header("Content-Length: " .(string)(filesize($file)) );
  header('Content-Disposition: attachment; filename="'.basename($file).'"');
  header("Content-Transfer-Encoding: binary\n");

  readfile($file);
  exit();
}