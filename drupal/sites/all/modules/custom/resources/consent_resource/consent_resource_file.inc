<?php
// consentfile_resource.inc
/**
 * Callback for creating consentfile resources.
 *
 * @param object $data
 * @return object
 */
function _consent_resource_file_create($data) {
    global $user;
    if (isset($data) &&  is_array($data)) $data=(object) $data;
    unset($data->id);
    $data->uid = $user->uid;
    $data->created = time();
    $data->modified = time();

    consentfile_save($data);

    return (object)$data;
}

// consentfile_resource.inc
/**
 * Callback for updating consentfile resources.
 *
 * @param int $id
 * @param object $data
 * @return object
 */
function _consent_resource_file_update($id, $data) {
    global $user;
    $consentfile = consentfile_load($id);

    unset($data->created);
    $data->id = $id;
    $data->uid = $consentfile->uid;
    $data->modified = time();

    consentfile_save($data);

    return (object)$data;
}
/**
 * Callback for retrieving consentfile resources.
 *
 * @param int $id
 * @return object
 */
function _consent_resource_file_retrieve($id) {
    return consentfile_load($id);
}

/**
 * Callback for deleting consentfile resources.
 *
 * @param int $id
 * @return object
 */
function _consent_resource_file_delete($id) {
    consentfile_delete($id);

    return (object)array(
        'id' => $id,
    );
}

function _consent_resource_file_index($page, $fields, $parameters, $page_size) {
    $parameters['patient_id'] = patients_filter_accessible($parameters['patient_id']);
    return resource_helper_index('consentfile', $page, $fields, $parameters, $page_size);
}

/**
 * Access callback for the consentfile resource.
 *
 * @param string $op
 *  The operation that's going to be performed.
 * @param array $args
 *  The arguments that will be passed to the callback.
 * @return bool
 *  Whether access is given or not.
 */
function _consent_resource_file_access($op, $args=array()) {
    global $user;
    $access = FALSE;

    if($args[0]) {
        $consent_file = consentfile_load($args[0]);
    }
    switch ($op) {
        case 'view':
            $access = user_access('view patients') && patients_is_accessible($consent_file->patient_id);
            break;
        case 'index':
            $access = user_access('view patients');
            break;
        case 'update':
            $access = user_access('update patients') && patients_is_accessible($consent_file->patient_id);
            break;
        case 'delete':
            $access = user_access('delete patients') && patients_is_accessible($consent_file->patient_id);
            break;
        case 'create':
            $access = user_access('create patients');
            break;
    }

    return $access;
}