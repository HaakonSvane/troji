/**
 * @generated SignedSource<<e7d173caa25e46d451841f3fc8dcfb47>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type useMeQuery$variables = Record<PropertyKey, never>;
export type useMeQuery$data = {
  readonly me: {
    readonly id: string;
  };
};
export type useMeQuery = {
  response: useMeQuery$data;
  variables: useMeQuery$variables;
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
    "name": "useMeQuery",
    "selections": (v0/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "useMeQuery",
    "selections": (v0/*: any*/)
  },
  "params": {
    "cacheID": "7052ac19fcbfcaba69774e4babfd8db8",
    "id": null,
    "metadata": {},
    "name": "useMeQuery",
    "operationKind": "query",
    "text": "query useMeQuery {\n  me {\n    id\n  }\n}\n"
  }
};
})();

(node as any).hash = "cbe7f58055d632256d5dbb516d9aa547";

export default node;
