/**
 * @generated SignedSource<<788f0797908bac305839aa058480b8d4>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type GroupInviteMutation$variables = {
  groupId: string;
};
export type GroupInviteMutation$data = {
  readonly createGroupInvite: {
    readonly invite: {
      readonly expirationDate: any;
      readonly inviteCode: string;
    } | null | undefined;
  };
};
export type GroupInviteMutation = {
  response: GroupInviteMutation$data;
  variables: GroupInviteMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "groupId"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "fields": [
          {
            "kind": "Variable",
            "name": "groupId",
            "variableName": "groupId"
          }
        ],
        "kind": "ObjectValue",
        "name": "input"
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
    "name": "GroupInviteMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "GroupInviteMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "8d76d9c7ab2e2fac454eab0c19674b65",
    "id": null,
    "metadata": {},
    "name": "GroupInviteMutation",
    "operationKind": "mutation",
    "text": "mutation GroupInviteMutation(\n  $groupId: ID!\n) {\n  createGroupInvite(input: {groupId: $groupId}) {\n    invite {\n      inviteCode\n      expirationDate\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "2046e8e94b5d515efa67b3a81db1731b";

export default node;
