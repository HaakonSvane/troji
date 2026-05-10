/**
 * @generated SignedSource<<ba25592c3781738d17482b32d6af5da4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type groupsGameDetailQuery$variables = {
  gameId: string;
  groupId: string;
};
export type groupsGameDetailQuery$data = {
  readonly gameById: {
    readonly description: string | null | undefined;
    readonly group: {
      readonly id: string;
    } | null | undefined;
    readonly id: string;
    readonly name: string;
    readonly symbol: string;
    readonly trophies: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly description: string | null | undefined;
          readonly game: {
            readonly id: string;
            readonly name: string;
            readonly symbol: string;
          };
          readonly id: string;
          readonly isAwarded: boolean;
          readonly receiver: {
            readonly firstName: string;
            readonly id: string;
            readonly lastName: string;
          };
        };
      }> | null | undefined;
      readonly pageInfo: {
        readonly hasNextPage: boolean;
      };
    } | null | undefined;
  } | null | undefined;
  readonly groupById: {
    readonly id: string;
    readonly members: {
      readonly totalCount: number;
    } | null | undefined;
    readonly name: string;
  } | null | undefined;
  readonly me: {
    readonly id: string;
  };
};
export type groupsGameDetailQuery = {
  response: groupsGameDetailQuery$data;
  variables: groupsGameDetailQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "gameId"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "groupId"
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": [
    {
      "kind": "Variable",
      "name": "id",
      "variableName": "groupId"
    }
  ],
  "concreteType": "Group",
  "kind": "LinkedField",
  "name": "groupById",
  "plural": false,
  "selections": [
    (v2/*: any*/),
    (v3/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "MembersConnection",
      "kind": "LinkedField",
      "name": "members",
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
  "storageKey": null
},
v5 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "gameId"
  }
],
v6 = [
  (v2/*: any*/)
],
v7 = {
  "alias": null,
  "args": null,
  "concreteType": "Group",
  "kind": "LinkedField",
  "name": "group",
  "plural": false,
  "selections": (v6/*: any*/),
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "symbol",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v10 = [
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
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isAwarded",
            "storageKey": null
          },
          (v9/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Game",
            "kind": "LinkedField",
            "name": "game",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v8/*: any*/),
              (v3/*: any*/)
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
            "selections": [
              (v2/*: any*/),
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
                "name": "lastName",
                "storageKey": null
              }
            ],
            "storageKey": null
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
        "name": "hasNextPage",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "endCursor",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
],
v11 = {
  "alias": null,
  "args": null,
  "concreteType": "User",
  "kind": "LinkedField",
  "name": "me",
  "plural": false,
  "selections": (v6/*: any*/),
  "storageKey": null
},
v12 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 200
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "groupsGameDetailQuery",
    "selections": [
      (v4/*: any*/),
      {
        "alias": null,
        "args": (v5/*: any*/),
        "concreteType": "Game",
        "kind": "LinkedField",
        "name": "gameById",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v7/*: any*/),
          (v3/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          {
            "alias": "trophies",
            "args": null,
            "concreteType": "TrophiesConnection",
            "kind": "LinkedField",
            "name": "__GameTrophies_trophies_connection",
            "plural": false,
            "selections": (v10/*: any*/),
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      (v11/*: any*/)
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "groupsGameDetailQuery",
    "selections": [
      (v4/*: any*/),
      {
        "alias": null,
        "args": (v5/*: any*/),
        "concreteType": "Game",
        "kind": "LinkedField",
        "name": "gameById",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v7/*: any*/),
          (v3/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          {
            "alias": null,
            "args": (v12/*: any*/),
            "concreteType": "TrophiesConnection",
            "kind": "LinkedField",
            "name": "trophies",
            "plural": false,
            "selections": (v10/*: any*/),
            "storageKey": "trophies(first:200)"
          },
          {
            "alias": null,
            "args": (v12/*: any*/),
            "filters": null,
            "handle": "connection",
            "key": "GameTrophies_trophies",
            "kind": "LinkedHandle",
            "name": "trophies"
          }
        ],
        "storageKey": null
      },
      (v11/*: any*/)
    ]
  },
  "params": {
    "cacheID": "6211c3955351276a27c25b690f30c82c",
    "id": null,
    "metadata": {
      "connection": [
        {
          "count": null,
          "cursor": null,
          "direction": "forward",
          "path": [
            "gameById",
            "trophies"
          ]
        }
      ]
    },
    "name": "groupsGameDetailQuery",
    "operationKind": "query",
    "text": "query groupsGameDetailQuery(\n  $groupId: ID!\n  $gameId: ID!\n) {\n  groupById(id: $groupId) {\n    id\n    name\n    members {\n      totalCount\n    }\n  }\n  gameById(id: $gameId) {\n    id\n    group {\n      id\n    }\n    name\n    symbol\n    description\n    trophies(first: 200) {\n      edges {\n        node {\n          id\n          isAwarded\n          description\n          game {\n            id\n            symbol\n            name\n          }\n          receiver {\n            id\n            firstName\n            lastName\n          }\n          __typename\n        }\n        cursor\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n  me {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "4e0d5e9a60eafdbe52e695268826a198";

export default node;
