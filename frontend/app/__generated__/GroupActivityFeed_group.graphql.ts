/**
 * @generated SignedSource<<cb8658e9077b0ad09fe27baba6127afb>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type GroupActivityFeed_group$data = {
  readonly recentActivity: ReadonlyArray<{
    readonly __typename: string;
    readonly id: string;
    readonly member?: {
      readonly displayName: string;
      readonly id: string;
    };
    readonly occurredAt: any;
    readonly trophy?: {
      readonly awardedBy: {
        readonly displayName: string;
        readonly id: string;
      } | null | undefined;
      readonly description: string | null | undefined;
      readonly game: {
        readonly id: string;
        readonly name: string;
        readonly symbol: string;
      };
      readonly id: string;
      readonly receiver: {
        readonly displayName: string;
        readonly id: string;
      };
    };
  }>;
  readonly recentActivityCount: number;
  readonly " $fragmentType": "GroupActivityFeed_group";
};
export type GroupActivityFeed_group$key = {
  readonly " $data"?: GroupActivityFeed_group$data;
  readonly " $fragmentSpreads": FragmentRefs<"GroupActivityFeed_group">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = [
  (v0/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "displayName",
    "storageKey": null
  }
];
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "GroupActivityFeed_group",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "recentActivityCount",
      "storageKey": null
    },
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 5
        }
      ],
      "concreteType": null,
      "kind": "LinkedField",
      "name": "recentActivity",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "__typename",
          "storageKey": null
        },
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "occurredAt",
          "storageKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Trophy",
              "kind": "LinkedField",
              "name": "trophy",
              "plural": false,
              "selections": [
                (v0/*: any*/),
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
                  "concreteType": "Game",
                  "kind": "LinkedField",
                  "name": "game",
                  "plural": false,
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
                    }
                  ],
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "User",
                  "kind": "LinkedField",
                  "name": "receiver",
                  "plural": false,
                  "selections": (v1/*: any*/),
                  "storageKey": null
                },
                {
                  "alias": null,
                  "args": null,
                  "concreteType": "User",
                  "kind": "LinkedField",
                  "name": "awardedBy",
                  "plural": false,
                  "selections": (v1/*: any*/),
                  "storageKey": null
                }
              ],
              "storageKey": null
            }
          ],
          "type": "TrophyAwardedActivity",
          "abstractKey": null
        },
        {
          "kind": "InlineFragment",
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "User",
              "kind": "LinkedField",
              "name": "member",
              "plural": false,
              "selections": (v1/*: any*/),
              "storageKey": null
            }
          ],
          "type": "MemberJoinedActivity",
          "abstractKey": null
        }
      ],
      "storageKey": "recentActivity(first:5)"
    }
  ],
  "type": "Group",
  "abstractKey": null
};
})();

(node as any).hash = "51cc0de7b845ded3cdf91a037bb28e67";

export default node;
