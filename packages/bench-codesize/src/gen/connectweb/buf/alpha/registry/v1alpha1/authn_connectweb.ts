/* eslint-disable */
// @generated by protoc-gen-connect-web v0.0.4 with parameter "ts_nocheck=false,target=ts"
// @generated from file buf/alpha/registry/v1alpha1/authn.proto (package buf.alpha.registry.v1alpha1, syntax proto3)
//
// Copyright 2020-2022 Buf Technologies, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {GetCurrentUserRequest, GetCurrentUserResponse, GetCurrentUserSubjectRequest, GetCurrentUserSubjectResponse} from "./authn_pb.js";
import {MethodKind} from "@bufbuild/protobuf";

/**
 * AuthnService supplies authenication helpers.
 *
 * @generated from service buf.alpha.registry.v1alpha1.AuthnService
 */
export const AuthnService = {
  typeName: "buf.alpha.registry.v1alpha1.AuthnService",
  methods: {
    /**
     * GetCurrentUser gets information associated with the current user.
     *
     * The user's ID is retrieved from the request's authentication header.
     *
     * @generated from rpc buf.alpha.registry.v1alpha1.AuthnService.GetCurrentUser
     */
    getCurrentUser: {
      name: "GetCurrentUser",
      I: GetCurrentUserRequest,
      O: GetCurrentUserResponse,
      kind: MethodKind.Unary,
    },
    /**
     * GetCurrentUserSubject gets the currently logged in users subject.
     *
     * The user's ID is retrieved from the request's authentication header.
     *
     * @generated from rpc buf.alpha.registry.v1alpha1.AuthnService.GetCurrentUserSubject
     */
    getCurrentUserSubject: {
      name: "GetCurrentUserSubject",
      I: GetCurrentUserSubjectRequest,
      O: GetCurrentUserSubjectResponse,
      kind: MethodKind.Unary,
    },
  }
} as const;

