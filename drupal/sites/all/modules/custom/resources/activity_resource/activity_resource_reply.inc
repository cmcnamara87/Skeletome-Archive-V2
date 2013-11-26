<?php
// activity_resource.inc
/**
 * Callback for creating patient resources.
 *
 * @param object $data
 * @return object
 */
function _activity_resource_reply_create($data) {
    global $user;
    if (isset($data) &&  is_array($data)) $data=(object) $data;
    unset($data->id);
    $data->uid = $user->uid;
    $data->created = time();
    $data->modified = time();

    reply_save($data);

    return (object)$data;
}

// activity_resource.inc
/**
 * Callback for updating patient resources.
 *
 * @param int $id
 * @param object $data
 * @return object
 */
function _activity_resource_reply_update($id, $data) {

    global $user;
    $patient = reply_load($id);

    unset($data->created);
    $data->id = $id;
    $data->uid = $patient->uid;
    $data->modified = time();

    reply_save($data);

    return (object)$data;
}
/**
 * Callback for retrieving patient resources.
 *
 * @param int $id
 * @return object
 */
function _activity_resource_reply_retrieve($id) {

    return reply_load($id);
}

/**
 * Callback for deleting patient resources.
 *
 * @param int $id
 * @return object
 */
function _activity_resource_reply_delete($id) {
    reply_delete($id);

    return (object)array(
        'id' => $id,
    );
}



function _activity_resource_reply_index($page, $fields, $parameters, $page_size) {

    $accessible_share_ids = shares_accessible();
    if(count($accessible_share_ids)) {
        $accessible_share_ids_string = implode(",", shares_accessible());

        $sql = "SELECT replies.id
            FROM replies, activities
            WHERE replies.activity_id = activities.id
            AND activities.share_id IN ($accessible_share_ids_string)";
        $result = db_query($sql);
        $reply_ids = array_keys($result->fetchAllAssoc('id'));
        $parameters['id'] = $reply_ids;

        return resource_helper_index('reply', $page, $fields, $parameters, $page_size);
    } else {
        return array();
    }
}



/**
 * Access callback for the activity resource.
 *
 * @param string $op
 *  The operation that's going to be performed.
 * @param array $args
 *  The arguments that will be passed to the callback.
 * @return bool
 *  Whether access is given or not.
 */
function _activity_resource_reply_access($op, $args=array()) {
    global $user;
    $access = FALSE;

    if($args[0]) {
        $reply = reply_load($args[0]);
        $activity = activity_load($reply->activity_id);
    }

    switch ($op) {
        case 'view':
            $access = user_access('view replies') && shares_is_accessible($activity->share_id);
            break;
        case 'index':
            $access = user_access('view replies');
            break;
        case 'update':
            $access = user_access('update replies') && shares_is_accessible($activity->share_id);
            break;
        case 'delete':
            $access = user_access('delete replies') && shares_is_accessible($activity->share_id);
            break;
        case 'create':
            $access = user_access('create replies');
            break;
    }

    return $access;
}