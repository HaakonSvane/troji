/**
 * @generated SignedSource<<09ae9117e6cb0b60794bf0f245554960>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type GroupInviteFragment$data = {
  readonly id: string;
  readonly invite: {
    readonly expirationDate: any;
    readonly inviteCode: string;
  } | null | undefined;
  readonly " $fragmentType": "GroupInviteFragment";
};
export type GroupInviteFragment$key = {
  readonly " $data"?: GroupInviteFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"GroupInviteFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "GroupInviteFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Invite",
      "kind": "LinkedField",
      "name": "invite",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "inviteCode",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "expirationDate",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Group",
  "abstractKey": null
};

(node as any).hash = "f7964ad0913b02c96310ff1c7c3d1592";

export default node;
