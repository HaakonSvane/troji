/**
 * @generated SignedSource<<f2739ee00a4915d43791c0f9adb6fb39>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type UpdateUserDisplayNameInput = {
  displayName: string;
};
export type settingsDisplayNameMutation$variables = {
  input: UpdateUserDisplayNameInput;
};
export type settingsDisplayNameMutation$data = {
  readonly updateUserDisplayName: {
    readonly errors: ReadonlyArray<{
      readonly __typename: string;
      readonly message?: string;
    }> | null | undefined;
    readonly user: {
      readonly displayName: string;
      readonly id: string;
    } | null | undefined;
  };
};
export type settingsDisplayNameMutation = {
  response: settingsDisplayNameMutation$data;
  variables: settingsDisplayNameMutation$variables;
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
    "concreteType": "UpdateUserDisplayNamePayload",
    "kind": "LinkedField",
    "name": "updateUserDisplayName",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "User",
        "kind": "LinkedField",
        "name": "user",
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
            "name": "displayName",
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
          },
          {
            "kind": "InlineFragment",
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "message",
                "storageKey": null
              }
            ],
            "type": "Error",
            "abstractKey": "__isError"
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
    "name": "settingsDisplayNameMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "settingsDisplayNameMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "4094387b6090fa6aaef0b5a6ee965e5c",
    "id": null,
    "metadata": {},
    "name": "settingsDisplayNameMutation",
    "operationKind": "mutation",
    "text": "mutation settingsDisplayNameMutation(\n  $input: UpdateUserDisplayNameInput!\n) {\n  updateUserDisplayName(input: $input) {\n    user {\n      id\n      displayName\n    }\n    errors {\n      __typename\n      ... on Error {\n        __isError: __typename\n        message\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "4b0b4ba3e4dc8491957f91a0dbee08d7";

export default node;
