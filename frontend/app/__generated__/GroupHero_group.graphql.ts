/**
 * @generated SignedSource<<d5d9dae05547d44a1b6b381e7daabaf1>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type GroupHero_group$data = {
  readonly admin: {
    readonly displayName: string;
    readonly id: string;
  } | null | undefined;
  readonly createdDate: any;
  readonly description: string | null | undefined;
  readonly id: string;
  readonly imageUrl: string | null | undefined;
  readonly name: string;
  readonly " $fragmentType": "GroupHero_group";
};
export type GroupHero_group$key = {
  readonly " $data"?: GroupHero_group$data;
  readonly " $fragmentSpreads": FragmentRefs<"GroupHero_group">;
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
  "name": "GroupHero_group",
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
      "name": "createdDate",
      "storageKey": null
    },
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "size",
          "value": 256
        }
      ],
      "kind": "ScalarField",
      "name": "imageUrl",
      "storageKey": "imageUrl(size:256)"
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
          "name": "displayName",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Group",
  "abstractKey": null
};
})();

(node as any).hash = "e93e5e1d4054c521f7156bc81a37e34c";

export default node;
