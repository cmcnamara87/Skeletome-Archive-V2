<?php
// groupresource.inc
/**
 * Callback for creating group resources.
 *
 * @param object $data
 * @return object
 */
function _groupresource_share_create($data) {
    global $user;
    if (isset($data) &&  is_array($data)) $data=(object) $data;
    unset($data->id);
    $data->uid = $user->uid;
    $data->created = time();
    $data->modified = time();

    share_save($data);
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
function _groupresource_share_update($id, $data) {
    $group = share_load($id);

    unset($data->created);
    $data->id = $id;
    $data->uid = $group->uid;
    $data->modified = time();

    share_save($data);
}
/**
 * Callback for retrieving group resources.
 *
 * @param int $id
 * @return object
 */
function _groupresource_share_retrieve($id) {
    $data = share_load($id);
    return $data;
}

/**
 * Callback for deleting group resources.
 *
 * @param int $id
 * @return object
 */
function _groupresource_share_delete($id) {

    share_delete($id);

    return (object)array(
        'id' => $id,
    );
}

I
function _groupresource_share_index($page, $fields, $parameters, $page_size) {
    if(isset($parameters['id'])) {
        $parameters['id'] = shares_filter_accessible($parameters['id']);
    } else {
        $parameters['id'] = shares_accessible();
    }

    return resource_helper_index('share', $page, $fields, $parameters, $page_size);
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


function _groupresource_share_access($op, $args=array()) {
    global $user;
    $access = FALSE;

    if(isset($args[0])) {
        $share = share_load($args[0]);
    }

    switch ($op) {
        case 'view':
            $access = user_access('view shares') && patients_is_accessible($share->patient_id);
            break;
        case 'index':
            $access = user_access('view shares');
            break;
        case 'update':
            $access = user_access('update shares') && patients_is_accessible($share->patient_id);
            break;
        case 'delete':
            $access = user_access('delete shares') && patients_is_accessible($share->patient_id);
            break;
        case 'create':
            $access = user_access('create shares');
            break;
    }

    return $access;
}
