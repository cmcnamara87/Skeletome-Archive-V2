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

// post_resource.inc
/**
 * Callback for updating post resources.
 *
 * @param int $id
 * @param object $data
 * @return object
 */
function _post_resource_update($id, $data) {
    global $user;
    $post = post_load($id);

    unset($data->created);
    $data->id = $id;
    $data->uid = $post->uid;
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

function _post_resource_access($op, $args) {
    global $user;
    $access = FALSE;

    switch ($op) {
        case 'view':
            $post = post_load($args[0]);
            $access = user_access('post resource view any post');
            $access = $access || $post->uid == $user->uid && user_access('post resource view own posts');
            break;
        case 'update':
            $post = post_load($args[0]->id);
            $access = user_access('post resource edit any post');
            $access = $access || $post->uid == $user->uid && user_access('post resource edit own posts');
            break;
        case 'delete':
            $post = post_load($args[0]);
            $access = user_access('post resource delete any post');
            $access = $access || $post->uid == $user->uid && user_access('post resource delete own posts');
            break;
    }
    $access = TRUE;

    return $access;
}