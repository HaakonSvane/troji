/**
 * @generated SignedSource<<3eaf8aeec89f9d0f90a0b2dc130d4835>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type CreateGroupInviteInput = {
  groupId: string;
};
export type GroupInvitePanelCreateMutation$variables = {
  input: CreateGroupInviteInput;
};
export type GroupInvitePanelCreateMutation$data = {
  readonly createGroupInvite: {
    readonly errors: ReadonlyArray<{
      readonly __typename: "InviteResetTooSoonError";
      readonly message: string;
      readonly secondsToWait: number;
    } | {
      // This will never be '%other', but we need some
      // value in case none of the concrete values match.
      readonly __typename: "%other";
    }> | null | undefined;
    readonly invite: {
      readonly expirationDate: any;
      readonly inviteCode: string;
    } | null | undefined;
  };
};
export type GroupInvitePanelCreateMutation = {
  response: GroupInvitePanelCreateMutation$data;
  variables: GroupInvitePanelCreateMutation$variables;
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
    "concreteType": "CreateGroupInvitePayload",
    "kind": "LinkedField",
    "name": "createGroupInvite",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Invite",
        "kind": "LinkedField",
        "name": "invite",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "inviteCode",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "expirationDate",
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
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "secondsToWait",
                "storageKey": null
              }
            ],
            "type": "InviteResetTooSoonError",
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
    "name": "GroupInvitePanelCreateMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "GroupInvitePanelCreateMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "d0f6b003b0b0cac8c2cf9dbac2eb1e66",
    "id": null,
    "metadata": {},
    "name": "GroupInvitePanelCreateMutation",
    "operationKind": "mutation",
    "text": "mutation GroupInvitePanelCreateMutation(\n  $input: CreateGroupInviteInput!\n) {\n  createGroupInvite(input: $input) {\n    invite {\n      inviteCode\n      expirationDate\n    }\n    errors {\n      __typename\n      ... on InviteResetTooSoonError {\n        message\n        secondsToWait\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "c4ce8de922d2ea3fbe5bccd56f2fdb3b";

export default node;
