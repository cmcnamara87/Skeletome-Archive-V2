<?php
// groupresource.inc
/**
 * Callback for creating group resources.
 *
 * @param object $data
 * @return object
 */
function _diagnosis_resource_create($data) {
    global $user;
    if (isset($data) &&  is_array($data)) $data=(object) $data;
    unset($data->id);
    $data->uid = $user->uid;
    $data->created = time();
    $data->modified = time();

//
//    if (!isset($data->subject)) {
//        return services_error('Missing group attribute subject', 406);
//    }
//
//    if (!isset($data->group)) {
//        return services_error('Missing group attribute group', 406);
//    }

    diagnosis_save($data);

    return (object)$data;
}

// groupresource.inc
/**
 * Callback for updating group resources.
 *
 * @param int $id
 * @param object $data
 * @return object
 */
function _diagnosis_resource_update($id, $data) {
    $group = diagnosis_load($id);

    unset($data->created);
    $data->id = $id;
    $data->uid = $group->uid;
    $data->modified = time();

    $data->user = user_load($data->user_id);
    $data->group = diagnosis_load($data->diagnosis_id);

    diagnosis_save($data);
}
/**
 * Callback for retrieving group resources.
 *
 * @param int $id
 * @return object
 */
function _diagnosis_resource_retrieve($id) {
    $membership = diagnosis_load($id);

    $membership->user = user_load($membership->user_id);
    unset($membership->user->pass);
    $membership->group = diagnosis_load($membership->diagnosis_id);

    return $membership;
}

/**
 * Callback for deleting group resources.
 *
 * @param int $id
 * @return object
 */
function _diagnosis_resource_delete($id) {
    return diagnosis_delete($id);
}


function _diagnosis_resource_index($page, $fields, $parameters, $page_size) {
    $parameters['patient_id'] = patients_filter_accessible($parameters['patient_id']);
    return resource_helper_index('diagnosis', $page, $fields, $parameters, $page_size);
}


/**
 * Access callback for the group resource.
 *
 * @param string $op
 *  The operation that's going to be performed.
 * @param array $args
 *  The arguments that will be passed to the callback.
 * @return bool
 *  Whether access is given or not.
 */

function _diagnosis_resource_access($op, $args=array()) {
    global $user;
    $access = FALSE;

    if($args[0]) {
        $diagnosis = diagnosis_load($args[0]);
    }
    switch ($op) {
        case 'view':
            $access = user_access('view diagnoses') && patients_is_accessible($diagnosis->patient_id);
            break;
        case 'index':
            $access = user_access('view diagnoses');
            break;
        case 'update':
            $access = user_access('update diagnoses') && patients_is_accessible($diagnosis->patient_id);
            break;
        case 'delete':
            $access = user_access('delete diagnoses') && patients_is_accessible($diagnosis->patient_id);
            break;
        case 'create':
            $access = user_access('create diagnoses');
            break;
    }



    return $access;
}