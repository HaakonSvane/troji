/**
 * @generated SignedSource<<abae4287f41f9af57499baed52d4bd63>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type MemberRow_user$data = {
  readonly firstName: string;
  readonly id: string;
  readonly lastName: string;
  readonly middleName: string | null | undefined;
  readonly " $fragmentType": "MemberRow_user";
};
export type MemberRow_user$key = {
  readonly " $data"?: MemberRow_user$data;
  readonly " $fragmentSpreads": FragmentRefs<"MemberRow_user">;
};

const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MemberRow_user",
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
      "name": "firstName",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "middleName",
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
  "type": "User",
  "abstractKey": null
};

(node as any).hash = "79f5ae2bef4326c8ed6f4097cb5289bb";

export default node;
