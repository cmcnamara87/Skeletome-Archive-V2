<?php
// tag_post_resource.inc
/**
 * Callback for creating tag_post resources.
 *
 * @param object $data
 * @return object
 */
function _tag_resource_tag_post_create($data) {
    global $user;
    if (isset($data) &&  is_array($data)) $data=(object) $data;
    unset($data->id);
    $data->uid = $user->uid;
    $data->created = time();
    $data->modified = time();

    tag_post_save($data);

    return (object)$data;
}

// tag_post_resource.inc
/**
 * Callback for updating tag_post resources.
 *
 * @param int $id
 * @param object $data
 * @return object
 */
function _tag_resource_tag_post_update($id, $data) {

    global $user;
    $tag_post = tag_post_load($id);

    unset($data->created);
    $data->id = $id;
    $data->uid = $tag_post->uid;
    $data->modified = time();

    tag_post_save($data);

    return (object)$data;
}
/**
 * Callback for retrieving tag_post resources.
 *
 * @param int $id
 * @return object
 */
function _tag_resource_tag_post_retrieve($id) {

    return tag_post_load($id);
}

/**
 * Callback for deleting tag_post resources.
 *
 * @param int $id
 * @return object
 */
function _tag_resource_tag_post_delete($id) {
    tag_post_delete($id);

    return (object)array(
        'id' => $id,
    );
}

function _tag_resource_tag_post_index($page, $fields, $parameters, $page_size) {
    return resource_helper_index('tag_post', $page, $fields, $parameters, $page_size);
}


/**
 * Access callback for the tag_post resource.
 *
 * @param string $op
 *  The operation that's going to be performed.
 * @param array $args
 *  The arguments that will be passed to the callback.
 * @return bool
 *  Whether access is given or not.
 */

function _tag_resource_tag_post_access($op, $args) {
    global $user;
    $access = FALSE;

    switch ($op) {
        case 'view':
            $tag_post = tag_post_load($args[0]);
            $access = user_access('tag_post resource view any tag_post');
            $access = $access || $tag_post->uid == $user->uid && user_access('tag_post resource view own tag_posts');
            break;
        case 'update':
            $tag_post = tag_post_load($args[0]->id);
            $access = user_access('tag_post resource edit any tag_post');
            $access = $access || $tag_post->uid == $user->uid && user_access('tag_post resource edit own tag_posts');
            break;
        case 'delete':
            $tag_post = tag_post_load($args[0]);
            $access = user_access('tag_post resource delete any tag_post');
            $access = $access || $tag_post->uid == $user->uid && user_access('tag_post resource delete own tag_posts');
            break;
    }
    $access = TRUE;

    return $access;
}