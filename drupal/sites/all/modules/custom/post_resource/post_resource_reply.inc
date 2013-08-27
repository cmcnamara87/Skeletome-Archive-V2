<?php
// reply_resource.inc
/**
 * Callback for creating reply resources.
 *
 * @param object $data
 * @return object
 */
function _post_resource_reply_create($data) {
    global $user;
    if (isset($data) &&  is_array($data)) $data=(object) $data;
    unset($data->id);
    $data->uid = $user->uid;
    $data->created = time();
    $data->modified = time();

    reply_save($data);

    return (object)$data;
}

// reply_resource.inc
/**
 * Callback for updating reply resources.
 *
 * @param int $id
 * @param object $data
 * @return object
 */
function _post_resource_reply_update($id, $data) {
    global $user;
    $reply = reply_load($id);

    unset($data->created);
    $data->id = $id;
    $data->uid = $reply->uid;
    $data->modified = time();

    reply_save($data);

    return (object)$data;
}
/**
 * Callback for retrieving reply resources.
 *
 * @param int $id
 * @return object
 */
function _post_resource_reply_retrieve($id) {
    return reply_load($id);
}

/**
 * Callback for deleting reply resources.
 *
 * @param int $id
 * @return object
 */
function _post_resource_reply_delete($id) {
    reply_delete($id);

    return (object)array(
        'id' => $id,
    );
}

function _post_resource_reply_index($page, $fields, $parameters, $page_size) {
    $query = new EntityFieldQuery();

    $query->entityCondition('entity_type', 'reply');

    foreach($parameters as $parameter => $value) {
        $query->propertyCondition($parameter, $value);
    }
    $query->range($page * $page_size, $page_size);
    $result = $query->execute();
    $ids = array_keys($result['reply']);

    return reply_load_multiple($ids);
}

/**
 * Access callback for the reply resource.
 *
 * @param string $op
 *  The operation that's going to be performed.
 * @param array $args
 *  The arguments that will be passed to the callback.
 * @return bool
 *  Whether access is given or not.
 */

function _post_resource_reply_access($op, $args) {
    global $user;
    $access = FALSE;

    switch ($op) {
        case 'view':
            $reply = reply_load($args[0]);
            $access = user_access('reply resource view any reply');
            $access = $access || $reply->uid == $user->uid && user_access('reply resource view own replys');
            break;
        case 'update':
            $reply = reply_load($args[0]->id);
            $access = user_access('reply resource edit any reply');
            $access = $access || $reply->uid == $user->uid && user_access('reply resource edit own replys');
            break;
        case 'delete':
            $reply = reply_load($args[0]);
            $access = user_access('reply resource delete any reply');
            $access = $access || $reply->uid == $user->uid && user_access('reply resource delete own replys');
            break;
    }
    $access = TRUE;

    return $access;
}