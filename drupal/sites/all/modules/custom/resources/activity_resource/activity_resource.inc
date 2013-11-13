<?php
// activity_resource.inc


function _activity_resource_index($user_id, $embed, $page, $fields, $parameters, $page_size) {

    // Get out the user field
    if($user_id > 0) {

        // lets get all the groups first
        $sql = "SELECT shares.id
                FROM shares, members
                WHERE members.user_id = :user_id
                AND shares.group_id = members.group_id";

        $results = db_query($sql, array(
            'user_id' => $user_id
        ));

        $share_ids = array();
        foreach($results as $result) {
            $share_ids[] = $result->id;
        }

        $parameters['share_id'] = $share_ids;
    }

    $activities = resource_helper_index('activity', $page, $fields, $parameters, $page_size, "modified", "DESC");

    if($embed == 1) {
        foreach($activities as &$activity) {
            // embed the patient
            $share = share_load($activity->share_id);
            $activity->patient = patient_load($share->patient_id);
            if(strlen($activity->patient->clinical_summary) > 250) {
                $activity->patient->clinical_summary = substr(strip_tags($activity->patient->clinical_summary), 0, 250) . "...";
            }
            $activity->group = group_load($share->group_id);
        }
    }

    return $activities;
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

function _activity_resource_access($op, $args) {
    global $user;
    $access = FALSE;

    switch ($op) {
        case 'view':
            $patient = patient_load($args[0]);
            $access = user_access('patient resource view any patient');
            $access = $access || $patient->uid == $user->uid && user_access('patient resource view own patients');
            break;
        case 'update':
            $patient = patient_load($args[0]->id);
            $access = user_access('patient resource edit any patient');
            $access = $access || $patient->uid == $user->uid && user_access('patient resource edit own patients');
            break;
        case 'delete':
            $patient = patient_load($args[0]);
            $access = user_access('patient resource delete any patient');
            $access = $access || $patient->uid == $user->uid && user_access('patient resource delete own patients');
            break;
    }
    $access = TRUE;

    return $access;
}