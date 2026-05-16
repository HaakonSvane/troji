/**
 * @generated SignedSource<<023dba4df0e8b68bfe0a29e722cc0ee4>>
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
    "cacheID": "fb4f17745e44fce465e7dfc9d61a0164",
    "id": null,
    "metadata": {},
    "name": "settingsQuery",
    "operationKind": "query",
    "text": "query settingsQuery {\n  me {\n    id\n    displayName\n    avatarUrl(size: 256)\n    profile {\n      firstName\n      middleName\n      lastName\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "91a8702c7b466de271edb686352f47ea";

export default node;
