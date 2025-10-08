/**
 * @generated SignedSource<<96383b3aae706ba2152704767661cb92>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CreateGameInput = {
  description?: string | null | undefined;
  groupId: string;
  name: string;
  symbol: string;
};
export type NewGameFormMutation$variables = {
  connections: ReadonlyArray<string>;
  input: CreateGameInput;
};
export type NewGameFormMutation$data = {
  readonly createGame: {
    readonly game: {
      readonly " $fragmentSpreads": FragmentRefs<"GroupGamesTableRowFragment">;
    } | null | undefined;
  };
};
export type NewGameFormMutation = {
  response: NewGameFormMutation$data;
  variables: NewGameFormMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "connections"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "input"
},
v2 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "NewGameFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "CreateGamePayload",
        "kind": "LinkedField",
        "name": "createGame",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Game",
            "kind": "LinkedField",
            "name": "game",
            "plural": false,
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "GroupGamesTableRowFragment"
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "NewGameFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "CreateGamePayload",
        "kind": "LinkedField",
        "name": "createGame",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Game",
            "kind": "LinkedField",
            "name": "game",
            "plural": false,
            "selections": [
              (v3/*: any*/),
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
                  (v3/*: any*/)
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
                          },
                          (v3/*: any*/)
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
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v2/*: any*/),
        "filters": null,
        "handle": "prependNode",
        "key": "",
        "kind": "LinkedHandle",
        "name": "createGame",
        "handleArgs": [
          {
            "kind": "Variable",
            "name": "connections",
            "variableName": "connections"
          },
          {
            "kind": "Literal",
            "name": "edgeTypeName",
            "value": "GamesEdge"
          }
        ]
      }
    ]
  },
  "params": {
    "cacheID": "8bb710a85a810238aa5de273916b90be",
    "id": null,
    "metadata": {},
    "name": "NewGameFormMutation",
    "operationKind": "mutation",
    "text": "mutation NewGameFormMutation(\n  $input: CreateGameInput!\n) {\n  createGame(input: $input) {\n    game {\n      ...GroupGamesTableRowFragment\n      id\n    }\n  }\n}\n\nfragment GroupGamesTableRowFragment on Game {\n  id\n  symbol\n  name\n  description\n  trophies {\n    id\n  }\n  topPlayers(first: 1) {\n    edges {\n      node {\n        username\n        id\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "2d68828982d5ea167940faecc0cb9858";

export default node;
