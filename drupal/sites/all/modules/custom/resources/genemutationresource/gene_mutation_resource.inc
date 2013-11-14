<?php
// groupresource.inc
/**
 * Callback for creating group resources.
 *
 * @param object $data
 * @return object
 */
function _gene_mutation_resource_create($data) {
    global $user;
    if (isset($data) &&  is_array($data)) $data=(object) $data;
    unset($data->id);
    $data->uid = $user->uid;
    $data->created = time();
    $data->modified = time();

    gene_mutation_save($data);

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
function _gene_mutation_resource_update($id, $data) {
    $group = gene_mutation_load($id);

    unset($data->created);
    $data->id = $id;
    $data->uid = $group->uid;
    $data->modified = time();

    gene_mutation_save($data);


    return (object)$data;

}

/**
 * Callback for retrieving group resources.
 *
 * @param int $id
 * @return object
 */
function _gene_mutation_resource_retrieve($id) {
    $membership = gene_mutation_load($id);

    return $membership;
}

/**
 * Callback for deleting group resources.
 *
 * @param int $id
 * @return object
 */
function _gene_mutation_resource_delete($id) {
    return gene_mutation_delete($id);
}


function _gene_mutation_resource_index($page, $fields, $parameters, $page_size) {
    return resource_helper_index('gene_mutation', $page, $fields, $parameters, $page_size);
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

function _gene_mutation_resource_access($op, $args) {
    global $user;
    $access = FALSE;

    switch ($op) {
        case 'view':
            $group = gene_mutation_load($args[0]);
            $access = user_access('group resource view any group');
            $access = $access || $group->uid == $user->uid && user_access('group resource view own groups');
            break;
        case 'update':
            $group = gene_mutation_load($args[0]->id);
            $access = user_access('group resource edit any group');
            $access = $access || $group->uid == $user->uid && user_access('group resource edit own groups');
            break;
        case 'delete':
            $group = gene_mutation_load($args[0]);
            $access = user_access('group resource delete any group');
            $access = $access || $group->uid == $user->uid && user_access('group resource delete own groups');
            break;
    }
    $access = TRUE;
    return $access;
}