/**
 * @generated SignedSource<<ad63aea1ae5d251b9b3151b11c5d284e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type dashboardQuery$variables = Record<PropertyKey, never>;
export type dashboardQuery$data = {
  readonly me: {
    readonly firstName: string;
    readonly id: string;
  };
};
export type dashboardQuery = {
  response: dashboardQuery$data;
  variables: dashboardQuery$variables;
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
        "name": "firstName",
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
    "name": "dashboardQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "dashboardQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "227ec8644cfd14663c32eb93e5d0c128",
    "id": null,
    "metadata": {},
    "name": "dashboardQuery",
    "operationKind": "query",
    "text": "query dashboardQuery {\n  me {\n    id\n    firstName\n  }\n}\n"
  }
};
})();

(node as any).hash = "4796e9a8667dda449d37f7ac44040cb6";

export default node;
