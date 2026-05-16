/**
 * @generated SignedSource<<aa4aea7db68b3397d41f171baf350f6b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type settingsQuery$variables = Record<PropertyKey, never>;
export type settingsQuery$data = {
  readonly me: {
    readonly avatarUrl: string | null | undefined;
    readonly displayName: string;
    readonly id: string;
    readonly navAvatarUrl: string | null | undefined;
    readonly profile: {
      readonly firstName: string;
      readonly lastName: string;
      readonly middleName: string | null | undefined;
    };
  };
};
export type settingsQuery = {
  response: settingsQuery$data;
  variables: settingsQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "me",
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
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "settingsQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "settingsQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "8e1e4fd0771f38bbc5c2326d0dcc1160",
    "id": null,
    "metadata": {},
    "name": "settingsQuery",
    "operationKind": "query",
    "text": "query settingsQuery {\n  me {\n    id\n    displayName\n    avatarUrl(size: 256)\n    navAvatarUrl: avatarUrl(size: 64)\n    profile {\n      firstName\n      middleName\n      lastName\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "99805057edbcea740f16dac5810f7898";

export default node;
