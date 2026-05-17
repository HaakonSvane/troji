/**
 * @generated SignedSource<<5ea493a5a6adb4103db6daeeda36a587>>
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
      "selections": (v1/*: any*/),
      "storageKey": null
    },
    {
      "alias": "transferableMembers",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 100
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
      "storageKey": "members(first:100)"
    }
  ],
  "type": "Group",
  "abstractKey": null
};
})();

(node as any).hash = "f0e749f1e54c5aaf2eca7d36bf44c49e";

export default node;
