<?php
// consentfile_resource.inc
/**
 * Callback for creating consentfile resources.
 *
 * @param object $data
 * @return object
 */
function _consent_resource_file_create($data) {
    global $user;
    if (isset($data) &&  is_array($data)) $data=(object) $data;
    unset($data->id);
    $data->uid = $user->uid;
    $data->created = time();
    $data->modified = time();

    consentfile_save($data);

    return (object)$data;
}

// consentfile_resource.inc
/**
 * Callback for updating consentfile resources.
 *
 * @param int $id
 * @param object $data
 * @return object
 */
function _consent_resource_file_update($id, $data) {
    global $user;
    $consentfile = consentfile_load($id);

    unset($data->created);
    $data->id = $id;
    $data->uid = $consentfile->uid;
    $data->modified = time();

    consentfile_save($data);

    return (object)$data;
}
/**
 * Callback for retrieving consentfile resources.
 *
 * @param int $id
 * @return object
 */
function _consent_resource_file_retrieve($id) {
    return consentfile_load($id);
}

/**
 * Callback for deleting consentfile resources.
 *
 * @param int $id
 * @return object
 */
function _consent_resource_file_delete($id) {
    consentfile_delete($id);

    return (object)array(
        'id' => $id,
    );
}

function _consent_resource_file_index($page, $fields, $parameters, $page_size) {
    $query = new EntityFieldQuery();

    $query->entityCondition('entity_type', 'consentfile');

    foreach($parameters as $parameter => $value) {
        $query->propertyCondition($parameter, $value);
    }
    $query->range($page * $page_size, $page_size);
    $result = $query->execute();
    $ids = array_keys($result['consentfile']);

    return consentfile_load_multiple($ids);
}

/**
 * Access callback for the consentfile resource.
 *
 * @param string $op
 *  The operation that's going to be performed.
 * @param array $args
 *  The arguments that will be passed to the callback.
 * @return bool
 *  Whether access is given or not.
 */

function _consent_resource_file_access($op, $args) {
    global $user;
    $access = FALSE;

    switch ($op) {
        case 'view':
            $consentfile = consentfile_load($args[0]);
            $access = user_access('consentfile resource view any consentfile');
            $access = $access || $consentfile->uid == $user->uid && user_access('consentfile resource view own consentfiles');
            break;
        case 'update':
            $consentfile = consentfile_load($args[0]->id);
            $access = user_access('consentfile resource edit any consentfile');
            $access = $access || $consentfile->uid == $user->uid && user_access('consentfile resource edit own consentfiles');
            break;
        case 'delete':
            $consentfile = consentfile_load($args[0]);
            $access = user_access('consentfile resource delete any consentfile');
            $access = $access || $consentfile->uid == $user->uid && user_access('consentfile resource delete own consentfiles');
            break;
    }
    $access = TRUE;

    return $access;
}