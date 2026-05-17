/**
 * @generated SignedSource<<2af06d5f05d12b8843cc17fd03829642>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type GroupBox_group$data = {
  readonly description: string | null | undefined;
  readonly id: string;
  readonly imageUrl: string | null | undefined;
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
      "args": [
        {
          "kind": "Literal",
          "name": "size",
          "value": 128
        }
      ],
      "kind": "ScalarField",
      "name": "imageUrl",
      "storageKey": "imageUrl(size:128)"
    }
  ],
  "type": "Group",
  "abstractKey": null
};

(node as any).hash = "8bbfa09db3b3a8cb067be661075675c5";

export default node;
