/**
 * @generated SignedSource<<3828faaaaa1c6c4f7b8a2ef57249acbf>>
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
    } | null | undefined;
  } | null | undefined;
  readonly groupById: {
    readonly id: string;
    readonly members: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly firstName: string;
          readonly id: string;
          readonly lastName: string;
        };
      }> | null | undefined;
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
v4 = [
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
v5 = {
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
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 50
        }
      ],
      "concreteType": "MembersConnection",
      "kind": "LinkedField",
      "name": "members",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "MembersEdge",
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
              "selections": (v4/*: any*/),
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "members(first:50)"
    }
  ],
  "storageKey": null
},
v6 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "gameId"
  }
],
v7 = [
  (v2/*: any*/)
],
v8 = {
  "alias": null,
  "args": null,
  "concreteType": "Group",
  "kind": "LinkedField",
  "name": "group",
  "plural": false,
  "selections": (v7/*: any*/),
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "symbol",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v11 = [
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
          (v10/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Game",
            "kind": "LinkedField",
            "name": "game",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v9/*: any*/),
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
            "selections": (v4/*: any*/),
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
v12 = {
  "alias": null,
  "args": null,
  "concreteType": "User",
  "kind": "LinkedField",
  "name": "me",
  "plural": false,
  "selections": (v7/*: any*/),
  "storageKey": null
},
v13 = [
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
      (v5/*: any*/),
      {
        "alias": null,
        "args": (v6/*: any*/),
        "concreteType": "Game",
        "kind": "LinkedField",
        "name": "gameById",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v8/*: any*/),
          (v3/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          {
            "alias": "trophies",
            "args": null,
            "concreteType": "TrophiesConnection",
            "kind": "LinkedField",
            "name": "__GameTrophies_trophies_connection",
            "plural": false,
            "selections": (v11/*: any*/),
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      (v12/*: any*/)
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
      (v5/*: any*/),
      {
        "alias": null,
        "args": (v6/*: any*/),
        "concreteType": "Game",
        "kind": "LinkedField",
        "name": "gameById",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v8/*: any*/),
          (v3/*: any*/),
          (v9/*: any*/),
          (v10/*: any*/),
          {
            "alias": null,
            "args": (v13/*: any*/),
            "concreteType": "TrophiesConnection",
            "kind": "LinkedField",
            "name": "trophies",
            "plural": false,
            "selections": (v11/*: any*/),
            "storageKey": "trophies(first:200)"
          },
          {
            "alias": null,
            "args": (v13/*: any*/),
            "filters": null,
            "handle": "connection",
            "key": "GameTrophies_trophies",
            "kind": "LinkedHandle",
            "name": "trophies"
          }
        ],
        "storageKey": null
      },
      (v12/*: any*/)
    ]
  },
  "params": {
    "cacheID": "3310aa8246a2c23f954f79b542bffc12",
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
    "text": "query groupsGameDetailQuery(\n  $groupId: ID!\n  $gameId: ID!\n) {\n  groupById(id: $groupId) {\n    id\n    name\n    members(first: 50) {\n      edges {\n        node {\n          id\n          firstName\n          lastName\n        }\n      }\n    }\n  }\n  gameById(id: $gameId) {\n    id\n    group {\n      id\n    }\n    name\n    symbol\n    description\n    trophies(first: 200) {\n      edges {\n        node {\n          id\n          isAwarded\n          description\n          game {\n            id\n            symbol\n            name\n          }\n          receiver {\n            id\n            firstName\n            lastName\n          }\n          __typename\n        }\n        cursor\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n  me {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "4285fd9f3afccf8aaeef34d1c5749306";

export default node;
