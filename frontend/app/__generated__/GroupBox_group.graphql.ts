/**
 * @generated SignedSource<<5b42a8c6c2612f1139db3ce4e4a04283>>
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
  readonly members: {
    readonly edges: ReadonlyArray<{
      readonly node: {
        readonly id: string;
        readonly " $fragmentSpreads": FragmentRefs<"UserAvatarStack_users">;
      };
    }> | null | undefined;
    readonly totalCount: number;
  } | null | undefined;
  readonly name: string;
  readonly " $fragmentType": "GroupBox_group";
};
export type GroupBox_group$key = {
  readonly " $data"?: GroupBox_group$data;
  readonly " $fragmentSpreads": FragmentRefs<"GroupBox_group">;
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
  "name": "GroupBox_group",
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
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 4
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
          "kind": "ScalarField",
          "name": "totalCount",
          "storageKey": null
        },
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
              "selections": [
                (v0/*: any*/),
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "UserAvatarStack_users"
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "members(first:4)"
    }
  ],
  "type": "Group",
  "abstractKey": null
};
})();

(node as any).hash = "ccb1b95690612137c59764ed495af721";

export default node;
