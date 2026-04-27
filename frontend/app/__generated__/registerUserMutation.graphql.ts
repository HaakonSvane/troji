/**
 * @generated SignedSource<<f26b3f290c52b1e04b6bf9831763c06a>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type RegisterUserInput = {
  firstName: string;
  lastName: string;
  middleName?: string | null | undefined;
};
export type registerUserMutation$variables = {
  input: RegisterUserInput;
};
export type registerUserMutation$data = {
  readonly registerUser: {
    readonly errors: ReadonlyArray<{
      readonly __typename: "UserAlreadyRegisteredError";
      readonly message: string;
    } | {
      // This will never be '%other', but we need some
      // value in case none of the concrete values match.
      readonly __typename: "%other";
    }> | null | undefined;
    readonly user: {
      readonly firstName: string;
      readonly id: string;
      readonly lastName: string;
    } | null | undefined;
  };
};
export type registerUserMutation = {
  response: registerUserMutation$data;
  variables: registerUserMutation$variables;
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
    "concreteType": "RegisterUserPayload",
    "kind": "LinkedField",
    "name": "registerUser",
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
            "type": "UserAlreadyRegisteredError",
            "abstractKey": null
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
    "name": "registerUserMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "registerUserMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "2ef530528c0223a0fc5dafd43daa9740",
    "id": null,
    "metadata": {},
    "name": "registerUserMutation",
    "operationKind": "mutation",
    "text": "mutation registerUserMutation(\n  $input: RegisterUserInput!\n) {\n  registerUser(input: $input) {\n    user {\n      id\n      firstName\n      lastName\n    }\n    errors {\n      __typename\n      ... on UserAlreadyRegisteredError {\n        message\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "d4e1b11ce5a27f3381795a9f170fb6fc";

export default node;
