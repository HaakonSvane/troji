/**
 * @generated SignedSource<<461e7143893ec6a33be895680b454063>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type TrophyStackFragment$data = {
  readonly trophies: ReadonlyArray<{
    readonly awardedDate: any | null | undefined;
    readonly game: {
      readonly groupId: string;
    };
    readonly id: string;
    readonly " $fragmentSpreads": FragmentRefs<"TrophyAvatarFragment">;
  }>;
  readonly " $fragmentType": "TrophyStackFragment";
};
export type TrophyStackFragment$key = {
  readonly " $data"?: TrophyStackFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"TrophyStackFragment">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "TrophyStackFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Trophy",
      "kind": "LinkedField",
      "name": "trophies",
      "plural": true,
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
          "name": "awardedDate",
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
              "name": "groupId",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "TrophyAvatarFragment"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "User",
  "abstractKey": null
};

(node as any).hash = "5ecbfb9cb19438ed643542ab2eb7813e";

export default node;
