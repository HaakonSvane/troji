/**
 * @generated SignedSource<<a5365e0f05b15c4ba7fa57bd5d70bde8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type GroupGamesTableRow_game$data = {
  readonly description: string | null | undefined;
  readonly id: string;
  readonly name: string;
  readonly symbol: string;
  readonly trophies: {
    readonly totalCount: number;
  } | null | undefined;
  readonly " $fragmentType": "GroupGamesTableRow_game";
};
export type GroupGamesTableRow_game$key = {
  readonly " $data"?: GroupGamesTableRow_game$data;
  readonly " $fragmentSpreads": FragmentRefs<"GroupGamesTableRow_game">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "GroupGamesTableRow_game",
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
      "name": "name",
      "storageKey": null
    },
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
      "name": "description",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "TrophiesConnection",
      "kind": "LinkedField",
      "name": "trophies",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "totalCount",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Game",
  "abstractKey": null
};

(node as any).hash = "52488852762a14839bd31b2f510fb794";

export default node;
