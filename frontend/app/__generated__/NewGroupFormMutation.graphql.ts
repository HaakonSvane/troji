/**
 * @generated SignedSource<<3e5506ee8d5f24c4224b3d8c44be8ef3>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CreateGroupInput = {
  description?: string | null | undefined;
  name: string;
};
export type NewGroupFormMutation$variables = {
  connections: ReadonlyArray<string>;
  input: CreateGroupInput;
};
export type NewGroupFormMutation$data = {
  readonly createGroup: {
    readonly errors: ReadonlyArray<{
      readonly __typename: string;
      readonly message?: string;
    }> | null | undefined;
    readonly group: {
      readonly id: string;
      readonly name: string;
      readonly " $fragmentSpreads": FragmentRefs<"GroupBox_group">;
    } | null | undefined;
  };
};
export type NewGroupFormMutation = {
  response: NewGroupFormMutation$data;
  variables: NewGroupFormMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "connections"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "input"
},
v2 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v5 = {
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
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "NewGroupFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "CreateGroupPayload",
        "kind": "LinkedField",
        "name": "createGroup",
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
              (v3/*: any*/),
              (v4/*: any*/),
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "GroupBox_group"
              }
            ],
            "storageKey": null
          },
          (v5/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "NewGroupFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "CreateGroupPayload",
        "kind": "LinkedField",
        "name": "createGroup",
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
              (v3/*: any*/),
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "description",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "decisionModel",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "prependNode",
            "key": "",
            "kind": "LinkedHandle",
            "name": "group",
            "handleArgs": [
              {
                "kind": "Variable",
                "name": "connections",
                "variableName": "connections"
              },
              {
                "kind": "Literal",
                "name": "edgeTypeName",
                "value": "GroupsEdge"
              }
            ]
          },
          (v5/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "4448155fb88915f72696ee2e05b766d5",
    "id": null,
    "metadata": {},
    "name": "NewGroupFormMutation",
    "operationKind": "mutation",
    "text": "mutation NewGroupFormMutation(\n  $input: CreateGroupInput!\n) {\n  createGroup(input: $input) {\n    group {\n      id\n      name\n      ...GroupBox_group\n    }\n    errors {\n      __typename\n      ... on Error {\n        __isError: __typename\n        message\n      }\n    }\n  }\n}\n\nfragment GroupBox_group on Group {\n  id\n  name\n  description\n  decisionModel\n}\n"
  }
};
})();

(node as any).hash = "0c83fc9468fb71999a88d76f4e6ea4b9";

export default node;
