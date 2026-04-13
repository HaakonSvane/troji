/**
 * @generated SignedSource<<a61774bb3d2cb0a1a698564eac12156d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type GroupSocialCardFragment$data = {
  readonly description: string | null | undefined;
  readonly name: string;
  readonly " $fragmentSpreads": FragmentRefs<"GroupInviteFragment">;
  readonly " $fragmentType": "GroupSocialCardFragment";
};
export type GroupSocialCardFragment$key = {
  readonly " $data"?: GroupSocialCardFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"GroupSocialCardFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "GroupSocialCardFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "description",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "GroupInviteFragment"
    }
  ],
  "type": "Group",
  "abstractKey": null
};

(node as any).hash = "18796782a813d73916434501ea021f44";

export default node;
