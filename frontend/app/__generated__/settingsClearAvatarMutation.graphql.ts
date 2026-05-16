/**
 * @generated SignedSource<<b3074b2349dd5dae96935ad89509f4f1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type settingsClearAvatarMutation$variables = Record<PropertyKey, never>;
export type settingsClearAvatarMutation$data = {
  readonly clearUserAvatar: {
    readonly errors: ReadonlyArray<{
      readonly __typename: string;
      readonly message?: string;
    }> | null | undefined;
    readonly user: {
      readonly avatarUrl: string | null | undefined;
      readonly id: string;
      readonly navAvatarUrl: string | null | undefined;
    } | null | undefined;
  };
};
export type settingsClearAvatarMutation = {
  response: settingsClearAvatarMutation$data;
  variables: settingsClearAvatarMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "ClearUserAvatarPayload",
    "kind": "LinkedField",
    "name": "clearUserAvatar",
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
            "args": [
              {
                "kind": "Literal",
                "name": "size",
                "value": 256
              }
            ],
            "kind": "ScalarField",
            "name": "avatarUrl",
            "storageKey": "avatarUrl(size:256)"
          },
          {
            "alias": "navAvatarUrl",
            "args": [
              {
                "kind": "Literal",
                "name": "size",
                "value": 64
              }
            ],
            "kind": "ScalarField",
            "name": "avatarUrl",
            "storageKey": "avatarUrl(size:64)"
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
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "settingsClearAvatarMutation",
    "selections": (v0/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "settingsClearAvatarMutation",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "c79d1dafd5a89da3f279d665e2957516",
    "id": null,
    "metadata": {},
    "name": "settingsClearAvatarMutation",
    "operationKind": "mutation",
    "text": "mutation settingsClearAvatarMutation {\n  clearUserAvatar {\n    user {\n      id\n      avatarUrl(size: 256)\n      navAvatarUrl: avatarUrl(size: 64)\n    }\n    errors {\n      __typename\n      ... on Error {\n        __isError: __typename\n        message\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "f50916f3b86d91c1e64a6f8c5b51ee6e";

export default node;
