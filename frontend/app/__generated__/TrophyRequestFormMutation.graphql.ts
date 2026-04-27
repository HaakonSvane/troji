/**
 * @generated SignedSource<<ea45f48ecbcc15f9f0cfaf9d68a209fb>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreateTrophyRequestInput = {
  description?: string | null | undefined;
  gameId: string;
  userId: string;
};
export type TrophyRequestFormMutation$variables = {
  input: CreateTrophyRequestInput;
};
export type TrophyRequestFormMutation$data = {
  readonly createTrophyRequest: {
    readonly errors: ReadonlyArray<{
      readonly __typename: string;
    }> | null | undefined;
    readonly trophy: {
      readonly id: string;
      readonly isAwarded: boolean;
    } | null | undefined;
  };
};
export type TrophyRequestFormMutation = {
  response: TrophyRequestFormMutation$data;
  variables: TrophyRequestFormMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "CreateTrophyRequestPayload",
    "kind": "LinkedField",
    "name": "createTrophyRequest",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Trophy",
        "kind": "LinkedField",
        "name": "trophy",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isAwarded",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": null,
        "kind": "LinkedField",
        "name": "errors",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "TrophyRequestFormMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "TrophyRequestFormMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "13106bcb55f4ea016210d74fd9f2cd23",
    "id": null,
    "metadata": {},
    "name": "TrophyRequestFormMutation",
    "operationKind": "mutation",
    "text": "mutation TrophyRequestFormMutation(\n  $input: CreateTrophyRequestInput!\n) {\n  createTrophyRequest(input: $input) {\n    trophy {\n      id\n      isAwarded\n    }\n    errors {\n      __typename\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "1449995f6a888e9e19fed266f9596d6d";

export default node;
