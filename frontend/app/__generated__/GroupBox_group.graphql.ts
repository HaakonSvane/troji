/**
 * @generated SignedSource<<1700ae6ff1ae597b335d6e1976c3e4ac>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
export type RuleType = "OPEN" | "%future added value";
import { FragmentRefs } from "relay-runtime";
export type GroupBox_group$data = {
  readonly decisionModel: RuleType;
  readonly description: string | null | undefined;
  readonly id: string;
  readonly name: string;
  readonly " $fragmentType": "GroupBox_group";
};
export type GroupBox_group$key = {
  readonly " $data"?: GroupBox_group$data;
  readonly " $fragmentSpreads": FragmentRefs<"GroupBox_group">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "GroupBox_group",
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
    }
  ],
  "type": "Group",
  "abstractKey": null
};

(node as any).hash = "b2a7ea146947a13efbfd82b086cbe1f7";

export default node;
