<?php
// tag_patient_resource.inc
/**
 * Callback for creating tag_patient resources.
 *
 * @param object $data
 * @return object
 */
function _tag_resource_tag_post_create($data) {
    global $user;
    if (isset($data) &&  is_array($data)) $data=(object) $data;
    unset($data->id);
    $data->uid = $user->uid;
    $data->created = time();
    $data->modified = time();

    tag_patient_save($data);

    
    
    return (object)$data;
}

// tag_patient_resource.inc
/**
 * Callback for updating tag_patient resources.
 *
 * @param int $id
 * @param object $data
 * @return object
 */
function _tag_resource_tag_post_update($id, $data) {

    global $user;
    $tag_patient = tag_patient_load($id);

    unset($data->created);
    $data->id = $id;
    $data->uid = $tag_patient->uid;
    $data->modified = time();

    tag_patient_save($data);

    return (object)$data;
}
/**
 * Callback for retrieving tag_patient resources.
 *
 * @param int $id
 * @return object
 */
function _tag_resource_tag_post_retrieve($id) {

    return tag_patient_load($id);
}

/**
 * Callback for deleting tag_patient resources.
 *
 * @param int $id
 * @return object
 */
function _tag_resource_tag_post_delete($id) {
    tag_patient_delete($id);

    return (object)array(
        'id' => $id,
    );
}



function _tag_resource_tag_post_index($page, $fields, $parameters, $page_size) {
    return resource_helper_index('tag_patient', $page, $fields, $parameters, $page_size);
}


/**
 * Access callback for the tag_patient resource.
 *
 * @param string $op
 *  The operation that's going to be performed.
 * @param array $args
 *  The arguments that will be passed to the callback.
 * @return bool
 *  Whether access is given or not.
 */

function _tag_resource_tag_post_access($op, $args) {
    global $user;
    $access = FALSE;

    switch ($op) {
        case 'view':
            $tag_patient = tag_patient_load($args[0]);
            $access = user_access('tag_patient resource view any tag_patient');
            $access = $access || $tag_patient->uid == $user->uid && user_access('tag_patient resource view own tag_patients');
            break;
        case 'update':
            $tag_patient = tag_patient_load($args[0]->id);
            $access = user_access('tag_patient resource edit any tag_patient');
            $access = $access || $tag_patient->uid == $user->uid && user_access('tag_patient resource edit own tag_patients');
            break;
        case 'delete':
            $tag_patient = tag_patient_load($args[0]);
            $access = user_access('tag_patient resource delete any tag_patient');
            $access = $access || $tag_patient->uid == $user->uid && user_access('tag_patient resource delete own tag_patients');
            break;
    }
    $access = TRUE;

    return $access;
}