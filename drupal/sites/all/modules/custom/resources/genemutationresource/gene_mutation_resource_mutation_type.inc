<?php
// groupresource.inc
/**
 * Callback for creating group resources.
 *
 * @param object $data
 * @return object
 */
function _gene_mutation_resource_mutation_type_create($data) {
    global $user;
    if (isset($data) &&  is_array($data)) $data=(object) $data;
    unset($data->id);
    $data->uid = $user->uid;
    $data->created = time();
    $data->modified = time();

    mutation_type_save($data);

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
function _gene_mutation_resource_mutation_type_update($id, $data) {
    $group = mutation_type_load($id);

    unset($data->created);
    $data->id = $id;
    $data->uid = $group->uid;
    $data->modified = time();

    mutation_type_save($data);
}

/**
 * Callback for retrieving group resources.
 *
 * @param int $id
 * @return object
 */
function _gene_mutation_resource_mutation_type_retrieve($id) {
    $membership = mutation_type_load($id);

    return $membership;
}

/**
 * Callback for deleting group resources.
 *
 * @param int $id
 * @return object
 */
function _gene_mutation_resource_mutation_type_delete($id) {
    return mutation_type_delete($id);
}


function _gene_mutation_resource_mutation_type_index($page, $fields, $parameters, $page_size) {
    return resource_helper_index('mutation_type', $page, $fields, $parameters, $page_size);
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

function _gene_mutation_resource_mutation_type_access($op, $args) {
    global $user;
    $access = TRUE;
    return $access;
}