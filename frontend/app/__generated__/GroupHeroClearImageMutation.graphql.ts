/**
 * @generated SignedSource<<d2858f70adeb462395f962a7ffc7794d>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ClearGroupImageInput = {
  groupId: string;
};
export type GroupHeroClearImageMutation$variables = {
  input: ClearGroupImageInput;
};
export type GroupHeroClearImageMutation$data = {
  readonly clearGroupImage: {
    readonly errors: ReadonlyArray<{
      readonly __typename: string;
      readonly message?: string;
    }> | null | undefined;
    readonly group: {
      readonly id: string;
      readonly imageUrl: string | null | undefined;
    } | null | undefined;
  };
};
export type GroupHeroClearImageMutation = {
  response: GroupHeroClearImageMutation$data;
  variables: GroupHeroClearImageMutation$variables;
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
    "concreteType": "ClearGroupImagePayload",
    "kind": "LinkedField",
    "name": "clearGroupImage",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Group",
        "kind": "LinkedField",
        "name": "group",
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
    "name": "GroupHeroClearImageMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "GroupHeroClearImageMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "31c24eb37a70a65b17f255af4ec8b5a1",
    "id": null,
    "metadata": {},
    "name": "GroupHeroClearImageMutation",
    "operationKind": "mutation",
    "text": "mutation GroupHeroClearImageMutation(\n  $input: ClearGroupImageInput!\n) {\n  clearGroupImage(input: $input) {\n    group {\n      id\n      imageUrl(size: 256)\n    }\n    errors {\n      __typename\n      ... on Error {\n        __isError: __typename\n        message\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "0a33ab38b203054403da3c1559e88884";

export default node;
