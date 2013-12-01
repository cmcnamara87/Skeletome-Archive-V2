<?php
// groupresource.inc
/**
 * Callback for creating group resources.
 *
 * @param object $data
 * @return object
 */
function _xray_resource_create($data) {
    global $user;
    if (isset($data) &&  is_array($data)) $data=(object) $data;
    unset($data->id);
    $data->uid = $user->uid;
    $data->created = time();
    $data->modified = time();

    xray_save($data);

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
function _xray_resource_update($id, $data) {
    global $user;
    if (isset($data) &&  is_array($data)) $data=(object) $data;

    unset($data->created);
    $data->id = $id;
    $data->uid = $user->uid;
    $data->modified = time();
    xray_save($data);

    return (object)$data;
}
/**
 * Callback for retrieving group resources.
 *
 * @param int $id
 * @return object
 */
function _xray_resource_retrieve($id) {
    $xray = xray_load($id);

    return $xray;
}

/**
 * Callback for deleting group resources.
 *
 * @param int $id
 * @return object
 */
function _xray_resource_delete($id) {
    return xray_delete($id);
}


function _xray_resource_index($page, $fields, $parameters, $page_size) {
    return resource_helper_index('xray', $page, $fields, $parameters, $page_size);
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

function _xray_resource_access($op, $args=array()) {
    global $user;
    $access = FALSE;

    if(isset($args[0])) {
        $xray = xray_load($args[0]);
    }
    switch ($op) {
        case 'view':
            $access = user_access('view patients') && patients_is_accessible($xray->patient_id);
            break;
        case 'index':
            $access = user_access('view patients');
            break;
        case 'update':
            $access = user_access('update patients') && patients_is_accessible($xray->patient_id);
            break;
        case 'delete':
            $access = user_access('delete patients') && patients_is_accessible($xray->patient_id);
            break;
        case 'create':
            $access = user_access('create patients');
            break;
    }

    return $access;
}