<?php
// hpo_resource.inc

/**
 * Callback for retrieving hpo resources.
 *
 * @param int $id
 * @return object
 */
function _hpo_resource_retrieve($id) {

    return hpo_load($id);
}


function _hpo_resource_index($page, $fields, $parameters, $page_size) {
    return resource_helper_index('hpo', $page, $fields, $parameters, $page_size);
}


/**
 * Access callback for the hpo resource.
 *
 * @param string $op
 *  The operation that's going to be performed.
 * @param array $args
 *  The arguments that will be passed to the callback.
 * @return bool
 *  Whether access is given or not.
 */

function _hpo_resource_access($op, $args=array()) {
    return true;
}
