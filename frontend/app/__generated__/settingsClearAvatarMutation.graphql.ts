/**
 * @generated SignedSource<<2bea945b0b8c95cc9f1c7932b4864a6e>>
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
    "cacheID": "8e3310bca24d2564605aff62b5e06df0",
    "id": null,
    "metadata": {},
    "name": "settingsClearAvatarMutation",
    "operationKind": "mutation",
    "text": "mutation settingsClearAvatarMutation {\n  clearUserAvatar {\n    user {\n      id\n      avatarUrl(size: 256)\n    }\n    errors {\n      __typename\n      ... on Error {\n        __isError: __typename\n        message\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "3f3253e7f1b4463d8c34c62768aef63b";

export default node;
