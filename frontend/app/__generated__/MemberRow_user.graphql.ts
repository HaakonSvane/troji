/**
 * @generated SignedSource<<96c022a79b20891de9317f1ce71e8aa8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type MemberRow_user$data = {
  readonly displayName: string;
  readonly id: string;
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
    }
  ],
  "type": "User",
  "abstractKey": null
};

(node as any).hash = "a1d8bf723b5394db4882fa726b3554ca";

export default node;
