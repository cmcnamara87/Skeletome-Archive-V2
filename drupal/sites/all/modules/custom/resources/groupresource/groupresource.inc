<?php
// groupresource.inc
/**
 * Callback for creating group resources.
 *
 * @param object $data
 * @return object
 */
function _groupresource_create($data) {
    global $user;
    if (isset($data) &&  is_array($data)) $data=(object) $data;
    unset($data->id);
    $data->uid = $user->uid;
    $data->created = time();
    $data->modified = time();

//
//    if (!isset($data->subject)) {
//        return services_error('Missing group attribute subject', 406);
//    }
//
//    if (!isset($data->group)) {
//        return services_error('Missing group attribute group', 406);
//    }

    group_save($data);

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
function _groupresource_update($id, $data) {
    global $user;
    $group = group_load($id);

    unset($data->created);
    $data->id = $id;
    $data->uid = $group->uid;
    $data->modified = time();

    group_save($data);

    return $data;
}
/**
 * Callback for retrieving group resources.
 *
 * @param int $id
 * @return object
 */
function _groupresource_retrieve($id) {
    return group_load($id);
}

/**
 * Callback for deleting group resources.
 *
 * @param int $id
 * @return object
 */
function _groupresource_delete($id) {
    group_delete($id);

    return (object)array(
        'id' => $id,
    );
}

function _groupresource_index($page, $fields, $parameters, $page_size) {

    return resource_helper_index('group', $page, $fields, $parameters, $page_size);
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

function _groupresource_access($op, $args) {
    global $user;
    $access = FALSE;

    switch ($op) {
        case 'view':
            $group = group_load($args[0]);
            $access = user_access('group resource view any group');
            $access = $access || $group->uid == $user->uid && user_access('group resource view own groups');
            break;
        case 'update':
            $group = group_load($args[0]->id);
            $access = user_access('group resource edit any group');
            $access = $access || $group->uid == $user->uid && user_access('group resource edit own groups');
            break;
        case 'delete':
            $group = group_load($args[0]);
            $access = user_access('group resource delete any group');
            $access = $access || $group->uid == $user->uid && user_access('group resource delete own groups');
            break;
    }
    $access = TRUE;

    return $access;
}