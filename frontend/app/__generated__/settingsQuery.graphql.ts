/**
 * @generated SignedSource<<a18b2c2bdf4ee9d48bbbf71979b02423>>
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
    readonly displayName: string;
    readonly id: string;
    readonly imageId: string | null | undefined;
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
        "args": null,
        "kind": "ScalarField",
        "name": "imageId",
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
    "cacheID": "b8f7fd6d3bc4e2eda5ea2e94043b371a",
    "id": null,
    "metadata": {},
    "name": "settingsQuery",
    "operationKind": "query",
    "text": "query settingsQuery {\n  me {\n    id\n    displayName\n    imageId\n    profile {\n      firstName\n      middleName\n      lastName\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "a96875ff0827638439be06aef12eadfa";

export default node;
