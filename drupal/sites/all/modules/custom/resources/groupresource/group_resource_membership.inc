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

//
//    if (!isset($data->subject)) {
//        return services_error('Missing group attribute subject', 406);
//    }
//
//    if (!isset($data->group)) {
//        return services_error('Missing group attribute group', 406);
//    }

    membership_save($data);
    $data->user = user_load($data->user_id);
    $data->group = group_load($data->group_id);

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

    $data->user = user_load($data->user_id);
    $data->group = group_load($data->group_id);

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

    $membership->user = user_load($membership->user_id);
    unset($membership->user->pass);
    $membership->group = group_load($membership->group_id);
    
    return $membership;
}

/**
 * Callback for deleting group resources.
 *
 * @param int $id
 * @return object
 */
function _groupresource_membership_delete($id) {
    return membership_delete($id);
}


function _groupresource_membership_index($page, $fields, $parameters, $page_size) {
    module_load_include('inc', 'services', 'services.module');
    $node_select = db_select('members', 't')
        ->orderBy('created', 'DESC');

    services_resource_build_index_query($node_select, $page, $fields, $parameters, $page_size, 'members');

    if (!user_access('administer nodes')) {
//        $node_select->condition('', 1);
    }

    $results = services_resource_execute_index_query($node_select);

    $list = services_resource_build_index_list($results, 'members', 'id');

    foreach($list as &$membership) {
        $membership->user = user_load($membership->user_id);
        unset($membership->user->pass);
        $membership->group = group_load($membership->group_id);
    }

    return $list;
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

function _groupresource_membership_access($op, $args) {
    global $user;
    $access = FALSE;

    switch ($op) {
        case 'view':
            $group = membership_load($args[0]);
            $access = user_access('group resource view any group');
            $access = $access || $group->uid == $user->uid && user_access('group resource view own groups');
            break;
        case 'update':
            $group = membership_load($args[0]->id);
            $access = user_access('group resource edit any group');
            $access = $access || $group->uid == $user->uid && user_access('group resource edit own groups');
            break;
        case 'delete':
            $group = membership_load($args[0]);
            $access = user_access('group resource delete any group');
            $access = $access || $group->uid == $user->uid && user_access('group resource delete own groups');
            break;
    }
    $access = TRUE;

    return $access;
}