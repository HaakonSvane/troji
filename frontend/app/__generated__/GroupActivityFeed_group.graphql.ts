/**
 * @generated SignedSource<<541fc60062b7344a6fdce924d634b7c1>>
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
      readonly profile: {
        readonly firstName: string;
        readonly lastName: string;
        readonly middleName: string | null | undefined;
      };
    };
    readonly occurredAt: any;
    readonly trophy?: {
      readonly awardedBy: {
        readonly displayName: string;
        readonly id: string;
        readonly profile: {
          readonly firstName: string;
          readonly lastName: string;
          readonly middleName: string | null | undefined;
        };
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
        readonly profile: {
          readonly firstName: string;
          readonly lastName: string;
          readonly middleName: string | null | undefined;
        };
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
  },
  {
    "alias": null,
    "args": null,
    "concreteType": "UserProfile",
    "kind": "LinkedField",
    "name": "profile",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "firstName",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "middleName",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "lastName",
        "storageKey": null
      }
    ],
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

(node as any).hash = "9bff131c704a1f010675c7bbd1e56941";

export default node;
