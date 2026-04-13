/**
 * @generated SignedSource<<6df76aa87b75b0c98aa7bc7e842edf91>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TrophyAvatarFragment$data = {
  readonly game: {
    readonly name: string;
    readonly symbol: string;
  };
  readonly " $fragmentType": "TrophyAvatarFragment";
};
export type TrophyAvatarFragment$key = {
  readonly " $data"?: TrophyAvatarFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"TrophyAvatarFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "TrophyAvatarFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Game",
      "kind": "LinkedField",
      "name": "game",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "symbol",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "name",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Trophy",
  "abstractKey": null
};

(node as any).hash = "fd487fce889c331410dee7424eb5699c";

export default node;
