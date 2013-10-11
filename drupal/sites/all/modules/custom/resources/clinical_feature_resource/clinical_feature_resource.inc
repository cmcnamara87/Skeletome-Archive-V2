<?php
//// clinical_feature.inc
///**
// * Callback for creating clinical_feature resources.
// *
// * @param object $data
// * @return object
// */
//function _clinical_feature_create($data) {
//    global $user;
//    if (isset($data) &&  is_array($data)) $data=(object) $data;
//    unset($data->id);
//    $data->uid = $user->uid;
//    $data->created = time();
//    $data->modified = time();
//
////
////    if (!isset($data->subject)) {
////        return services_error('Missing clinical_feature attribute subject', 406);
////    }
////
////    if (!isset($data->clinical_feature)) {
////        return services_error('Missing clinical_feature attribute clinical_feature', 406);
////    }
//
//    clinical_feature_write_clinical_feature($data);
//
//    return (object)array(
//        'id' => $data->id,
//        'uri' => services_resource_uri(array('clinical_feature', $data->id)),
//    );
//}
//
//// clinical_feature.inc
///**
// * Callback for updating clinical_feature resources.
// *
// * @param int $id
// * @param object $data
// * @return object
// */
//function _clinical_feature_update($id, $data) {
//    global $user;
//    $clinical_feature = clinical_feature_get_clinical_feature($id);
//
//    unset($data->created);
//    $data->id = $id;
//    $data->uid = $clinical_feature->uid;
//    $data->modified = time();
//
//    clinical_feature_write_clinical_feature($data);
//
//    return (object)array(
//        'id' => $id,
//        'uri' => services_resource_uri(array('clinical_feature', $id)),
//    );
//}
///**
// * Callback for retrieving clinical_feature resources.
// *
// * @param int $id
// * @return object
// */
//function _clinical_feature_retrieve($id) {
//    return clinical_feature_get_clinical_feature($id);
//}
//
///**
// * Callback for deleting clinical_feature resources.
// *
// * @param int $id
// * @return object
// */
//function _clinical_feature_delete($id) {
//    clinical_feature_delete_clinical_feature($id);
//
//    return (object)array(
//        'id' => $id,
//    );
//}
//
//function _clinical_feature_index($page, $parameters) {
//    global $user;
//
//    $clinical_features = array();
//    $res = db_query('SELECT * FROM {clinical_features} WHERE uid=:uid ORDER BY modified DESC',
//        array(':uid' => $user->uid));
//
//    foreach ($res as $clinical_feature) {
//        $clinical_features[] = $clinical_feature;
//    }
//
//    return $clinical_features;
//}
//
///**
// * Access callback for the clinical_feature resource.
// *
// * @param string $op
// *  The operation that's going to be performed.
// * @param array $args
// *  The arguments that will be passed to the callback.
// * @return bool
// *  Whether access is given or not.
// */
//
//function _clinical_feature_access($op, $args) {
//    global $user;
//    $access = FALSE;
//
//    switch ($op) {
//        case 'view':
//            $clinical_feature = clinical_feature_get_clinical_feature($args[0]);
//            $access = user_access('clinical_feature resource view any clinical_feature');
//            $access = $access || $clinical_feature->uid == $user->uid && user_access('clinical_feature resource view own clinical_features');
//            break;
//        case 'update':
//            $clinical_feature = clinical_feature_get_clinical_feature($args[0]->id);
//            $access = user_access('clinical_feature resource edit any clinical_feature');
//            $access = $access || $clinical_feature->uid == $user->uid && user_access('clinical_feature resource edit own clinical_features');
//            break;
//        case 'delete':
//            $clinical_feature = clinical_feature_get_clinical_feature($args[0]);
//            $access = user_access('clinical_feature resource delete any clinical_feature');
//            $access = $access || $clinical_feature->uid == $user->uid && user_access('clinical_feature resource delete own clinical_features');
//            break;
//    }
//    $access = TRUE;
//
//    return $access;
//}