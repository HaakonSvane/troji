/**
 * @generated SignedSource<<7f2f2e13a5e3201a0615870636175654>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type JoinGroupInput = {
  inviteCode: string;
};
export type JoinGroupFormMutation$variables = {
  input: JoinGroupInput;
};
export type JoinGroupFormMutation$data = {
  readonly joinGroup: {
    readonly errors: ReadonlyArray<{
      readonly __typename: "InviteExpiredError";
      readonly message: string;
    } | {
      // This will never be '%other', but we need some
      // value in case none of the concrete values match.
      readonly __typename: "%other";
    }> | null | undefined;
    readonly group: {
      readonly id: string;
      readonly name: string;
    } | null | undefined;
  };
};
export type JoinGroupFormMutation = {
  response: JoinGroupFormMutation$data;
  variables: JoinGroupFormMutation$variables;
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
    "concreteType": "JoinGroupPayload",
    "kind": "LinkedField",
    "name": "joinGroup",
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
            "args": null,
            "kind": "ScalarField",
            "name": "name",
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
            "type": "InviteExpiredError",
            "abstractKey": null
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
    "name": "JoinGroupFormMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "JoinGroupFormMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "2ab1d92dbec98748a53d036455cf1104",
    "id": null,
    "metadata": {},
    "name": "JoinGroupFormMutation",
    "operationKind": "mutation",
    "text": "mutation JoinGroupFormMutation(\n  $input: JoinGroupInput!\n) {\n  joinGroup(input: $input) {\n    group {\n      id\n      name\n    }\n    errors {\n      __typename\n      ... on InviteExpiredError {\n        message\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "79b0d37899972363c2315488b3bcc3bf";

export default node;
