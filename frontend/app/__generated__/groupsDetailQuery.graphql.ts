/**
 * @generated SignedSource<<1ff233b822d9509f2f502018bb8c2f71>>
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
    readonly awardedTrophyCount: number;
    readonly games: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly id: string;
          readonly name: string;
          readonly symbol: string;
          readonly " $fragmentSpreads": FragmentRefs<"GroupGamesTableRow_game">;
        };
      }> | null | undefined;
      readonly totalCount: number;
    } | null | undefined;
    readonly id: string;
    readonly invite: {
      readonly expirationDate: any;
      readonly inviteCode: string;
    } | null | undefined;
    readonly members: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly displayName: string;
          readonly id: string;
          readonly " $fragmentSpreads": FragmentRefs<"MemberRow_user">;
        };
      }> | null | undefined;
      readonly totalCount: number;
    } | null | undefined;
    readonly topPerformer: {
      readonly awardCount: number;
      readonly user: {
        readonly avatarUrl: string | null | undefined;
        readonly displayName: string;
        readonly id: string;
        readonly profile: {
          readonly firstName: string;
          readonly lastName: string;
          readonly middleName: string | null | undefined;
        };
      };
    } | null | undefined;
    readonly " $fragmentSpreads": FragmentRefs<"GroupActivityFeed_group" | "GroupHero_group">;
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "totalCount",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "symbol",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v9 = {
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
v10 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 3
  }
],
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "displayName",
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
  "name": "awardedTrophyCount",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "concreteType": "UserProfile",
  "kind": "LinkedField",
  "name": "profile",
  "plural": false,
  "selections": [
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
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "concreteType": "GroupTopPerformer",
  "kind": "LinkedField",
  "name": "topPerformer",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "User",
      "kind": "LinkedField",
      "name": "user",
      "plural": false,
      "selections": [
        (v2/*: any*/),
        (v11/*: any*/),
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
          "name": "avatarUrl",
          "storageKey": "avatarUrl(size:128)"
        },
        (v14/*: any*/)
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "awardCount",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "concreteType": "User",
  "kind": "LinkedField",
  "name": "me",
  "plural": false,
  "selections": (v3/*: any*/),
  "storageKey": null
},
v17 = [
  (v2/*: any*/),
  (v11/*: any*/)
],
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v19 = [
  (v2/*: any*/),
  (v11/*: any*/),
  (v14/*: any*/)
],
v20 = [
  (v2/*: any*/),
  (v11/*: any*/),
  {
    "alias": null,
    "args": [
      {
        "kind": "Literal",
        "name": "size",
        "value": 64
      }
    ],
    "kind": "ScalarField",
    "name": "avatarUrl",
    "storageKey": "avatarUrl(size:64)"
  },
  (v14/*: any*/)
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
            "name": "GroupHero_group"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "GroupActivityFeed_group"
          },
          {
            "alias": "games",
            "args": null,
            "concreteType": "GamesConnection",
            "kind": "LinkedField",
            "name": "__GroupDetail_games_connection",
            "plural": false,
            "selections": [
              (v4/*: any*/),
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
                      (v5/*: any*/),
                      (v6/*: any*/),
                      {
                        "args": null,
                        "kind": "FragmentSpread",
                        "name": "GroupGamesTableRow_game"
                      },
                      (v7/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v8/*: any*/)
                ],
                "storageKey": null
              },
              (v9/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v10/*: any*/),
            "concreteType": "MembersConnection",
            "kind": "LinkedField",
            "name": "members",
            "plural": false,
            "selections": [
              (v4/*: any*/),
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
            "storageKey": "members(first:3)"
          },
          (v12/*: any*/),
          (v13/*: any*/),
          (v15/*: any*/)
        ],
        "storageKey": null
      },
      (v16/*: any*/)
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
            "selections": (v17/*: any*/),
            "storageKey": null
          },
          (v5/*: any*/),
          (v18/*: any*/),
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
                    "selections": (v17/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "members(first:100)"
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "recentActivityCount",
            "storageKey": null
          },
          {
            "alias": null,
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 5
              }
            ],
            "concreteType": null,
            "kind": "LinkedField",
            "name": "recentActivity",
            "plural": true,
            "selections": [
              (v7/*: any*/),
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "occurredAt",
                "storageKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Trophy",
                    "kind": "LinkedField",
                    "name": "trophy",
                    "plural": false,
                    "selections": [
                      (v2/*: any*/),
                      (v18/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Game",
                        "kind": "LinkedField",
                        "name": "game",
                        "plural": false,
                        "selections": [
                          (v2/*: any*/),
                          (v6/*: any*/),
                          (v5/*: any*/)
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
                        "selections": (v19/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "User",
                        "kind": "LinkedField",
                        "name": "awardedBy",
                        "plural": false,
                        "selections": (v19/*: any*/),
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "type": "TrophyAwardedActivity",
                "abstractKey": null
              },
              {
                "kind": "InlineFragment",
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "User",
                    "kind": "LinkedField",
                    "name": "member",
                    "plural": false,
                    "selections": (v20/*: any*/),
                    "storageKey": null
                  }
                ],
                "type": "MemberJoinedActivity",
                "abstractKey": null
              }
            ],
            "storageKey": "recentActivity(first:5)"
          },
          {
            "alias": null,
            "args": (v10/*: any*/),
            "concreteType": "GamesConnection",
            "kind": "LinkedField",
            "name": "games",
            "plural": false,
            "selections": [
              (v4/*: any*/),
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
                      (v5/*: any*/),
                      (v6/*: any*/),
                      (v18/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "TrophiesConnection",
                        "kind": "LinkedField",
                        "name": "trophies",
                        "plural": false,
                        "selections": [
                          (v4/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v7/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v8/*: any*/)
                ],
                "storageKey": null
              },
              (v9/*: any*/)
            ],
            "storageKey": "games(first:3)"
          },
          {
            "alias": null,
            "args": (v10/*: any*/),
            "filters": null,
            "handle": "connection",
            "key": "GroupDetail_games",
            "kind": "LinkedHandle",
            "name": "games"
          },
          {
            "alias": null,
            "args": (v10/*: any*/),
            "concreteType": "MembersConnection",
            "kind": "LinkedField",
            "name": "members",
            "plural": false,
            "selections": [
              (v4/*: any*/),
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
                    "selections": (v20/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "members(first:3)"
          },
          (v12/*: any*/),
          (v13/*: any*/),
          (v15/*: any*/)
        ],
        "storageKey": null
      },
      (v16/*: any*/)
    ]
  },
  "params": {
    "cacheID": "77b7e612703611d08f40e852c4406863",
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
    "text": "query groupsDetailQuery(\n  $id: ID!\n) {\n  groupById(id: $id) {\n    id\n    admin {\n      id\n    }\n    ...GroupHero_group\n    ...GroupActivityFeed_group\n    games(first: 3) {\n      totalCount\n      edges {\n        node {\n          id\n          name\n          symbol\n          ...GroupGamesTableRow_game\n          __typename\n        }\n        cursor\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n    members(first: 3) {\n      totalCount\n      edges {\n        node {\n          id\n          displayName\n          ...MemberRow_user\n        }\n      }\n    }\n    invite {\n      inviteCode\n      expirationDate\n    }\n    awardedTrophyCount\n    topPerformer {\n      user {\n        id\n        displayName\n        avatarUrl(size: 128)\n        profile {\n          firstName\n          middleName\n          lastName\n        }\n      }\n      awardCount\n    }\n  }\n  me {\n    id\n  }\n}\n\nfragment GroupActivityFeed_group on Group {\n  recentActivityCount\n  recentActivity(first: 5) {\n    __typename\n    id\n    occurredAt\n    ... on TrophyAwardedActivity {\n      trophy {\n        id\n        description\n        game {\n          id\n          symbol\n          name\n        }\n        receiver {\n          id\n          displayName\n          profile {\n            firstName\n            middleName\n            lastName\n          }\n        }\n        awardedBy {\n          id\n          displayName\n          profile {\n            firstName\n            middleName\n            lastName\n          }\n        }\n      }\n    }\n    ... on MemberJoinedActivity {\n      member {\n        id\n        displayName\n        avatarUrl(size: 64)\n        profile {\n          firstName\n          middleName\n          lastName\n        }\n      }\n    }\n  }\n}\n\nfragment GroupGamesTableRow_game on Game {\n  id\n  name\n  symbol\n  description\n  trophies {\n    totalCount\n  }\n}\n\nfragment GroupHero_group on Group {\n  id\n  name\n  description\n  createdDate\n  imageUrl(size: 256)\n  admin {\n    id\n    displayName\n  }\n  transferableMembers: members(first: 100) {\n    edges {\n      node {\n        id\n        displayName\n      }\n    }\n  }\n}\n\nfragment MemberRow_user on User {\n  id\n  displayName\n  avatarUrl(size: 64)\n  profile {\n    firstName\n    middleName\n    lastName\n  }\n}\n"
  }
};
})();

(node as any).hash = "410f0e5ca5fcc02184bc6ebf33f3981f";

export default node;
