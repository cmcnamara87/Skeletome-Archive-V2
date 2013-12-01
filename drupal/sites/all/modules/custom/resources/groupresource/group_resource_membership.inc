<?php
// groupresource.inc
/**
 * Callback for creating group resources.
 *
 * @param object $data
 * @return object
 */
function _groupresource_membership_create($data) {
    global $user;
    if (isset($data) &&  is_array($data)) $data=(object) $data;
    unset($data->id);
    $data->uid = $user->uid;
    $data->created = time();
    $data->modified = time();

    // Check if a share exists
    $sql = "SELECT *
            FROM members
            WHERE group_id = :group_id
            AND user_id = :user_id";
    $result = db_query($sql, array(
        "group_id" => $data->group_id,
        "user_id" => $data->user_id,
    ));
    $exists = $result->rowCount();
    if($exists) {
        return services_error("Membership already exists", 406);
    }

    membership_save($data);
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
function _groupresource_membership_update($id, $data) {
    $group = membership_load($id);

    unset($data->created);
    $data->id = $id;
    $data->uid = $group->uid;
    $data->modified = time();


    group_save($data);
}
/**
 * Callback for retrieving group resources.
 *
 * @param int $id
 * @return object
 */
function _groupresource_membership_retrieve($id) {
    $membership = membership_load($id);

    return $membership;
}

/**
 * Callback for deleting group resources.
 *
 * @param int $id
 * @return object
 */
function _groupresource_membership_delete($id) {
    // Delete all shares
    $sql = "SELECT shares.id
            FROM shares, members
            WHERE members.id = :id
            AND shares.group_id = members.group_id
            AND shares.uid = members.user_id";
    $result = db_query($sql, array(
        "id" => $id
    ));
    $share_ids = array_keys($result->fetchAllAssoc('id'));
    foreach($share_ids as $share_id) {
        share_delete($share_id);
    }

    return membership_delete($id);
}


function _groupresource_membership_index($page, $fields, $parameters, $page_size) {
    return resource_helper_index('membership', $page, $fields, $parameters, $page_size);
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
function _groupresource_membership_access($op, $args=array()) {
    global $user;
    $access = FALSE;

    switch ($op) {
        case 'view':
            $access = user_access('view memberships');
            break;
        case 'index':
            $access = user_access('view memberships');
            break;
        case 'update':
            $access = user_access('update memberships');
            break;
        case 'delete':
            $access = user_access('delete memberships');
            break;
        case 'create':
            $access = user_access('create memberships');
            break;
    }

    return $access;
}
