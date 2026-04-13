/**
 * @generated SignedSource<<6ae12c9584997e019aa7100439cf359f>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type UserMenuContentFragment$data = {
  readonly userProfile: {
    readonly firstName: string;
    readonly lastName: string;
  } | null | undefined;
  readonly username: string;
  readonly " $fragmentType": "UserMenuContentFragment";
};
export type UserMenuContentFragment$key = {
  readonly " $data"?: UserMenuContentFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"UserMenuContentFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "UserMenuContentFragment",
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
    }
  ],
  "type": "User",
  "abstractKey": null
};

(node as any).hash = "df6e044bc64ed9afe98e0de34852b423";

export default node;
