/**
 * @generated SignedSource<<ad3d3c05e5dfe586b5b1f342e56066bc>>
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
  readonly name: string;
  readonly transferableMembers: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly displayName: string;
        readonly id: string;
      };
    }> | null | undefined;
  } | null | undefined;
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
},
v1 = [
  (v0/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "displayName",
    "storageKey": null
  }
];
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
      "args": null,
      "concreteType": "User",
      "kind": "LinkedField",
      "name": "admin",
      "plural": false,
      "selections": (v1/*: any*/),
      "storageKey": null
    },
    {
      "alias": "transferableMembers",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 50
        }
      ],
      "concreteType": "MembersConnection",
      "kind": "LinkedField",
      "name": "members",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "MembersEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "User",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": (v1/*: any*/),
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "members(first:50)"
    }
  ],
  "type": "Group",
  "abstractKey": null
};
})();

(node as any).hash = "a485dc4bd8b8a77ed5299afe8b41f191";

export default node;
