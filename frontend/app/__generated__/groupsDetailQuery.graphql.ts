/**
 * @generated SignedSource<<a3d75afdb233669514b8fb58ea6c5866>>
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
          readonly name: string;
          readonly symbol: string;
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
          readonly middleName: string | null | undefined;
          readonly " $fragmentSpreads": FragmentRefs<"MemberRow_user">;
        };
      }> | null | undefined;
    } | null | undefined;
    readonly trophies: {
      readonly edges: ReadonlyArray<{
        readonly node: {
          readonly id: string;
          readonly isAwarded: boolean;
          readonly receiver: {
            readonly firstName: string;
            readonly id: string;
            readonly lastName: string;
            readonly middleName: string | null | undefined;
          };
        };
      }> | null | undefined;
      readonly pageInfo: {
        readonly hasNextPage: boolean;
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
  "kind": "ScalarField",
  "name": "endCursor",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hasNextPage",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "concreteType": "PageInfo",
  "kind": "LinkedField",
  "name": "pageInfo",
  "plural": false,
  "selections": [
    (v9/*: any*/),
    (v10/*: any*/)
  ],
  "storageKey": null
},
v12 = {
  "kind": "Literal",
  "name": "first",
  "value": 50
},
v13 = [
  (v12/*: any*/)
],
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "firstName",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "middleName",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "lastName",
  "storageKey": null
},
v17 = {
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
v18 = [
  (v2/*: any*/),
  (v14/*: any*/),
  (v15/*: any*/),
  (v16/*: any*/)
],
v19 = {
  "alias": null,
  "args": null,
  "concreteType": "User",
  "kind": "LinkedField",
  "name": "receiver",
  "plural": false,
  "selections": (v18/*: any*/),
  "storageKey": null
},
v20 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "TrophiesEdge",
    "kind": "LinkedField",
    "name": "edges",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Trophy",
        "kind": "LinkedField",
        "name": "node",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "isAwarded",
            "storageKey": null
          },
          (v19/*: any*/),
          (v7/*: any*/)
        ],
        "storageKey": null
      },
      (v8/*: any*/)
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "concreteType": "PageInfo",
    "kind": "LinkedField",
    "name": "pageInfo",
    "plural": false,
    "selections": [
      (v10/*: any*/),
      (v9/*: any*/)
    ],
    "storageKey": null
  }
],
v21 = {
  "alias": null,
  "args": null,
  "concreteType": "User",
  "kind": "LinkedField",
  "name": "me",
  "plural": false,
  "selections": (v3/*: any*/),
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v23 = [
  (v12/*: any*/),
  (v4/*: any*/)
],
v24 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 200
  }
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
              (v11/*: any*/)
            ],
            "storageKey": "__GroupDetail_games_connection(order:{\"createdDate\":\"DESC\"})"
          },
          {
            "alias": null,
            "args": (v13/*: any*/),
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
                      (v14/*: any*/),
                      (v15/*: any*/),
                      (v16/*: any*/),
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
          (v17/*: any*/),
          {
            "alias": "trophies",
            "args": null,
            "concreteType": "TrophiesConnection",
            "kind": "LinkedField",
            "name": "__GroupTrophies_trophies_connection",
            "plural": false,
            "selections": (v20/*: any*/),
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      (v21/*: any*/)
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
            "selections": [
              (v2/*: any*/),
              (v14/*: any*/),
              (v16/*: any*/)
            ],
            "storageKey": null
          },
          (v5/*: any*/),
          (v22/*: any*/),
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
                "name": "first",
                "value": 20
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
                      (v22/*: any*/),
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
                      (v19/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "User",
                        "kind": "LinkedField",
                        "name": "awardedBy",
                        "plural": false,
                        "selections": (v18/*: any*/),
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
                    "selections": (v18/*: any*/),
                    "storageKey": null
                  }
                ],
                "type": "MemberJoinedActivity",
                "abstractKey": null
              }
            ],
            "storageKey": "recentActivity(first:20)"
          },
          {
            "alias": null,
            "args": (v23/*: any*/),
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
                      (v5/*: any*/),
                      (v6/*: any*/),
                      (v22/*: any*/),
                      {
                        "alias": null,
                        "args": (v24/*: any*/),
                        "concreteType": "TrophiesConnection",
                        "kind": "LinkedField",
                        "name": "trophies",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "TrophiesEdge",
                            "kind": "LinkedField",
                            "name": "edges",
                            "plural": true,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Trophy",
                                "kind": "LinkedField",
                                "name": "node",
                                "plural": false,
                                "selections": [
                                  (v2/*: any*/),
                                  (v7/*: any*/)
                                ],
                                "storageKey": null
                              },
                              (v8/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v11/*: any*/)
                        ],
                        "storageKey": "trophies(first:200)"
                      },
                      {
                        "alias": null,
                        "args": (v24/*: any*/),
                        "filters": null,
                        "handle": "connection",
                        "key": "GameTrophies_trophies",
                        "kind": "LinkedHandle",
                        "name": "trophies"
                      },
                      (v7/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v8/*: any*/)
                ],
                "storageKey": null
              },
              (v11/*: any*/)
            ],
            "storageKey": "games(first:50,order:{\"createdDate\":\"DESC\"})"
          },
          {
            "alias": null,
            "args": (v23/*: any*/),
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
            "args": (v13/*: any*/),
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
                    "selections": (v18/*: any*/),
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "members(first:50)"
          },
          (v17/*: any*/),
          {
            "alias": null,
            "args": (v24/*: any*/),
            "concreteType": "TrophiesConnection",
            "kind": "LinkedField",
            "name": "trophies",
            "plural": false,
            "selections": (v20/*: any*/),
            "storageKey": "trophies(first:200)"
          },
          {
            "alias": null,
            "args": (v24/*: any*/),
            "filters": null,
            "handle": "connection",
            "key": "GroupTrophies_trophies",
            "kind": "LinkedHandle",
            "name": "trophies"
          }
        ],
        "storageKey": null
      },
      (v21/*: any*/)
    ]
  },
  "params": {
    "cacheID": "20d35db6876779f6f0eee9d22be7475e",
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
        },
        {
          "count": null,
          "cursor": null,
          "direction": "forward",
          "path": [
            "groupById",
            "trophies"
          ]
        }
      ]
    },
    "name": "groupsDetailQuery",
    "operationKind": "query",
    "text": "query groupsDetailQuery(\n  $id: ID!\n) {\n  groupById(id: $id) {\n    id\n    admin {\n      id\n    }\n    ...GroupHero_group\n    ...GroupActivityFeed_group\n    games(first: 50, order: {createdDate: DESC}) {\n      edges {\n        node {\n          id\n          name\n          symbol\n          ...GroupGamesTableRow_game\n          __typename\n        }\n        cursor\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n    members(first: 50) {\n      edges {\n        node {\n          id\n          firstName\n          middleName\n          lastName\n          ...MemberRow_user\n        }\n      }\n    }\n    invite {\n      inviteCode\n      expirationDate\n    }\n    trophies(first: 200) {\n      edges {\n        node {\n          id\n          isAwarded\n          receiver {\n            id\n            firstName\n            middleName\n            lastName\n          }\n          __typename\n        }\n        cursor\n      }\n      pageInfo {\n        hasNextPage\n        endCursor\n      }\n    }\n  }\n  me {\n    id\n  }\n}\n\nfragment GroupActivityFeed_group on Group {\n  recentActivity(first: 20) {\n    __typename\n    id\n    occurredAt\n    ... on TrophyAwardedActivity {\n      trophy {\n        id\n        description\n        game {\n          id\n          symbol\n          name\n        }\n        receiver {\n          id\n          firstName\n          middleName\n          lastName\n        }\n        awardedBy {\n          id\n          firstName\n          middleName\n          lastName\n        }\n      }\n    }\n    ... on MemberJoinedActivity {\n      member {\n        id\n        firstName\n        middleName\n        lastName\n      }\n    }\n  }\n}\n\nfragment GroupGamesTableRow_game on Game {\n  id\n  name\n  symbol\n  description\n  trophies(first: 200) {\n    edges {\n      node {\n        id\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment GroupHero_group on Group {\n  id\n  name\n  description\n  createdDate\n  admin {\n    id\n    firstName\n    lastName\n  }\n}\n\nfragment MemberRow_user on User {\n  id\n  firstName\n  middleName\n  lastName\n}\n"
  }
};
})();

(node as any).hash = "f4439f52357b70fa2bfdf14ca5283858";

export default node;
