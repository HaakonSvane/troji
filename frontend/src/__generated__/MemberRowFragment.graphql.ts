/**
 * @generated SignedSource<<76e4a3cad972a63170f45cb5c09efc88>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type MemberRowFragment$data = {
  readonly userProfile: {
    readonly firstName: string;
    readonly lastName: string;
  } | null | undefined;
  readonly username: string;
  readonly " $fragmentSpreads": FragmentRefs<"TrophyStackFragment">;
  readonly " $fragmentType": "MemberRowFragment";
};
export type MemberRowFragment$key = {
  readonly " $data"?: MemberRowFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"MemberRowFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MemberRowFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "username",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "UserProfile",
      "kind": "LinkedField",
      "name": "userProfile",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "firstName",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "lastName",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "TrophyStackFragment"
    }
  ],
  "type": "User",
  "abstractKey": null
};

(node as any).hash = "b42f3d45e5c0fe8e5dbe2240df776e2b";

export default node;
