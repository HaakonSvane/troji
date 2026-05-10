/**
 * @generated SignedSource<<3ca2e7d16c95bda4381b7855aafdc3e8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type AwardTrophyButtonDataQuery$variables = {
  groupId: string;
};
export type AwardTrophyButtonDataQuery$data = {
  readonly groupById: {
    readonly games: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly id: string;
          readonly name: string;
          readonly symbol: string;
        };
      }> | null | undefined;
    } | null | undefined;
    readonly members: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly firstName: string;
          readonly id: string;
          readonly lastName: string;
        };
      }> | null | undefined;
    } | null | undefined;
  } | null | undefined;
};
export type AwardTrophyButtonDataQuery = {
  response: AwardTrophyButtonDataQuery$data;
  variables: AwardTrophyButtonDataQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "groupId"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "groupId"
  }
],
v2 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 50
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": (v2/*: any*/),
  "concreteType": "GamesConnection",
  "kind": "LinkedField",
  "name": "games",
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
            (v3/*: any*/),
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
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": "games(first:50)"
},
v5 = {
  "alias": null,
  "args": (v2/*: any*/),
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
          "selections": [
            (v3/*: any*/),
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
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": "members(first:50)"
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "AwardTrophyButtonDataQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Group",
        "kind": "LinkedField",
        "name": "groupById",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          (v5/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "AwardTrophyButtonDataQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Group",
        "kind": "LinkedField",
        "name": "groupById",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          (v5/*: any*/),
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "025ee17fce112067f98bfcf7757d3f50",
    "id": null,
    "metadata": {},
    "name": "AwardTrophyButtonDataQuery",
    "operationKind": "query",
    "text": "query AwardTrophyButtonDataQuery(\n  $groupId: ID!\n) {\n  groupById(id: $groupId) {\n    games(first: 50) {\n      edges {\n        node {\n          id\n          name\n          symbol\n        }\n      }\n    }\n    members(first: 50) {\n      edges {\n        node {\n          id\n          firstName\n          lastName\n        }\n      }\n    }\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "e5016b87e392551103c7220a5acf1707";

export default node;
