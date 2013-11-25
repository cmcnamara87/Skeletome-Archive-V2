<?php
// patientresource.inc
/**
 * Callback for creating patient resources.
 *
 * @param object $data
 * @return object
 */
function _patientresource_identifier_create($data) {
    global $user;
    if (isset($data) &&  is_array($data)) $data=(object) $data;
    unset($data->id);
    $data->uid = $user->uid;
    $data->created = time();
    $data->modified = time();

    identifier_save($data);

    return (object)$data;
}

// patientresource.inc
/**
 * Callback for updating patient resources.
 *
 * @param int $id
 * @param object $data
 * @return object
 */
function _patientresource_identifier_update($id, $data) {

    global $user;
    $patient = identifier_load($id);

    unset($data->created);
    $data->id = $id;
    $data->uid = $patient->uid;
    $data->modified = time();

    identifier_save($data);

    return (object)$data;
}
/**
 * Callback for retrieving patient resources.
 *
 * @param int $id
 * @return object
 */
function _patientresource_identifier_retrieve($id) {
    return identifier_load($id);
}

/**
 * Callback for deleting patient resources.
 *
 * @param int $id
 * @return object
 */
function _patientresource_identifier_delete($id) {
    identifier_delete($id);

    return (object)array(
        'id' => $id,
    );
}



function _patientresource_identifier_index($page, $fields, $parameters, $page_size) {
    $parameters["patient_id"] = patients_accessible();
    $identifiers = resource_helper_index('identifier', $page, $fields, $parameters, $page_size);
    return $identifiers;
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

function _patientresource_identifier_access($op, $args=array()) {
    global $user;
    $access = FALSE;

    if($args[0]) {
        $identifier = identifier_load($args[0]);
    }
    switch ($op) {
        case 'view':
            $access = user_access('view patients') && patients_is_accessible($identifier->patient_id);
            break;
        case 'index':
            $access = user_access('view patients');
            break;
        case 'update':
            $access = user_access('update patients') && patients_is_accessible($identifier->patient_id);
            break;
        case 'delete':
            $access = user_access('delete patients') && patients_is_accessible($identifier->patient_id);
            break;
        case 'create':
            $access = user_access('create patients');
            break;
    }
    return $access;
}
