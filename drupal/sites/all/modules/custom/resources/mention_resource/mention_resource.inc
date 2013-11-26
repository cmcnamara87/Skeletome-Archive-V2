<?php
// mention_resource.inc
/**
 * Callback for retrieving mention resources.
 *
 * @param int $id
 * @return object
 */
function _mention_resource_retrieve($id) {
    return mention_load($id);
}

function _mention_resource_index($page, $fields, $parameters, $page_size) {
    return resource_helper_index('mention', $page, $fields, $parameters, $page_size);
}


/**
 * Access callback for the mention resource.
 *
 * @param string $op
 *  The operation that's going to be performed.
 * @param array $args
 *  The arguments that will be passed to the callback.
 * @return bool
 *  Whether access is given or not.
 */

function _mention_resource_access($op, $args) {
    global $user;
    $access = true;

    return $access;
}