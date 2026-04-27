/**
 * @generated SignedSource<<999d6f40fce5e21cfed20f91724ce8df>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type RuleType = "OPEN" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type GroupSocialCard_group$data = {
  readonly admin: {
    readonly firstName: string;
    readonly id: string;
    readonly lastName: string;
  } | null | undefined;
  readonly createdDate: any;
  readonly decisionModel: RuleType;
  readonly description: string | null | undefined;
  readonly id: string;
  readonly name: string;
  readonly " $fragmentType": "GroupSocialCard_group";
};
export type GroupSocialCard_group$key = {
  readonly " $data"?: GroupSocialCard_group$data;
  readonly " $fragmentSpreads": FragmentRefs<"GroupSocialCard_group">;
};

const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "GroupSocialCard_group",
  "selections": [
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    },
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
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "User",
      "kind": "LinkedField",
      "name": "admin",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "firstName",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "lastName",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "createdDate",
      "storageKey": null
    }
  ],
  "type": "Group",
  "abstractKey": null
};
})();

(node as any).hash = "3c8ec6ddb7745b3056a41138cc8b2fe9";

export default node;
