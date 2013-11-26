<?php
// groupresource.inc
/**
 * Callback for creating group resources.
 *
 * @param object $data
 * @return object
 */
function _post_resource_vote_create($data) {
    global $user;
    if (isset($data) &&  is_array($data)) $data=(object) $data;
    unset($data->id);
    $data->uid = $user->uid;
    $data->created = time();
    $data->modified = time();

    vote_save($data);

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
function _post_resource_vote_update($id, $data) {
    $group = vote_load($id);

    unset($data->created);
    $data->id = $id;
    $data->uid = $group->uid;
    $data->modified = time();

    vote_save($data);
}
/**
 * Callback for retrieving group resources.
 *
 * @param int $id
 * @return object
 */
function _post_resource_vote_retrieve($id) {
    $membership = vote_load($id);

    return $membership;
}

/**
 * Callback for deleting group resources.
 *
 * @param int $id
 * @return object
 */
function _post_resource_vote_delete($id) {
    return vote_delete($id);
}


function _post_resource_vote_index($page, $fields, $parameters, $page_size) {
    $parameters['post_id'] = posts_filter_accessible($parameters['post_id']);
    return resource_helper_index('vote', $page, $fields, $parameters, $page_size);
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
function _post_resource_vote_access($op, $args=array()) {
    global $user;
    $access = FALSE;

    if(isset($args[0])) {
        $vote = vote_load($args[0]);
    }
    switch ($op) {
        case 'view':
            $access = user_access('view votes') && posts_is_accessible($vote->post_id);
            break;
        case 'index':
            $access = user_access('view votes');
            break;
        case 'update':
            $access = user_access('update votes') && posts_is_accessible($vote->post_id);
            break;
        case 'delete':
            $access = user_access('delete votes') && posts_is_accessible($vote->post_id);
            break;
        case 'create':
            $access = user_access('create votes');
            break;
    }

    return $access;
}
