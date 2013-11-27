<?php
// patientresource.inc
/**
 * Callback for creating patient resources.
 *
 * @param object $data
 * @return object
 */
function _patientresource_create($data) {
    global $user;
    if (isset($data) &&  is_array($data)) $data=(object) $data;
    unset($data->id);
    $data = (object)$data;
    $data->uid = $user->uid;
    $data->created = time();
    $data->modified = time();

    patient_save($data);

    return $data;
}

// patientresource.inc
/**
 * Callback for updating patient resources.
 *
 * @param int $id
 * @param object $data
 * @return object
 */
function _patientresource_update($id, $data) {

    global $user;

    if (isset($data) &&  is_array($data)) $data=(object) $data;
    unset($data->created);
    $data->id = $id;
    $data->uid = $user->uid;
    $data->modified = time();

    patient_save($data);
    return $data;
}


/**
 * Callback for retrieving patient resources.
 *
 * @param int $id
 * @return object
 */
function _patientresource_retrieve($id) {
    return patient_load($id);
}

/**
 * Callback for deleting patient resources.
 *
 * @param int $id
 * @return object
 */
function _patientresource_delete($id) {
    patient_delete($id);

    return (object)array(
        'id' => $id,
    );
}


function _patientresource_search_for_patient($query) {


    $accessible_patient_ids = patients_accessible();
    if(count($accessible_patient_ids)) {
        $ids = implode(",", $accessible_patient_ids);

        $sql = "SELECT patients.id
            FROM patients
            WHERE patients.id IN ($ids)
            AND (
                concat(patients.first_name, ' ' , patients.last_name) LIKE :pattern
                OR patients.id = :query
            )";

        $results = db_query($sql, array(
            ':pattern'  => '%' . db_like($query) . '%',
            ':query'    => $query
        ));

        $ids = array_keys($results->fetchAllAssoc('id'));

        return patient_load_multiple($ids);
    } else {
        return array();
    }

}

function _patientresource_index($query, $group_id, $embed, $page, $fields, $parameters, $page_size) {



    if(strlen($query)) {

        return _patientresource_search_for_patient($query);
    } else {
        // We dont need to filter the groups
        // Because it just shows the patient overview,
        // Not the FULL patient
        if ($group_id > 0) {

            // lets get all the groups first
            $sql = "SELECT DISTINCT shares.patient_id
                FROM shares
                WHERE shares.group_id = :group_id";

            $results = db_query($sql, array(
                'group_id' => $group_id
            ));
            $patient_ids = array_keys($results->fetchAllAssoc('patient_id'));

            $parameters['id'] = $patient_ids;
        }
        $patients = resource_helper_index('patient', $page, $fields, $parameters, $page_size);
    }

    if($embed) {

        foreach($patients as &$patient) {

            if(patients_is_accessible($patient->id)) {
                $query = new EntityFieldQuery();
                $query->entityCondition('entity_type', 'diagnosis');
                $query->propertyCondition('patient_id', $patient->id);
                $result = $query->execute();
                if(isset($result['diagnosis'])) {
                    $ids = array_keys($result['diagnosis']);
                    $patient->diagnoses = diagnosis_load_multiple($ids);
                } else {
                    $patient->diagnoses = array();;
                }

                unset($patient->clinical_summary);
                unset($patient->mentions);

                $query = new EntityFieldQuery();
                $query->entityCondition('entity_type', 'share');
                $query->propertyCondition('patient_id', $patient->id);
                $result = $query->execute();
                if(isset($result['share'])) {
                    $ids = array_keys($result['share']);
                    $patient->shares = share_load_multiple($ids);
                } else {
                    $patient->shares = array();
                }
            }
        }
    }

    return $patients;
}

/**
 * Access callback for the patient resource.
 *
 * @param string $op
 *  The operation that's going to be performed.
 * @param array $args
 *  The arguments that will be passed to the callback.
 * @return bool
 *  Whether access is given or not.
 */

function _patientresource_access($op, $args=array()) {
    global $user;
    $access = FALSE;

    switch ($op) {
        case 'view':
            $access = user_access('view patients');
            break;
        case 'index':
            $access = user_access('view patients');
            break;
        case 'update':
            $access = user_access('update patients') && patients_is_accessible($args[0]);
            break;
        case 'delete':
            $access = user_access('delete patients') && patients_is_accessible($args[0]);
            break;
        case 'create':
            $access = user_access('create patients');
            break;
    }



    return $access;
}