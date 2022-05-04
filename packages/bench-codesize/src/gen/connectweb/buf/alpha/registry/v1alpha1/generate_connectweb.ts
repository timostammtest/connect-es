/* eslint-disable */
// @generated by protoc-gen-connect-web v0.0.4 with parameter "ts_nocheck=false,target=ts"
// @generated from file buf/alpha/registry/v1alpha1/generate.proto (package buf.alpha.registry.v1alpha1, syntax proto3)
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

import {GeneratePluginsRequest, GeneratePluginsResponse, GenerateTemplateRequest, GenerateTemplateResponse} from "./generate_pb.js";
import {MethodKind} from "@bufbuild/protobuf";

/**
 * GenerateService manages remote generation requests.
 *
 * @generated from service buf.alpha.registry.v1alpha1.GenerateService
 */
export const GenerateService = {
  typeName: "buf.alpha.registry.v1alpha1.GenerateService",
  methods: {
    /**
     * GeneratePlugins generates an array of files given the provided
     * module reference and plugin version and option tuples. No attempt
     * is made at merging insertion points.
     *
     * @generated from rpc buf.alpha.registry.v1alpha1.GenerateService.GeneratePlugins
     */
    generatePlugins: {
      name: "GeneratePlugins",
      I: GeneratePluginsRequest,
      O: GeneratePluginsResponse,
      kind: MethodKind.Unary,
    },
    /**
     * GenerateTemplate generates an array of files given the provided
     * module reference and template version.
     *
     * @generated from rpc buf.alpha.registry.v1alpha1.GenerateService.GenerateTemplate
     */
    generateTemplate: {
      name: "GenerateTemplate",
      I: GenerateTemplateRequest,
      O: GenerateTemplateResponse,
      kind: MethodKind.Unary,
    },
  }
} as const;

