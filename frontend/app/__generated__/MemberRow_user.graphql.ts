/**
 * @generated SignedSource<<a9a7465b68d8f79ca79961da97b9bece>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type MemberRow_user$data = {
  readonly avatarUrl: string | null | undefined;
  readonly displayName: string;
  readonly id: string;
  readonly profile: {
    readonly firstName: string;
    readonly lastName: string;
    readonly middleName: string | null | undefined;
  };
  readonly " $fragmentType": "MemberRow_user";
};
export type MemberRow_user$key = {
  readonly " $data"?: MemberRow_user$data;
  readonly " $fragmentSpreads": FragmentRefs<"MemberRow_user">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MemberRow_user",
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
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "UserProfile",
      "kind": "LinkedField",
      "name": "profile",
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
          "name": "middleName",
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
    }
  ],
  "type": "User",
  "abstractKey": null
};

(node as any).hash = "e5a0577e73d874ed2589e4da29876de2";

export default node;
