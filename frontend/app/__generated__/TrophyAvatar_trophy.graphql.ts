/**
 * @generated SignedSource<<77ac939e5493cb3805a63cb6d5b4abb7>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TrophyAvatar_trophy$data = {
  readonly game: {
    readonly name: string;
    readonly symbol: string;
  };
  readonly id: string;
  readonly isAwarded: boolean;
  readonly " $fragmentType": "TrophyAvatar_trophy";
};
export type TrophyAvatar_trophy$key = {
  readonly " $data"?: TrophyAvatar_trophy$data;
  readonly " $fragmentSpreads": FragmentRefs<"TrophyAvatar_trophy">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "TrophyAvatar_trophy",
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
      "name": "isAwarded",
      "storageKey": null
    },
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

(node as any).hash = "5d96c8766fca09b8a7fa1480fe9ba464";

export default node;
