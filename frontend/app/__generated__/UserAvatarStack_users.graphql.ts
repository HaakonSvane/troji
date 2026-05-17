/**
 * @generated SignedSource<<147156995ce7f8598f04b76a4f195d93>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type UserAvatarStack_users$data = ReadonlyArray<{
  readonly avatarUrl: string | null | undefined;
  readonly displayName: string;
  readonly id: string;
  readonly " $fragmentType": "UserAvatarStack_users";
}>;
export type UserAvatarStack_users$key = ReadonlyArray<{
  readonly " $data"?: UserAvatarStack_users$data;
  readonly " $fragmentSpreads": FragmentRefs<"UserAvatarStack_users">;
}>;

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "UserAvatarStack_users",
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
      "kind": "ScalarField",
      "name": "displayName",
      "storageKey": null
    },
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "size",
          "value": 64
        }
      ],
      "kind": "ScalarField",
      "name": "avatarUrl",
      "storageKey": "avatarUrl(size:64)"
    }
  ],
  "type": "User",
  "abstractKey": null
};

(node as any).hash = "bd334c0bb5a713d6fec8ae22e5a143cb";

export default node;
