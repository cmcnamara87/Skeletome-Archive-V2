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
    $url = "http://knowledge.skeletome.org/api/bd?uri=" . urlencode($disorder->uri) . "&time=" . time();
    $bone_dysplasia = json_decode(file_get_contents($url));


    // Get a big list of clinical features
    $clinical_features = $bone_dysplasia->clinical_features;

    foreach($clinical_features as &$clinical_feature) {
        // Replace URI with new form of URI
        // http://purl.obolibrary.org/obo/HP_0000085 -> http://purl.org/obo/owl/HP#HP_0000085
        $clinical_feature->uri = str_replace("http://purl.org/obo/owl/HP#", "http://purl.obolibrary.org/obo/", $clinical_feature->uri);
    }

    $sql = "SELECT *
            FROM diagnoses
            WHERE disorder_id = :id";
    $result = db_query($sql, array(
        "id"   => $id
    ));

    $bone_dysplasia->patient_count = $result->rowCount();

    foreach($bone_dysplasia->clinical_features as &$clinical_feature) {
        $sql = "SELECT object_id as 'patient_id'
                FROM hpos_tags
                INNER JOIN hpos ON hpos_tags.hpo_id = hpos.id
                INNER JOIN diagnoses ON hpos_tags.object_id = diagnoses.patient_id
                WHERE hpos.uri = :uri
                AND object_type = 'patient'
                AND diagnoses.disorder_id = :id";
        $result = db_query($sql, array(
            "uri"   => $clinical_feature->uri,
            "id"    => $id
        ));
        $hpo_tag_count = $result->rowCount();

        $sql = "SELECT DISTINCT content_id as 'patient_id'
                FROM mentions
                INNER JOIN hpos ON mentions.mentioned_id = hpos.id
                INNER JOIN diagnoses ON mentions.content_id = diagnoses.patient_id
                WHERE mentions.content_type = 'patient'
                AND mentions.mentioned_type = 'hpo'
                AND mentioned_id = hpos.id
                AND hpos.uri = :uri
                AND diagnoses.disorder_id = :id";
        $result = db_query($sql, array(
            "uri"   => $clinical_feature->uri,
            "id"    => $id
        ));
        $mention_count = $result->rowCount();

        $clinical_feature->patient_count = $mention_count + $hpo_tag_count;
        $clinical_feature->patient_percent = round(($mention_count + $hpo_tag_count) / $bone_dysplasia->patient_count * 100, 0);
    }
    return $bone_dysplasia;
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
function _diagnosis_resource_disorder_access($op, $args=array()) {
    global $user;
    $access = FALSE;

    switch ($op) {
        case 'description':
            $access = true;
        case 'view':
            $access = user_access('view disorders');
            break;
        case 'index':
            $access = user_access('view disorders');
            break;
        case 'update':
            $access = user_access('update disorders');
            break;
        case 'delete':
            $access = user_access('delete disorders');
            break;
        case 'create':
            $access = user_access('create disorders');
            break;
    }

    return $access;
}

