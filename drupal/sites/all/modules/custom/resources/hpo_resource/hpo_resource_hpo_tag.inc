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

function _hpo_resource_hpo_tag_access($op, $args) {
    global $user;
    $access = FALSE;

    switch ($op) {
        case 'view':
            $patient = hpo_tag_load($args[0]);
            $access = user_access('patient resource view any patient');
            $access = $access || $patient->uid == $user->uid && user_access('patient resource view own patients');
            break;
        case 'update':
            $patient = hpo_tag_load($args[0]->id);
            $access = user_access('patient resource edit any patient');
            $access = $access || $patient->uid == $user->uid && user_access('patient resource edit own patients');
            break;
        case 'delete':
            $patient = hpo_tag_load($args[0]);
            $access = user_access('patient resource delete any patient');
            $access = $access || $patient->uid == $user->uid && user_access('patient resource delete own patients');
            break;
    }
    $access = TRUE;

    return $access;
}