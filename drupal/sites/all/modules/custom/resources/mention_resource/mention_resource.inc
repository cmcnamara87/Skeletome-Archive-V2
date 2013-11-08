<?php
// mention_resource.inc
/**
 * Callback for creating mention resources.
 *
 * @param object $data
 * @return object
 */
function _mention_resource_create($data) {
    global $user;
    if (isset($data) &&  is_array($data)) $data=(object) $data;
    unset($data->id);
    $data->uid = $user->uid;
    $data->created = time();
    $data->modified = time();

    mention_save($data);

    return (object)$data;
}

// mention_resource.inc
/**
 * Callback for updating mention resources.
 *
 * @param int $id
 * @param object $data
 * @return object
 */
function _mention_resource_update($id, $data) {

    global $user;
    $mention = mention_load($id);

    unset($data->created);
    $data->id = $id;
    $data->uid = $mention->uid;
    $data->modified = time();

    mention_save($data);

    return (object)$data;
}
/**
 * Callback for retrieving mention resources.
 *
 * @param int $id
 * @return object
 */
function _mention_resource_retrieve($id) {

    return mention_load($id);
}

/**
 * Callback for deleting mention resources.
 *
 * @param int $id
 * @return object
 */
function _mention_resource_delete($id) {
    mention_delete($id);

    return (object)array(
        'id' => $id,
    );
}



function _mention_resource_index($page, $fields, $parameters, $page_size) {
    return resource_helper_index('mention', $page, $fields, $parameters, $page_size);
}


/**
 * Access callback for the mention resource.
 *
 * @param string $op
 *  The operation that's going to be performed.
 * @param array $args
 *  The arguments that will be passed to the callback.
 * @return bool
 *  Whether access is given or not.
 */

function _mention_resource_access($op, $args) {
    global $user;
    $access = FALSE;

    switch ($op) {
        case 'view':
            $mention = mention_load($args[0]);
            $access = user_access('mention resource view any mention');
            $access = $access || $mention->uid == $user->uid && user_access('mention resource view own mentions');
            break;
        case 'update':
            $mention = mention_load($args[0]->id);
            $access = user_access('mention resource edit any mention');
            $access = $access || $mention->uid == $user->uid && user_access('mention resource edit own mentions');
            break;
        case 'delete':
            $mention = mention_load($args[0]);
            $access = user_access('mention resource delete any mention');
            $access = $access || $mention->uid == $user->uid && user_access('mention resource delete own mentions');
            break;
    }
    $access = TRUE;

    return $access;
}