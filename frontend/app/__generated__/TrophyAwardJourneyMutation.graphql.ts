/**
 * @generated SignedSource<<fab9b2812399c9d85d3a06974ebc1098>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest } from 'relay-runtime';
import { FragmentRefs } from "relay-runtime";
export type CreateTrophyRequestInput = {
  description?: string | null | undefined;
  gameId: string;
  userId: string;
};
export type TrophyAwardJourneyMutation$variables = {
  connections: ReadonlyArray<string>;
  groupId: string;
  input: CreateTrophyRequestInput;
};
export type TrophyAwardJourneyMutation$data = {
  readonly createTrophyRequest: {
    readonly errors: ReadonlyArray<{
      readonly __typename: string;
      readonly message?: string;
    }> | null | undefined;
    readonly query: {
      readonly groupById: {
        readonly awardedTrophyCount: number;
        readonly topPerformer: {
          readonly awardCount: number;
          readonly user: {
            readonly displayName: string;
            readonly id: string;
            readonly profile: {
              readonly firstName: string;
              readonly lastName: string;
              readonly middleName: string | null | undefined;
            };
          };
        } | null | undefined;
        readonly " $fragmentSpreads": FragmentRefs<"GroupActivityFeed_group">;
      } | null | undefined;
    };
    readonly trophy: {
      readonly description: string | null | undefined;
      readonly game: {
        readonly id: string;
        readonly name: string;
        readonly symbol: string;
      };
      readonly id: string;
      readonly isAwarded: boolean;
      readonly receiver: {
        readonly displayName: string;
        readonly id: string;
        readonly profile: {
          readonly firstName: string;
          readonly lastName: string;
          readonly middleName: string | null | undefined;
        };
      };
    } | null | undefined;
  };
};
export type TrophyAwardJourneyMutation = {
  response: TrophyAwardJourneyMutation$data;
  variables: TrophyAwardJourneyMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "connections"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "groupId"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "input"
},
v3 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "description",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "concreteType": "Game",
  "kind": "LinkedField",
  "name": "game",
  "plural": false,
  "selections": [
    (v4/*: any*/),
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
      "name": "name",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "displayName",
  "storageKey": null
},
v8 = {
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
v9 = [
  (v4/*: any*/),
  (v7/*: any*/),
  (v8/*: any*/)
],
v10 = {
  "alias": null,
  "args": null,
  "concreteType": "User",
  "kind": "LinkedField",
  "name": "receiver",
  "plural": false,
  "selections": (v9/*: any*/),
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "concreteType": "Trophy",
  "kind": "LinkedField",
  "name": "trophy",
  "plural": false,
  "selections": [
    (v4/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isAwarded",
      "storageKey": null
    },
    (v5/*: any*/),
    (v6/*: any*/),
    (v10/*: any*/)
  ],
  "storageKey": null
},
v12 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "groupId"
  }
],
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
      "selections": (v9/*: any*/),
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
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "concreteType": null,
  "kind": "LinkedField",
  "name": "errors",
  "plural": true,
  "selections": [
    (v15/*: any*/),
    {
      "kind": "InlineFragment",
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "message",
          "storageKey": null
        }
      ],
      "type": "Error",
      "abstractKey": "__isError"
    }
  ],
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "TrophyAwardJourneyMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "CreateTrophyRequestPayload",
        "kind": "LinkedField",
        "name": "createTrophyRequest",
        "plural": false,
        "selections": [
          (v11/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Query",
            "kind": "LinkedField",
            "name": "query",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": (v12/*: any*/),
                "concreteType": "Group",
                "kind": "LinkedField",
                "name": "groupById",
                "plural": false,
                "selections": [
                  {
                    "args": null,
                    "kind": "FragmentSpread",
                    "name": "GroupActivityFeed_group"
                  },
                  (v13/*: any*/),
                  (v14/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v16/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v2/*: any*/),
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Operation",
    "name": "TrophyAwardJourneyMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "CreateTrophyRequestPayload",
        "kind": "LinkedField",
        "name": "createTrophyRequest",
        "plural": false,
        "selections": [
          (v11/*: any*/),
          {
            "alias": null,
            "args": null,
            "filters": null,
            "handle": "appendNode",
            "key": "",
            "kind": "LinkedHandle",
            "name": "trophy",
            "handleArgs": [
              {
                "kind": "Variable",
                "name": "connections",
                "variableName": "connections"
              },
              {
                "kind": "Literal",
                "name": "edgeTypeName",
                "value": "TrophiesEdge"
              }
            ]
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Query",
            "kind": "LinkedField",
            "name": "query",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": (v12/*: any*/),
                "concreteType": "Group",
                "kind": "LinkedField",
                "name": "groupById",
                "plural": false,
                "selections": [
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
                      (v15/*: any*/),
                      (v4/*: any*/),
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
                              (v4/*: any*/),
                              (v5/*: any*/),
                              (v6/*: any*/),
                              (v10/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "User",
                                "kind": "LinkedField",
                                "name": "awardedBy",
                                "plural": false,
                                "selections": (v9/*: any*/),
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
                            "selections": [
                              (v4/*: any*/),
                              (v7/*: any*/),
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
                              (v8/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "type": "MemberJoinedActivity",
                        "abstractKey": null
                      }
                    ],
                    "storageKey": "recentActivity(first:5)"
                  },
                  (v13/*: any*/),
                  (v14/*: any*/),
                  (v4/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v16/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "9df34bf15d15a90378b9987447aa39a4",
    "id": null,
    "metadata": {},
    "name": "TrophyAwardJourneyMutation",
    "operationKind": "mutation",
    "text": "mutation TrophyAwardJourneyMutation(\n  $input: CreateTrophyRequestInput!\n  $groupId: ID!\n) {\n  createTrophyRequest(input: $input) {\n    trophy {\n      id\n      isAwarded\n      description\n      game {\n        id\n        symbol\n        name\n      }\n      receiver {\n        id\n        displayName\n        profile {\n          firstName\n          middleName\n          lastName\n        }\n      }\n    }\n    query {\n      groupById(id: $groupId) {\n        ...GroupActivityFeed_group\n        awardedTrophyCount\n        topPerformer {\n          user {\n            id\n            displayName\n            profile {\n              firstName\n              middleName\n              lastName\n            }\n          }\n          awardCount\n        }\n        id\n      }\n    }\n    errors {\n      __typename\n      ... on Error {\n        __isError: __typename\n        message\n      }\n    }\n  }\n}\n\nfragment GroupActivityFeed_group on Group {\n  recentActivityCount\n  recentActivity(first: 5) {\n    __typename\n    id\n    occurredAt\n    ... on TrophyAwardedActivity {\n      trophy {\n        id\n        description\n        game {\n          id\n          symbol\n          name\n        }\n        receiver {\n          id\n          displayName\n          profile {\n            firstName\n            middleName\n            lastName\n          }\n        }\n        awardedBy {\n          id\n          displayName\n          profile {\n            firstName\n            middleName\n            lastName\n          }\n        }\n      }\n    }\n    ... on MemberJoinedActivity {\n      member {\n        id\n        displayName\n        avatarUrl(size: 64)\n        profile {\n          firstName\n          middleName\n          lastName\n        }\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "63a093d1dd6f61489d1538cab9a2e3a7";

export default node;
