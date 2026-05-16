/**
 * @generated SignedSource<<cce94b6b837d0261d03df447c9ca7038>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type UpdateUserProfileInput = {
  firstName: string;
  lastName: string;
  middleName?: string | null | undefined;
};
export type settingsProfileMutation$variables = {
  input: UpdateUserProfileInput;
};
export type settingsProfileMutation$data = {
  readonly updateUserProfile: {
    readonly errors: ReadonlyArray<{
      readonly __typename: string;
      readonly message?: string;
    }> | null | undefined;
    readonly user: {
      readonly id: string;
      readonly profile: {
        readonly firstName: string;
        readonly lastName: string;
        readonly middleName: string | null | undefined;
      };
    } | null | undefined;
  };
};
export type settingsProfileMutation = {
  response: settingsProfileMutation$data;
  variables: settingsProfileMutation$variables;
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
    "concreteType": "UpdateUserProfilePayload",
    "kind": "LinkedField",
    "name": "updateUserProfile",
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
    "name": "settingsProfileMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "settingsProfileMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "7153b9e15128bc9ae7f1096a55fb9dfe",
    "id": null,
    "metadata": {},
    "name": "settingsProfileMutation",
    "operationKind": "mutation",
    "text": "mutation settingsProfileMutation(\n  $input: UpdateUserProfileInput!\n) {\n  updateUserProfile(input: $input) {\n    user {\n      id\n      profile {\n        firstName\n        middleName\n        lastName\n      }\n    }\n    errors {\n      __typename\n      ... on Error {\n        __isError: __typename\n        message\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "21a3bd7a474cfe8d152c4c7fd33f5dd7";

export default node;
