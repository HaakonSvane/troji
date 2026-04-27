/**
 * @generated SignedSource<<2f30c66b83fab75a33aef0b43d621c99>>
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
    readonly trophies: ReadonlyArray<{
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
    }>;
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
v5 = [
  (v2/*: any*/)
],
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "symbol",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v8 = [
  {
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
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "gameId"
      }
    ],
    "concreteType": "Game",
    "kind": "LinkedField",
    "name": "gameById",
    "plural": false,
    "selections": [
      (v2/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "Group",
        "kind": "LinkedField",
        "name": "group",
        "plural": false,
        "selections": (v5/*: any*/),
        "storageKey": null
      },
      (v3/*: any*/),
      (v6/*: any*/),
      (v7/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "Trophy",
        "kind": "LinkedField",
        "name": "trophies",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isAwarded",
            "storageKey": null
          },
          (v7/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Game",
            "kind": "LinkedField",
            "name": "game",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v6/*: any*/),
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
          }
        ],
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
    "name": "me",
    "plural": false,
    "selections": (v5/*: any*/),
    "storageKey": null
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
    "selections": (v8/*: any*/),
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
    "selections": (v8/*: any*/)
  },
  "params": {
    "cacheID": "80bbcaf0ba2f6854583ff1ae5295a771",
    "id": null,
    "metadata": {},
    "name": "groupsGameDetailQuery",
    "operationKind": "query",
    "text": "query groupsGameDetailQuery(\n  $groupId: ID!\n  $gameId: ID!\n) {\n  groupById(id: $groupId) {\n    id\n    name\n    members(first: 50) {\n      edges {\n        node {\n          id\n          firstName\n          lastName\n        }\n      }\n    }\n  }\n  gameById(id: $gameId) {\n    id\n    group {\n      id\n    }\n    name\n    symbol\n    description\n    trophies {\n      id\n      isAwarded\n      description\n      game {\n        id\n        symbol\n        name\n      }\n      receiver {\n        id\n        firstName\n        lastName\n      }\n    }\n  }\n  me {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "574b12a6ef893dd7b3073a30eeb9ca0d";

export default node;
