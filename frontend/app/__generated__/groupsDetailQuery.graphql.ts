/**
 * @generated SignedSource<<ab19bb5d0f887c787fab17fba8874e89>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type groupsDetailQuery$variables = {
  id: string;
};
export type groupsDetailQuery$data = {
  readonly groupById: {
    readonly admin: {
      readonly id: string;
    } | null | undefined;
    readonly games: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly id: string;
          readonly " $fragmentSpreads": FragmentRefs<"GroupGamesTableRow_game">;
        };
      }> | null | undefined;
    } | null | undefined;
    readonly id: string;
    readonly invite: {
      readonly expirationDate: any;
      readonly inviteCode: string;
    } | null | undefined;
    readonly members: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly firstName: string;
          readonly id: string;
          readonly lastName: string;
          readonly " $fragmentSpreads": FragmentRefs<"MemberRow_user">;
        };
      }> | null | undefined;
    } | null | undefined;
    readonly trophies: ReadonlyArray<{
      readonly description: string | null | undefined;
      readonly game: {
        readonly id: string;
        readonly name: string;
        readonly symbol: string;
      };
      readonly id: string;
      readonly isAwarded: boolean;
      readonly receiver: {
        readonly firstName: string;
        readonly id: string;
        readonly lastName: string;
      };
      readonly request: {
        readonly approvals: ReadonlyArray<{
          readonly isApproved: boolean;
          readonly user: {
            readonly id: string;
          };
        }>;
        readonly id: number;
      };
    }>;
    readonly " $fragmentSpreads": FragmentRefs<"GroupSocialCard_group">;
  } | null | undefined;
  readonly me: {
    readonly id: string;
  };
};
export type groupsDetailQuery = {
  response: groupsDetailQuery$data;
  variables: groupsDetailQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = [
  (v2/*: any*/)
],
v4 = {
  "kind": "Literal",
  "name": "order",
  "value": {
    "createdDate": "DESC"
  }
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "concreteType": "PageInfo",
  "kind": "LinkedField",
  "name": "pageInfo",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "endCursor",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hasNextPage",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v8 = {
  "kind": "Literal",
  "name": "first",
  "value": 50
},
v9 = [
  (v8/*: any*/)
],
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "firstName",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "lastName",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "concreteType": "Invite",
  "kind": "LinkedField",
  "name": "invite",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "inviteCode",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "expirationDate",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "symbol",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v16 = [
  (v2/*: any*/),
  (v10/*: any*/),
  (v11/*: any*/)
],
v17 = {
  "alias": null,
  "args": null,
  "concreteType": "Trophy",
  "kind": "LinkedField",
  "name": "trophies",
  "plural": true,
  "selections": [
    (v2/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isAwarded",
      "storageKey": null
    },
    (v13/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "Game",
      "kind": "LinkedField",
      "name": "game",
      "plural": false,
      "selections": [
        (v2/*: any*/),
        (v14/*: any*/),
        (v15/*: any*/)
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "User",
      "kind": "LinkedField",
      "name": "receiver",
      "plural": false,
      "selections": (v16/*: any*/),
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "TrophyRequest",
      "kind": "LinkedField",
      "name": "request",
      "plural": false,
      "selections": [
        (v2/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "TrophyRequestApproval",
          "kind": "LinkedField",
          "name": "approvals",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "User",
              "kind": "LinkedField",
              "name": "user",
              "plural": false,
              "selections": (v3/*: any*/),
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "isApproved",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "concreteType": "User",
  "kind": "LinkedField",
  "name": "me",
  "plural": false,
  "selections": (v3/*: any*/),
  "storageKey": null
},
v19 = [
  (v8/*: any*/),
  (v4/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "groupsDetailQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Group",
        "kind": "LinkedField",
        "name": "groupById",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "admin",
            "plural": false,
            "selections": (v3/*: any*/),
            "storageKey": null
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "GroupSocialCard_group"
          },
          {
            "alias": "games",
            "args": [
              (v4/*: any*/)
            ],
            "concreteType": "GamesConnection",
            "kind": "LinkedField",
            "name": "__GroupDetail_games_connection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "GamesEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Game",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v2/*: any*/),
                      {
                        "args": null,
                        "kind": "FragmentSpread",
                        "name": "GroupGamesTableRow_game"
                      },
                      (v5/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v6/*: any*/)
                ],
                "storageKey": null
              },
              (v7/*: any*/)
            ],
            "storageKey": "__GroupDetail_games_connection(order:{\"createdDate\":\"DESC\"})"
          },
          {
            "alias": null,
            "args": (v9/*: any*/),
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
                    "selections": [
                      (v2/*: any*/),
                      (v10/*: any*/),
                      (v11/*: any*/),
                      {
                        "args": null,
                        "kind": "FragmentSpread",
                        "name": "MemberRow_user"
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "members(first:50)"
          },
          (v12/*: any*/),
          (v17/*: any*/)
        ],
        "storageKey": null
      },
      (v18/*: any*/)
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "groupsDetailQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Group",
        "kind": "LinkedField",
        "name": "groupById",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "User",
            "kind": "LinkedField",
            "name": "admin",
            "plural": false,
            "selections": (v16/*: any*/),
            "storageKey": null
          },
          (v15/*: any*/),
          (v13/*: any*/),
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
            "kind": "ScalarField",
            "name": "createdDate",
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v19/*: any*/),
            "concreteType": "GamesConnection",
            "kind": "LinkedField",
            "name": "games",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "GamesEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Game",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v2/*: any*/),
                      (v15/*: any*/),
                      (v14/*: any*/),
                      (v13/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Trophy",
                        "kind": "LinkedField",
                        "name": "trophies",
                        "plural": true,
                        "selections": (v3/*: any*/),
                        "storageKey": null
                      },
                      (v5/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v6/*: any*/)
                ],
                "storageKey": null
              },
              (v7/*: any*/)
            ],
            "storageKey": "games(first:50,order:{\"createdDate\":\"DESC\"})"
          },
          {
            "alias": null,
            "args": (v19/*: any*/),
            "filters": [
              "order"
            ],
            "handle": "connection",
            "key": "GroupDetail_games",
            "kind": "LinkedHandle",
            "name": "games"
          },
          {
            "alias": null,
            "args": (v9/*: any*/),
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
                    "selections": [
                      (v2/*: any*/),
                      (v10/*: any*/),
                      (v11/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "middleName",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "members(first:50)"
          },
          (v12/*: any*/),
          (v17/*: any*/)
        ],
        "storageKey": null
      },
      (v18/*: any*/)
    ]
  },
  "params": {
    "cacheID": "cd0394294ee6a80624273ccb305d43ca",
    "id": null,
    "metadata": {
      "connection": [
        {
          "count": null,
          "cursor": null,
          "direction": "forward",
          "path": [
            "groupById",
            "games"
          ]
        }
      ]
    },
    "name": "groupsDetailQuery",
    "operationKind": "query",
    "text": "query groupsDetailQuery(\n  $id: ID!\n) {\n  groupById(id: $id) {\n    id\n    admin {\n      id\n    }\n    ...GroupSocialCard_group\n    games(first: 50, order: {createdDate: DESC}) {\n      edges {\n        node {\n          id\n          ...GroupGamesTableRow_game\n          __typename\n        }\n        cursor\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n    members(first: 50) {\n      edges {\n        node {\n          id\n          firstName\n          lastName\n          ...MemberRow_user\n        }\n      }\n    }\n    invite {\n      inviteCode\n      expirationDate\n    }\n    trophies {\n      id\n      isAwarded\n      description\n      game {\n        id\n        symbol\n        name\n      }\n      receiver {\n        id\n        firstName\n        lastName\n      }\n      request {\n        id\n        approvals {\n          user {\n            id\n          }\n          isApproved\n        }\n      }\n    }\n  }\n  me {\n    id\n  }\n}\n\nfragment GroupGamesTableRow_game on Game {\n  id\n  name\n  symbol\n  description\n  trophies {\n    id\n  }\n}\n\nfragment GroupSocialCard_group on Group {\n  id\n  name\n  description\n  decisionModel\n  admin {\n    id\n    firstName\n    lastName\n  }\n  createdDate\n}\n\nfragment MemberRow_user on User {\n  id\n  firstName\n  middleName\n  lastName\n}\n"
  }
};
})();

(node as any).hash = "8a3cf42048ac3e7210b14e8ff6437e4f";

export default node;
