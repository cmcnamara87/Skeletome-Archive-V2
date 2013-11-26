<?php
// post_resource.inc
/**
 * Callback for creating post resources.
 *
 * @param object $data
 * @return object
 */
function _post_resource_create($data) {
    global $user;
    if (isset($data) &&  is_array($data)) $data=(object) $data;
    unset($data->id);
    $data->uid = $user->uid;
    $data->created = time();
    $data->modified = time();

    post_save($data);

    return (object)$data;
}

/**
 * Callback for retrieving post resources.
 *
 * @param int $id
 * @return object
 */
function _post_resource_retrieve($id) {
    return post_load($id);
}

/**
 * Callback for deleting post resources.
 *
 * @param int $id
 * @return object
 */
function _post_resource_delete($id) {
    post_delete($id);

    return (object)array(
        'id' => $id,
    );
}

function _post_resource_index($page, $fields, $parameters, $page_size) {
    $parameters['share_id'] = shares_filter_accessible($parameters['share_id']);
    return resource_helper_index('post', $page, $fields, $parameters, $page_size);
}

/**
 * Access callback for the post resource.
 *
 * @param string $op
 *  The operation that's going to be performed.
 * @param array $args
 *  The arguments that will be passed to the callback.
 * @return bool
 *  Whether access is given or not.
 */
function _post_resource_access($op, $args=array()) {
    global $user;
    $access = FALSE;

    if(isset($args[0])) {
        $post = post_load($args[0]);
    }

    switch ($op) {
        case 'view':
            $access = user_access('view posts') && shares_is_accessible($post->share_id);
            break;
        case 'index':
            $access = user_access('view posts');
            break;
        case 'update':
            $access = user_access('update posts') && shares_is_accessible($post->share_id);
            break;
        case 'delete':
            $access = user_access('delete posts') && shares_is_accessible($post->share_id);
            break;
        case 'create':
            $access = user_access('create patients');
            break;
    }

    return $access;
}
