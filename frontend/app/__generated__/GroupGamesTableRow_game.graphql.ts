/**
 * @generated SignedSource<<6f8f57ddc1fa5b39e3955c8b65bc95d3>>
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
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
      };
    }> | null | undefined;
  } | null | undefined;
  readonly " $fragmentType": "GroupGamesTableRow_game";
};
export type GroupGamesTableRow_game$key = {
  readonly " $data"?: GroupGamesTableRow_game$data;
  readonly " $fragmentSpreads": FragmentRefs<"GroupGamesTableRow_game">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "connection": [
      {
        "count": null,
        "cursor": null,
        "direction": "forward",
        "path": [
          "trophies"
        ]
      }
    ]
  },
  "name": "GroupGamesTableRow_game",
  "selections": [
    (v0/*: any*/),
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
      "alias": "trophies",
      "args": null,
      "concreteType": "TrophiesConnection",
      "kind": "LinkedField",
      "name": "__GameTrophies_trophies_connection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "TrophiesEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Trophy",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                (v0/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "__typename",
                  "storageKey": null
                }
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "cursor",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "PageInfo",
          "kind": "LinkedField",
          "name": "pageInfo",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "endCursor",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "hasNextPage",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Game",
  "abstractKey": null
};
})();

(node as any).hash = "e8c3ef4db9fb654965d75695d29cdf6f";

export default node;
