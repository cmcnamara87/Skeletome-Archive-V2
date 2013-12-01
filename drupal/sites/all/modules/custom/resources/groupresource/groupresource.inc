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
    if (isset($data) &&  is_array($data)) $data=(object) $data;
    unset($data->created);
    $data->id = $id;
    $data->uid = $user->uid;
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

    // Delete all memberships
    $sql = "SELECT members.id
            FROM members
            WHERE group_id = :id";
    $result = db_query($sql, array(
        "id" => $id
    ));
    $membership_ids = array_keys($result->fetchAllAssoc('id'));
    foreach($membership_ids as $membership_id) {
        membership_delete($membership_id);
    }

    // Delete all shares
    $sql = "SELECT shares.id
            FROM shares
            WHERE group_id = :id";
    $result = db_query($sql, array(
        "id" => $id
    ));
    $share_ids = array_keys($result->fetchAllAssoc('id'));
    foreach($share_ids as $share_id) {
        share_delete($share_id);
    }

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

function _groupresource_access($op, $args=array()) {
    global $user;
    $access = FALSE;

    switch ($op) {
        case 'view':
            $access = user_access('view groups');
            break;
        case 'index':
            $access = user_access('view groups');
            break;
        case 'update':
            $access = user_access('update groups');
            break;
        case 'delete':
            $access = user_access('delete groups');
            break;
        case 'create':
            $access = user_access('create groups');
            break;
    }

    return $access;
}