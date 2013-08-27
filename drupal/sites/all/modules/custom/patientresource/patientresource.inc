<?php
// patientresource.inc
/**
 * Callback for creating patient resources.
 *
 * @param object $data
 * @return object
 */
function _patientresource_create($data) {
    global $user;
    if (isset($data) &&  is_array($data)) $data=(object) $data;
    unset($data->id);
    $data->uid = $user->uid;
    $data->created = time();
    $data->modified = time();

    patient_save($data);

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
function _patientresource_update($id, $data) {

    global $user;
    $patient = patient_load($id);

    unset($data->created);
    $data->id = $id;
    $data->uid = $patient->uid;
    $data->modified = time();

    patient_save($data);

    return (object)$data;
}
/**
 * Callback for retrieving patient resources.
 *
 * @param int $id
 * @return object
 */
function _patientresource_retrieve($id) {

    return patient_load($id);
}

/**
 * Callback for deleting patient resources.
 *
 * @param int $id
 * @return object
 */
function _patientresource_delete($id) {
    patient_delete($id);

    return (object)array(
        'id' => $id,
    );
}



function _patientresource_index($page, $fields, $parameters, $page_size) {
    module_load_include('inc', 'services', 'services.module');
    $node_select = db_select('patients', 't')
        ->orderBy('created', 'DESC');

    services_resource_build_index_query($node_select, $page, $fields, $parameters, $page_size, 'patients');

//    if (!user_access('administer nodes')) {
////        $node_select->condition('', 1);
//    }

    $results = services_resource_execute_index_query($node_select);

    $list = services_resource_build_index_list($results, 'patients', 'id');

//    foreach($list as &$patient) {
//        $patient->user = user_load($patient->uid);
//        $membership->user = user_load($membership->user_id);
//        unset($membership->user->pass);
//        $membership->group = group_load($membership->group_id);
//    }

    return $list;
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

function _patientresource_access($op, $args) {
    global $user;
    $access = FALSE;

    switch ($op) {
        case 'view':
            $patient = patient_load($args[0]);
            $access = user_access('patient resource view any patient');
            $access = $access || $patient->uid == $user->uid && user_access('patient resource view own patients');
            break;
        case 'update':
            $patient = patient_load($args[0]->id);
            $access = user_access('patient resource edit any patient');
            $access = $access || $patient->uid == $user->uid && user_access('patient resource edit own patients');
            break;
        case 'delete':
            $patient = patient_load($args[0]);
            $access = user_access('patient resource delete any patient');
            $access = $access || $patient->uid == $user->uid && user_access('patient resource delete own patients');
            break;
    }
    $access = TRUE;

    return $access;
}