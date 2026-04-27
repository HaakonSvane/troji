/**
 * @generated SignedSource<<f6d5d962e44cba1c2f4e631db0405575>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type GroupGamesTableRow_game$data = {
  readonly description: string | null | undefined;
  readonly id: string;
  readonly name: string;
  readonly symbol: string;
  readonly trophies: ReadonlyArray<{
    readonly id: string;
  }>;
  readonly " $fragmentType": "GroupGamesTableRow_game";
};
export type GroupGamesTableRow_game$key = {
  readonly " $data"?: GroupGamesTableRow_game$data;
  readonly " $fragmentSpreads": FragmentRefs<"GroupGamesTableRow_game">;
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
  "name": "GroupGamesTableRow_game",
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
      "name": "symbol",
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
      "concreteType": "Trophy",
      "kind": "LinkedField",
      "name": "trophies",
      "plural": true,
      "selections": [
        (v0/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "type": "Game",
  "abstractKey": null
};
})();

(node as any).hash = "cbf4101fb717a19b8cd90fba005e81db";

export default node;
