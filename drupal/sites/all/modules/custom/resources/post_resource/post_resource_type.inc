<?php

function _post_resource_type_index($page, $fields, $parameters, $page_size) {
    module_load_include('inc', 'services', 'services.module');
    $node_select = db_select('post_types', 't')
        ->orderBy('created', 'DESC');

    services_resource_build_index_query($node_select, $page, $fields, $parameters, $page_size, 'post_types');

    $results = services_resource_execute_index_query($node_select);

    $list = services_resource_build_index_list($results, 'post_types', 'id');

    return $list;
}