/**
 * @generated SignedSource<<2f7524b66f363f74586efd5ed858bfe9>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type TransferGroupAdminInput = {
  groupId: string;
  newAdminId: string;
};
export type GroupHeroTransferAdminMutation$variables = {
  input: TransferGroupAdminInput;
};
export type GroupHeroTransferAdminMutation$data = {
  readonly transferGroupAdmin: {
    readonly errors: ReadonlyArray<{
      readonly __typename: string;
      readonly message?: string;
    }> | null | undefined;
    readonly group: {
      readonly admin: {
        readonly displayName: string;
        readonly id: string;
      } | null | undefined;
      readonly id: string;
    } | null | undefined;
  };
};
export type GroupHeroTransferAdminMutation = {
  response: GroupHeroTransferAdminMutation$data;
  variables: GroupHeroTransferAdminMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "TransferGroupAdminPayload",
    "kind": "LinkedField",
    "name": "transferGroupAdmin",
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
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "admin",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "displayName",
                "storageKey": null
              }
            ],
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
    "name": "GroupHeroTransferAdminMutation",
    "selections": (v2/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "GroupHeroTransferAdminMutation",
    "selections": (v2/*: any*/)
  },
  "params": {
    "cacheID": "3ba2be41fd316246ce1341ee21b3fcaa",
    "id": null,
    "metadata": {},
    "name": "GroupHeroTransferAdminMutation",
    "operationKind": "mutation",
    "text": "mutation GroupHeroTransferAdminMutation(\n  $input: TransferGroupAdminInput!\n) {\n  transferGroupAdmin(input: $input) {\n    group {\n      id\n      admin {\n        id\n        displayName\n      }\n    }\n    errors {\n      __typename\n      ... on Error {\n        __isError: __typename\n        message\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "6983f744086e723fcf355cd477bc5013";

export default node;
