<?php
// pin_resource.inc
/**
 * Callback for creating pin resources.
 *
 * @param object $data
 * @return object
 */
function _pin_resource_create($data) {
    global $user;
    if (isset($data) &&  is_array($data)) $data=(object) $data;
    unset($data->id);
    $data->uid = $user->uid;
    $data->created = time();
    $data->modified = time();

    pin_save($data);

    return (object)$data;
}

// pin_resource.inc
/**
 * Callback for updating pin resources.
 *
 * @param int $id
 * @param object $data
 * @return object
 */
function _pin_resource_update($id, $data) {

    global $user;
    $pin = pin_load($id);

    unset($data->created);
    $data->id = $id;
    $data->uid = $pin->uid;
    $data->modified = time();

    pin_save($data);

    return (object)$data;
}
/**
 * Callback for retrieving pin resources.
 *
 * @param int $id
 * @return object
 */
function _pin_resource_retrieve($id) {

    return pin_load($id);
}

/**
 * Callback for deleting pin resources.
 *
 * @param int $id
 * @return object
 */
function _pin_resource_delete($id) {
    pin_delete($id);

    return (object)array(
        'id' => $id,
    );
}



function _pin_resource_index($page, $fields, $parameters, $page_size) {
    return resource_helper_index('pin', $page, $fields, $parameters, $page_size);
}


/**
 * Access callback for the pin resource.
 *
 * @param string $op
 *  The operation that's going to be performed.
 * @param array $args
 *  The arguments that will be passed to the callback.
 * @return bool
 *  Whether access is given or not.
 */

function _pin_resource_access($op, $args) {
    global $user;
    $access = FALSE;

    switch ($op) {
        case 'view':
            $pin = pin_load($args[0]);
            $access = user_access('pin resource view any pin');
            $access = $access || $pin->uid == $user->uid && user_access('pin resource view own pins');
            break;
        case 'update':
            $pin = pin_load($args[0]->id);
            $access = user_access('pin resource edit any pin');
            $access = $access || $pin->uid == $user->uid && user_access('pin resource edit own pins');
            break;
        case 'delete':
            $pin = pin_load($args[0]);
            $access = user_access('pin resource delete any pin');
            $access = $access || $pin->uid == $user->uid && user_access('pin resource delete own pins');
            break;
    }
    $access = TRUE;

    return $access;
}