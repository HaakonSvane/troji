/**
 * @generated SignedSource<<a26da42be74f9a1d2b8baa523b129254>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type groupsActivitiesQuery$variables = {
  id: string;
};
export type groupsActivitiesQuery$data = {
  readonly groupById: {
    readonly id: string;
    readonly name: string;
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
  } | null | undefined;
  readonly me: {
    readonly id: string;
  };
};
export type groupsActivitiesQuery = {
  response: groupsActivitiesQuery$data;
  variables: groupsActivitiesQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = [
  (v1/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "displayName",
    "storageKey": null
  }
],
v4 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
    "concreteType": "Group",
    "kind": "LinkedField",
    "name": "groupById",
    "plural": false,
    "selections": [
      (v1/*: any*/),
      (v2/*: any*/),
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
            "value": 50
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
          (v1/*: any*/),
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
                  (v1/*: any*/),
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
                      (v1/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "symbol",
                        "storageKey": null
                      },
                      (v2/*: any*/)
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
                    "selections": (v3/*: any*/),
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "User",
                    "kind": "LinkedField",
                    "name": "awardedBy",
                    "plural": false,
                    "selections": (v3/*: any*/),
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
                "selections": (v3/*: any*/),
                "storageKey": null
              }
            ],
            "type": "MemberJoinedActivity",
            "abstractKey": null
          }
        ],
        "storageKey": "recentActivity(first:50)"
      }
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "me",
    "plural": false,
    "selections": [
      (v1/*: any*/)
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "groupsActivitiesQuery",
    "selections": (v4/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "groupsActivitiesQuery",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "dd5506e779e9466d3c9f58d5b2a3e81f",
    "id": null,
    "metadata": {},
    "name": "groupsActivitiesQuery",
    "operationKind": "query",
    "text": "query groupsActivitiesQuery(\n  $id: ID!\n) {\n  groupById(id: $id) {\n    id\n    name\n    recentActivityCount\n    recentActivity(first: 50) {\n      __typename\n      id\n      occurredAt\n      ... on TrophyAwardedActivity {\n        trophy {\n          id\n          description\n          game {\n            id\n            symbol\n            name\n          }\n          receiver {\n            id\n            displayName\n          }\n          awardedBy {\n            id\n            displayName\n          }\n        }\n      }\n      ... on MemberJoinedActivity {\n        member {\n          id\n          displayName\n        }\n      }\n    }\n  }\n  me {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "04c91869fc01fc3a395fd0afafb1d47f";

export default node;
