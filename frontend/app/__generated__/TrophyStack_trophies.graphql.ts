/**
 * @generated SignedSource<<7ee1b61aaa68d8bf1dfbaf56f8617d3b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TrophyStack_trophies$data = ReadonlyArray<{
  readonly id: string;
  readonly " $fragmentSpreads": FragmentRefs<"TrophyAvatar_trophy">;
  readonly " $fragmentType": "TrophyStack_trophies";
}>;
export type TrophyStack_trophies$key = ReadonlyArray<{
  readonly " $data"?: TrophyStack_trophies$data;
  readonly " $fragmentSpreads": FragmentRefs<"TrophyStack_trophies">;
}>;

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "TrophyStack_trophies",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "TrophyAvatar_trophy"
    }
  ],
  "type": "Trophy",
  "abstractKey": null
};

(node as any).hash = "3ee0d1899aaa595f3495186d03252a72";

export default node;
