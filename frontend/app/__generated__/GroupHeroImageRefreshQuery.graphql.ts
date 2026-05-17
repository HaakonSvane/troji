/**
 * @generated SignedSource<<90231cbc85e6f3f8588c93a8eefcbe9b>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type GroupHeroImageRefreshQuery$variables = {
  id: string;
};
export type GroupHeroImageRefreshQuery$data = {
  readonly groupById: {
    readonly id: string;
    readonly imageUrl: string | null | undefined;
  } | null | undefined;
};
export type GroupHeroImageRefreshQuery = {
  response: GroupHeroImageRefreshQuery$data;
  variables: GroupHeroImageRefreshQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "id"
      }
    ],
    "concreteType": "Group",
    "kind": "LinkedField",
    "name": "groupById",
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
        "name": "imageUrl",
        "storageKey": "imageUrl(size:256)"
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
    "name": "GroupHeroImageRefreshQuery",
    "selections": (v1/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "GroupHeroImageRefreshQuery",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "315a50a2b66782454345399255599276",
    "id": null,
    "metadata": {},
    "name": "GroupHeroImageRefreshQuery",
    "operationKind": "query",
    "text": "query GroupHeroImageRefreshQuery(\n  $id: ID!\n) {\n  groupById(id: $id) {\n    id\n    imageUrl(size: 256)\n  }\n}\n"
  }
};
})();

(node as any).hash = "6e9754122362ee28d3b8f102f9d602f3";

export default node;
