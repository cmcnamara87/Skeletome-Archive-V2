<?php
// hpo_resource.inc
/**
 * Callback for creating patient resources.
 *
 * @param object $data
 * @return object
 */
function _hpo_resource_hpo_tag_create($data) {
    global $user;
    if (isset($data) &&  is_array($data)) $data=(object) $data;
    unset($data->id);
    $data->uid = $user->uid;
    $data->created = time();
    $data->modified = time();

    hpo_tag_save($data);

    return (object)$data;
}

// hpo_resource.inc
/**
 * Callback for updating patient resources.
 *
 * @param int $id
 * @param object $data
 * @return object
 */
function _hpo_resource_hpo_tag_update($id, $data) {

    global $user;
    if (isset($data) &&  is_array($data)) $data=(object) $data;

    unset($data->created);
    $data->id = $id;
    $data->modified = time();

    hpo_tag_save($data);
    return (object)$data;
}
/**
 * Callback for retrieving patient resources.
 *
 * @param int $id
 * @return object
 */
function _hpo_resource_hpo_tag_retrieve($id) {

    return hpo_tag_load($id);
}

/**
 * Callback for deleting patient resources.
 *
 * @param int $id
 * @return object
 */
function _hpo_resource_hpo_tag_delete($id) {
    hpo_tag_delete($id);

    return (object)array(
        'id' => $id,
    );
}



function _hpo_resource_hpo_tag_index($page, $fields, $parameters, $page_size) {
    return resource_helper_index('hpo_tag', $page, $fields, $parameters, $page_size);
}


/**
 * Access callback for the patient resource.
 *
 * @param string $op
 *  The operation that's going to be performed.
 * @param array $args
 *  The arguments that will be passed to the callback.
 * @return bool
 *  Whether access is given or not.
 */

function _hpo_resource_hpo_tag_access($op, $args=array()) {
    global $user;
    $access = true;

//    if(isset($args[0])) {
//        $hpo_tag = hpo_tag_load($args[0]);
//        if($hpo_tag->object_type == "patient") {
//
//            switch ($op) {
//                case 'view':
//                    $access = user_access('view patients') && patients_is_accessible($hpo_tag->object_id);
//                    break;
//                case 'index':
//                    $access = user_access('view patients');
//                    break;
//                case 'update':
//                    $access = user_access('update patients') && patients_is_accessible($hpo_tag->object_id);
//                    break;
//                case 'delete':
//                    $access = user_access('delete patients') && patients_is_accessible($hpo_tag->object_id);
//                    break;
//                case 'create':
//                    $access = user_access('create patients');
//                    break;
//            }
//
//        } else if($hpo_tag->object_type == "xray") {
//            $xray = xray_load($hpo_tag->object_id);
//
//            switch ($op) {
//                case 'view':
//                    $access = user_access('view patients') && patients_is_accessible($xray->patient_id);
//                    break;
//                case 'index':
//                    $access = user_access('view patients');
//                    break;
//                case 'update':
//                    $access = user_access('update patients') && patients_is_accessible($xray->patient_id);
//                    break;
//                case 'delete':
//                    $access = user_access('delete patients') && patients_is_accessible($xray->patient_id);
//                    break;
//                case 'create':
//                    $access = user_access('create patients');
//                    break;
//            }
//        }
//    }
    return $access;
}
