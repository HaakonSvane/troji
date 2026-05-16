/**
 * @generated SignedSource<<42a481854b3bda0b07530e33d3f74fd8>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type DeleteGroupInput = {
  confirmName: string;
  groupId: string;
};
export type GroupHeroDeleteMutation$variables = {
  input: DeleteGroupInput;
};
export type GroupHeroDeleteMutation$data = {
  readonly deleteGroup: {
    readonly deletedGroupPayload: {
      readonly deletedId: string;
    } | null | undefined;
    readonly errors: ReadonlyArray<{
      readonly __typename: string;
      readonly message?: string;
    }> | null | undefined;
  };
};
export type GroupHeroDeleteMutation = {
  response: GroupHeroDeleteMutation$data;
  variables: GroupHeroDeleteMutation$variables;
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
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "deletedId",
  "storageKey": null
},
v3 = {
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
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "GroupHeroDeleteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "DeleteGroupPayload",
        "kind": "LinkedField",
        "name": "deleteGroup",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "DeletedGroupPayload",
            "kind": "LinkedField",
            "name": "deletedGroupPayload",
            "plural": false,
            "selections": [
              (v2/*: any*/)
            ],
            "storageKey": null
          },
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "GroupHeroDeleteMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "DeleteGroupPayload",
        "kind": "LinkedField",
        "name": "deleteGroup",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "DeletedGroupPayload",
            "kind": "LinkedField",
            "name": "deletedGroupPayload",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "filters": null,
                "handle": "deleteRecord",
                "key": "",
                "kind": "ScalarHandle",
                "name": "deletedId"
              }
            ],
            "storageKey": null
          },
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "9d703d71bf5a780805e6bc20f879d586",
    "id": null,
    "metadata": {},
    "name": "GroupHeroDeleteMutation",
    "operationKind": "mutation",
    "text": "mutation GroupHeroDeleteMutation(\n  $input: DeleteGroupInput!\n) {\n  deleteGroup(input: $input) {\n    deletedGroupPayload {\n      deletedId\n    }\n    errors {\n      __typename\n      ... on Error {\n        __isError: __typename\n        message\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "5da8d9179e53bbbe000a11432128273d";

export default node;
