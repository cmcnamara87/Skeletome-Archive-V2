<?php
// hpo_resource.inc
/**
 * Callback for creating hpo resources.
 *
 * @param object $data
 * @return object
 */
function _hpo_resource_create($data) {
    global $user;
    if (isset($data) &&  is_array($data)) $data=(object) $data;
    unset($data->id);
    $data->uid = $user->uid;
    $data->created = time();
    $data->modified = time();

    hpo_save($data);

    return (object)$data;
}

// hpo_resource.inc
/**
 * Callback for updating hpo resources.
 *
 * @param int $id
 * @param object $data
 * @return object
 */
function _hpo_resource_update($id, $data) {

    global $user;
    $hpo = hpo_load($id);

    unset($data->created);
    $data->id = $id;
    $data->uid = $hpo->uid;
    $data->modified = time();

    hpo_save($data);

    return (object)$data;
}
/**
 * Callback for retrieving hpo resources.
 *
 * @param int $id
 * @return object
 */
function _hpo_resource_retrieve($id) {

    return hpo_load($id);
}

/**
 * Callback for deleting hpo resources.
 *
 * @param int $id
 * @return object
 */
function _hpo_resource_delete($id) {
    hpo_delete($id);

    return (object)array(
        'id' => $id,
    );
}



function _hpo_resource_index($page, $fields, $parameters, $page_size) {
    return resource_helper_index('hpo', $page, $fields, $parameters, $page_size);
}


/**
 * Access callback for the hpo resource.
 *
 * @param string $op
 *  The operation that's going to be performed.
 * @param array $args
 *  The arguments that will be passed to the callback.
 * @return bool
 *  Whether access is given or not.
 */

function _hpo_resource_access($op, $args) {
    global $user;
    $access = FALSE;

    switch ($op) {
        case 'view':
            $hpo = hpo_load($args[0]);
            $access = user_access('hpo resource view any hpo');
            $access = $access || $hpo->uid == $user->uid && user_access('hpo resource view own hpos');
            break;
        case 'update':
            $hpo = hpo_load($args[0]->id);
            $access = user_access('hpo resource edit any hpo');
            $access = $access || $hpo->uid == $user->uid && user_access('hpo resource edit own hpos');
            break;
        case 'delete':
            $hpo = hpo_load($args[0]);
            $access = user_access('hpo resource delete any hpo');
            $access = $access || $hpo->uid == $user->uid && user_access('hpo resource delete own hpos');
            break;
    }
    $access = TRUE;

    return $access;
}