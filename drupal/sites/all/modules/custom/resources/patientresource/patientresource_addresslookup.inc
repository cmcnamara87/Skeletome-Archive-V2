<?php

function _patientresource_addresslookup_index($page, $fields, $parameters, $page_size) {
    $key = "AIzaSyBc5jA_BpNXAgoIoCcwPePAB_j39ZEGawA";

    if(isset($parameters['input'])) {
        if(isset($parameters['type'])) {
            $url = "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" . urlencode($parameters['input']) . "&types=" . $parameters['address'] . "&sensor=false&key=" . $key;

            $results = json_decode(file_get_contents($url));

            if(isset($results->predictions)) {
                return $results->predictions;
            } else {
                return $results;
            }
        }
    }
    return array();
}