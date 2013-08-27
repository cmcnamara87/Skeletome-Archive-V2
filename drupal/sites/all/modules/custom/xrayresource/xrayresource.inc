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
    $group = xray_load($id);

    unset($data->created);
    $data->id = $id;
    $data->uid = $group->uid;
    $data->modified = time();

    $data->user = user_load($data->user_id);
    $data->group = xray_load($data->xray_id);

    xray_save($data);
}
/**
 * Callback for retrieving group resources.
 *
 * @param int $id
 * @return object
 */
function _xray_resource_retrieve($id) {
    $membership = xray_load($id);

    $membership->user = user_load($membership->user_id);
    unset($membership->user->pass);
    $membership->group = xray_load($membership->xray_id);

    return $membership;
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

    $query = new EntityFieldQuery();

    $query->entityCondition('entity_type', 'xray');

    foreach($parameters as $parameter => $value) {
        $query->propertyCondition($parameter, $value);
    }
    $query->range($page * $page_size, $page_size);
    $result = $query->execute();
    $ids = array_keys($result['xray']);

    return xray_load_multiple($ids);
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

function _xray_resource_access($op, $args) {
    global $user;
    $access = FALSE;

    switch ($op) {
        case 'view':
            $group = xray_load($args[0]);
            $access = user_access('group resource view any group');
            $access = $access || $group->uid == $user->uid && user_access('group resource view own groups');
            break;
        case 'update':
            $group = xray_load($args[0]->id);
            $access = user_access('group resource edit any group');
            $access = $access || $group->uid == $user->uid && user_access('group resource edit own groups');
            break;
        case 'delete':
            $group = xray_load($args[0]);
            $access = user_access('group resource delete any group');
            $access = $access || $group->uid == $user->uid && user_access('group resource delete own groups');
            break;
    }
    $access = TRUE;

    return $access;
}