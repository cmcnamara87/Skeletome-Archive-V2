<?php

function subscribe_callback($group_node, $uid) {
  $group = og_get_group('node', $group_node->nid);
  $user = user_load($uid);

  $state = og_user_access($group->gid, 'subscribe without approval') ? OG_STATE_ACTIVE : OG_STATE_PENDING;
  $membership_type = 'og_membership_type_default';
  $membership_fields = array (
    'og_membership_request' => array (
      'und' => array (
	0 => array (
	  'value' => '',
	),
      ),
    ),
  );

  $values = array(
    'entity' => $user,
    'state' => $state,
    'membership type' => $membership_type,
    'membership fields' => $membership_fields,
  );
  og_group($group->gid, $values);
}

function unsubscribe_callback($group_node, $uid) {
  $group = og_get_group('node', $group_node->nid);
  $manager = $group->user();
  $user = user_load($uid);

  if ($manager->uid != $user->uid) {
    $account = clone $user;
    if (og_is_member($group->gid, 'user', $account, array(OG_STATE_ACTIVE, OG_STATE_PENDING))) {
      og_ungroup($group->gid, 'user', $account);
    }
  }
}
