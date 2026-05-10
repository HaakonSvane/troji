/**
 * @generated SignedSource<<3f48382cd9db5bd436820de1e2c1a981>>
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
export type TrophyRequestFormMutation$variables = {
  connections: ReadonlyArray<string>;
  groupId: string;
  input: CreateTrophyRequestInput;
};
export type TrophyRequestFormMutation$data = {
  readonly createTrophyRequest: {
    readonly errors: ReadonlyArray<{
      readonly __typename: string;
    }> | null | undefined;
    readonly query: {
      readonly groupById: {
        readonly awardedTrophyCount: number;
        readonly topPerformer: {
          readonly awardCount: number;
          readonly user: {
            readonly firstName: string;
            readonly id: string;
            readonly lastName: string;
            readonly middleName: string | null | undefined;
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
        readonly firstName: string;
        readonly id: string;
        readonly lastName: string;
      };
    } | null | undefined;
  };
};
export type TrophyRequestFormMutation = {
  response: TrophyRequestFormMutation$data;
  variables: TrophyRequestFormMutation$variables;
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
  "name": "firstName",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "lastName",
  "storageKey": null
},
v9 = {
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
    {
      "alias": null,
      "args": null,
      "concreteType": "User",
      "kind": "LinkedField",
      "name": "receiver",
      "plural": false,
      "selections": [
        (v4/*: any*/),
        (v7/*: any*/),
        (v8/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "storageKey": null
},
v10 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "groupId"
  }
],
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "awardedTrophyCount",
  "storageKey": null
},
v12 = [
  (v4/*: any*/),
  (v7/*: any*/),
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "middleName",
    "storageKey": null
  },
  (v8/*: any*/)
],
v13 = {
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
      "selections": (v12/*: any*/),
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
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "concreteType": null,
  "kind": "LinkedField",
  "name": "errors",
  "plural": true,
  "selections": [
    (v14/*: any*/)
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
    "name": "TrophyRequestFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "CreateTrophyRequestPayload",
        "kind": "LinkedField",
        "name": "createTrophyRequest",
        "plural": false,
        "selections": [
          (v9/*: any*/),
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
                "args": (v10/*: any*/),
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
                  (v11/*: any*/),
                  (v13/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v15/*: any*/)
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
    "name": "TrophyRequestFormMutation",
    "selections": [
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "CreateTrophyRequestPayload",
        "kind": "LinkedField",
        "name": "createTrophyRequest",
        "plural": false,
        "selections": [
          (v9/*: any*/),
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
                "args": (v10/*: any*/),
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
                        "value": 10
                      }
                    ],
                    "concreteType": null,
                    "kind": "LinkedField",
                    "name": "recentActivity",
                    "plural": true,
                    "selections": [
                      (v14/*: any*/),
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
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "User",
                                "kind": "LinkedField",
                                "name": "receiver",
                                "plural": false,
                                "selections": (v12/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "User",
                                "kind": "LinkedField",
                                "name": "awardedBy",
                                "plural": false,
                                "selections": (v12/*: any*/),
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
                            "selections": (v12/*: any*/),
                            "storageKey": null
                          }
                        ],
                        "type": "MemberJoinedActivity",
                        "abstractKey": null
                      }
                    ],
                    "storageKey": "recentActivity(first:10)"
                  },
                  (v11/*: any*/),
                  (v13/*: any*/),
                  (v4/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v15/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "cacheID": "395eab46b3209bc6e7624bd59e68d90c",
    "id": null,
    "metadata": {},
    "name": "TrophyRequestFormMutation",
    "operationKind": "mutation",
    "text": "mutation TrophyRequestFormMutation(\n  $input: CreateTrophyRequestInput!\n  $groupId: ID!\n) {\n  createTrophyRequest(input: $input) {\n    trophy {\n      id\n      isAwarded\n      description\n      game {\n        id\n        symbol\n        name\n      }\n      receiver {\n        id\n        firstName\n        lastName\n      }\n    }\n    query {\n      groupById(id: $groupId) {\n        ...GroupActivityFeed_group\n        awardedTrophyCount\n        topPerformer {\n          user {\n            id\n            firstName\n            middleName\n            lastName\n          }\n          awardCount\n        }\n        id\n      }\n    }\n    errors {\n      __typename\n    }\n  }\n}\n\nfragment GroupActivityFeed_group on Group {\n  recentActivityCount\n  recentActivity(first: 10) {\n    __typename\n    id\n    occurredAt\n    ... on TrophyAwardedActivity {\n      trophy {\n        id\n        description\n        game {\n          id\n          symbol\n          name\n        }\n        receiver {\n          id\n          firstName\n          middleName\n          lastName\n        }\n        awardedBy {\n          id\n          firstName\n          middleName\n          lastName\n        }\n      }\n    }\n    ... on MemberJoinedActivity {\n      member {\n        id\n        firstName\n        middleName\n        lastName\n      }\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "900971cdd8ab8bf0abb33a57e7c09da2";

export default node;
