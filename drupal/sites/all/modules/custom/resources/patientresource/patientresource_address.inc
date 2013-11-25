<?php
// patientresource.inc
/**
 * Callback for creating patient resources.
 *
 * @param object $data
 * @return object
 */
function _patientresource_address_create($data) {
    global $user;
    if (isset($data) &&  is_array($data)) $data=(object) $data;
    unset($data->id);
    $data->uid = $user->uid;
    $data->created = time();
    $data->modified = time();

    address_save($data);

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
function _patientresource_address_update($id, $data) {

    global $user;
    $patient = address_load($id);

    unset($data->created);
    $data->id = $id;
    $data->uid = $patient->uid;
    $data->modified = time();

    address_save($data);

    return (object)$data;
}
/**
 * Callback for retrieving patient resources.
 *
 * @param int $id
 * @return object
 */
function _patientresource_address_retrieve($id) {

    return address_load($id);
}

/**
 * Callback for deleting patient resources.
 *
 * @param int $id
 * @return object
 */
function _patientresource_address_delete($id) {
    address_delete($id);

    return (object)array(
        'id' => $id,
    );
}



function _patientresource_address_index($page, $fields, $parameters, $page_size) {
    $patient_ids = patients_accessible();
    $parameters["patient_id"] = $patient_ids;
    return resource_helper_index('address', $page, $fields, $parameters, $page_size);
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

function _patientresource_address_access($op, $args=array()) {
    global $user;
    $access = FALSE;

    if($args[0]) {
        $address = address_load($args[0]);
    }

    switch ($op) {
        case 'view':
            $access = user_access('view patients') && patients_is_accessible($address->patient_id);
            break;
        case 'index':
            $access = user_access('view patients');
            break;
        case 'update':
            $access = user_access('update patients') && patients_is_accessible($address->patient_id);
            break;
        case 'delete':
            $access = user_access('delete patients') && patients_is_accessible($address->patient_id);
            break;
        case 'create':
            $access = user_access('create patients');
            break;
    }
    return $access;
}
