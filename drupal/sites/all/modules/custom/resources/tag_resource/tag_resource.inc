<?php
// tag_resource.inc
/**
 * Callback for creating tag resources.
 *
 * @param object $data
 * @return object
 */
function _tag_resource_create($data) {
    global $user;
    if (isset($data) &&  is_array($data)) $data=(object) $data;
    unset($data->id);
    $data->uid = $user->uid;
    $data->created = time();
    $data->modified = time();

    tag_save($data);

    return (object)$data;
}

// tag_resource.inc
/**
 * Callback for updating tag resources.
 *
 * @param int $id
 * @param object $data
 * @return object
 */
function _tag_resource_update($id, $data) {

    global $user;
    $tag = tag_load($id);

    unset($data->created);
    $data->id = $id;
    $data->uid = $tag->uid;
    $data->modified = time();

    tag_save($data);

    return (object)$data;
}
/**
 * Callback for retrieving tag resources.
 *
 * @param int $id
 * @return object
 */
function _tag_resource_retrieve($id) {

    return tag_load($id);
}

/**
 * Callback for deleting tag resources.
 *
 * @param int $id
 * @return object
 */
function _tag_resource_delete($id) {
    tag_delete($id);

    return (object)array(
        'id' => $id,
    );
}



function _tag_resource_index($page, $fields, $parameters, $page_size) {
    return resource_helper_index('tag', $page, $fields, $parameters, $page_size);
}


/**
 * Access callback for the tag resource.
 *
 * @param string $op
 *  The operation that's going to be performed.
 * @param array $args
 *  The arguments that will be passed to the callback.
 * @return bool
 *  Whether access is given or not.
 */

function _tag_resource_access($op, $args) {
    global $user;
    $access = FALSE;

    switch ($op) {
        case 'view':
            $tag = tag_load($args[0]);
            $access = user_access('tag resource view any tag');
            $access = $access || $tag->uid == $user->uid && user_access('tag resource view own tags');
            break;
        case 'update':
            $tag = tag_load($args[0]->id);
            $access = user_access('tag resource edit any tag');
            $access = $access || $tag->uid == $user->uid && user_access('tag resource edit own tags');
            break;
        case 'delete':
            $tag = tag_load($args[0]);
            $access = user_access('tag resource delete any tag');
            $access = $access || $tag->uid == $user->uid && user_access('tag resource delete own tags');
            break;
    }
    $access = TRUE;

    return $access;
}