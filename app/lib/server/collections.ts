import type {
  CollectionReference,
  CollectionGroup,
} from 'firebase-admin/firestore';

import { getFirestore } from 'firebase-admin/firestore';

import type Organization from '~/lib/organizations/types/organization';
import type UserData from '~/core/session/types/user-data';
import type MembershipInvite from '~/lib/organizations/types/membership-invite';

import {
  ORGANIZATIONS_COLLECTION,
  USERS_COLLECTION,
  INVITES_COLLECTION,
} from '~/lib/firestore-collections';

export function getUsersCollection() {
  return getCollectionByName(USERS_COLLECTION) as CollectionReference<UserData>;
}

export function getOrganizationsCollection() {
  return getCollectionByName(
    ORGANIZATIONS_COLLECTION
  ) as CollectionReference<Organization>;
}

export function getInvitesCollection() {
  return getCollectionGroupByName(
    INVITES_COLLECTION
  ) as CollectionGroup<MembershipInvite>;
}

function getCollectionByName(collection: string) {
  return getFirestore().collection(collection);
}

function getCollectionGroupByName(collection: string) {
  return getFirestore().collectionGroup(collection);
}
