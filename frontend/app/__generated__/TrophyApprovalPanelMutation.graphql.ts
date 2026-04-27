/**
 * @generated SignedSource<<532d49f92986a28fbf4f6ecf80920762>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
export type ApproveTrophyInput = {
  trophyId: string;
};
export type TrophyApprovalPanelMutation$variables = {
  input: ApproveTrophyInput;
};
export type TrophyApprovalPanelMutation$data = {
  readonly approveTrophy: {
    readonly errors: ReadonlyArray<{
      readonly __typename: string;
    }> | null | undefined;
    readonly trophy: {
      readonly id: string;
      readonly isAwarded: boolean;
    } | null | undefined;
  };
};
export type TrophyApprovalPanelMutation = {
  response: TrophyApprovalPanelMutation$data;
  variables: TrophyApprovalPanelMutation$variables;
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
    "concreteType": "ApproveTrophyPayload",
    "kind": "LinkedField",
    "name": "approveTrophy",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Trophy",
        "kind": "LinkedField",
        "name": "trophy",
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
            "name": "isAwarded",
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
    "name": "TrophyApprovalPanelMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "TrophyApprovalPanelMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "7f13d1596249e21203098cb2110f89fa",
    "id": null,
    "metadata": {},
    "name": "TrophyApprovalPanelMutation",
    "operationKind": "mutation",
    "text": "mutation TrophyApprovalPanelMutation(\n  $input: ApproveTrophyInput!\n) {\n  approveTrophy(input: $input) {\n    trophy {\n      id\n      isAwarded\n    }\n    errors {\n      __typename\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "853a24962a5d84e801ca1b77ef91b703";

export default node;
