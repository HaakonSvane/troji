/**
 * @generated SignedSource<<29e914e67fb9f640373000e0ebff8f83>>
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

(node as any).hash = "d3f3b042411784ec2d4866c6bab77496";

export default node;
