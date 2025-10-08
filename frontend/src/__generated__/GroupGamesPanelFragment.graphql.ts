/**
 * @generated SignedSource<<f6e782b36ed383f94c2d202a9ac4019b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type GroupGamesPanelFragment$data = {
  readonly games: {
    readonly __id: string;
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly " $fragmentSpreads": FragmentRefs<"GroupGamesTableRowFragment">;
      };
    }> | null | undefined;
  } | null | undefined;
  readonly id: string;
  readonly " $fragmentType": "GroupGamesPanelFragment";
};
export type GroupGamesPanelFragment$key = {
  readonly " $data"?: GroupGamesPanelFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"GroupGamesPanelFragment">;
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
          "games"
        ]
      }
    ]
  },
  "name": "GroupGamesPanelFragment",
  "selections": [
    (v0/*: any*/),
    {
      "alias": "games",
      "args": [
        {
          "kind": "Literal",
          "name": "order",
          "value": [
            {
              "createdDate": "DESC"
            }
          ]
        }
      ],
      "concreteType": "GamesConnection",
      "kind": "LinkedField",
      "name": "__GroupGamesPanel_games_connection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "GamesEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Game",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                (v0/*: any*/),
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "GroupGamesTableRowFragment"
                },
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
        },
        {
          "kind": "ClientExtension",
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "__id",
              "storageKey": null
            }
          ]
        }
      ],
      "storageKey": "__GroupGamesPanel_games_connection(order:[{\"createdDate\":\"DESC\"}])"
    }
  ],
  "type": "Group",
  "abstractKey": null
};
})();

(node as any).hash = "14e35913f37f238c04154b9b83f5486e";

export default node;
