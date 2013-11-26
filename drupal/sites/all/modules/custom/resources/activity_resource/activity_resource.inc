<?php
// activity_resource.inc


function _activity_resource_index($user_id, $embed, $page, $fields, $parameters, $page_size) {

    // Get all the activities that are accessible
    $parameters["share_id"] = shares_filter_accessible($parameters["share_id"]);
    $activities = resource_helper_index('activity', $page, $fields, $parameters, $page_size, "modified", "DESC");

    foreach($activities as &$activity) {
        // Embed some data (only on accessibly activities, so its all good)

        $share = share_load($activity->share_id);
        $activity->patient = patient_load($share->patient_id);

        if(strlen($activity->patient->clinical_summary) > 250) {
            $activity->patient->clinical_summary = substr(strip_tags($activity->patient->clinical_summary), 0, 250) . "...";
        }
        $activity->group = group_load($share->group_id);
    }

    return $activities;
}



/**
 * Access callback for the activity resource.
 *
 * @param string $op
 *  The operation that's going to be performed.
 * @param array $args
 *  The arguments that will be passed to the callback.
 * @return bool
 *  Whether access is given or not.
 */
function _activity_resource_access($op, $args=array()) {
    global $user;
    $access = FALSE;

    if($args[0]) {
        $activity = activity_load($args[0]);
    }

    switch ($op) {
        case 'index':
            $access = user_access('view activities');
            break;
    }

    return $access;
}

