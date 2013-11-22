<?php
// groupresource.inc

function _diagnosis_resource_disorder_info($id) {
    // todo: go to knowledge here
    $disorder = disorder_load($id);

    file_get_contents("http://knowledge.skeletome.org/api/bd?uri=");
//    http://localhost:8888/drupalv2/api/bd?uri=http%3A%2F%2Fpurl.org%2Fskeletome%2Fbonedysplasia%23Calcium_pyrophosphate_deposition_disease_type_2

}

/**
 * Callback for creating group resources.
 *
 * @param object $data
 * @return object
 */
function _diagnosis_resource_disorder_create($data) {
    global $user;
    if (isset($data) &&  is_array($data)) $data=(object) $data;
    unset($data->id);
    $data->uid = $user->uid;
    $data->created = time();
    $data->modified = time();

    diagnosis_save($data);

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
function _diagnosis_resource_disorder_update($id, $data) {
    $group = disorder_load($id);

    unset($data->created);
    $data->id = $id;
    $data->uid = $group->uid;
    $data->modified = time();

    group_save($data);
}
/**
 * Callback for retrieving group resources.
 *
 * @param int $id
 * @return object
 */
function _diagnosis_resource_disorder_retrieve($id) {
    $disorder = disorder_load($id);
    return $disorder;
}

/**
 * Callback for deleting group resources.
 *
 * @param int $id
 * @return object
 */
function _diagnosis_resource_disorder_delete($id) {
    return disorder_delete($id);
}


function _diagnosis_resource_disorder_index($page, $fields, $parameters, $page_size) {
    return resource_helper_index('disorder', $page, $fields, $parameters, $page_size);
}


// http://localhost:8888/drupalv2/api/bd?uri=http%3A%2F%2Fpurl.org%2Fskeletome%2Fbonedysplasia%23Calcium_pyrophosphate_deposition_disease_type_2
// http://localhost:8888/drupalv2/api/bd?uri=http%3A%2F%2Fpurl.org%2Fskeletome%2Fbonedysplasia%23Calcium_pyrophosphate_deposition_disease_type_2

function _diagnosis_resource_disorder_description($id) {
    $disorder = disorder_load($id);
    $url = "http://localhost:8888/drupalv2/api/bd?uri=" . urlencode($disorder->uri);
    $description = json_decode(file_get_contents($url));

    return $description;
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

function _diagnosis_resource_disorder_access($op, $args) {
    global $user;
    $access = FALSE;

    switch ($op) {
        case 'view':
            $group = disorder_load($args[0]);
            $access = user_access('group resource view any group');
            $access = $access || $group->uid == $user->uid && user_access('group resource view own groups');
            break;
        case 'update':
            $group = disorder_load($args[0]->id);
            $access = user_access('group resource edit any group');
            $access = $access || $group->uid == $user->uid && user_access('group resource edit own groups');
            break;
        case 'delete':
            $group = disorder_load($args[0]);
            $access = user_access('group resource delete any group');
            $access = $access || $group->uid == $user->uid && user_access('group resource delete own groups');
            break;
    }
    $access = TRUE;

    return $access;
}