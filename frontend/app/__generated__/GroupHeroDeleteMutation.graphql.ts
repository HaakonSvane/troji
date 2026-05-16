/**
 * @generated SignedSource<<b45370b06037d84a76f4afc7010ec94d>>
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
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
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
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "deletedId",
            "storageKey": null
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
    "name": "GroupHeroDeleteMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "GroupHeroDeleteMutation",
    "selections": (v1/*: any*/)
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

(node as any).hash = "69e14c5bdcfbec96ef1da7e5999b0fd8";

export default node;
