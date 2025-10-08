/**
 * @generated SignedSource<<af8d579c0771330635ec51311be90f18>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { Fragment, ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type GroupGamesTableRowFragment$data = {
  readonly description: string | null | undefined;
  readonly id: string;
  readonly name: string;
  readonly symbol: string;
  readonly topPlayers: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly username: string;
      };
    }> | null | undefined;
  } | null | undefined;
  readonly trophies: ReadonlyArray<{
    readonly id: string;
  }>;
  readonly " $fragmentType": "GroupGamesTableRowFragment";
};
export type GroupGamesTableRowFragment$key = {
  readonly " $data"?: GroupGamesTableRowFragment$data;
  readonly " $fragmentSpreads": FragmentRefs<"GroupGamesTableRowFragment">;
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
  "metadata": null,
  "name": "GroupGamesTableRowFragment",
  "selections": [
    (v0/*: any*/),
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
      "concreteType": "Trophy",
      "kind": "LinkedField",
      "name": "trophies",
      "plural": true,
      "selections": [
        (v0/*: any*/)
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 1
        }
      ],
      "concreteType": "TopPlayersConnection",
      "kind": "LinkedField",
      "name": "topPlayers",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "TopPlayersEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "User",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "username",
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "topPlayers(first:1)"
    }
  ],
  "type": "Game",
  "abstractKey": null
};
})();

(node as any).hash = "5775f98cd3e7c7b3f8e9948f4544b903";

export default node;
