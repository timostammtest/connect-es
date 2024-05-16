#!/usr/bin/env -S npx tsx

// Copyright 2021-2024 The Connect Authors
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

import { readFileSync } from "node:fs";
import { compressionBrotli, compressionGzip } from "@connectrpc/connect-node";
import * as http from "node:http";
import * as http2 from "node:http2";
import * as https from "node:https";
import { createRegistry } from "@bufbuild/protobuf";
import {
  routes,
  BidiStreamRequest,
  ClientStreamRequest,
  HTTPVersion,
  IdempotentUnaryRequest,
  ServerCompatRequest,
  ServerCompatResponse,
  ServerStreamRequest,
  UnaryRequest,
} from "@connectrpc/connect-conformance";
import {
  fastify,
  FastifyHttpOptions,
  FastifyHttpsOptions,
  FastifyHttp2Options,
  FastifyHttp2SecureOptions,
  FastifyInstance,
} from "fastify";
import { fastifyConnectPlugin } from "@connectrpc/connect-fastify";

main();

/**
 * This program implements a server under test for the connect conformance test
 * runner. It reads ServerCompatRequest messages from stdin, starts the server
 * with the requested configuration, and writes a ServerCompatResponse with the
 * server's port and other details to stdout.
 */
function main() {
  const req = ServerCompatRequest.fromBinary(
    readFileSync(process.stdin.fd).subarray(4),
  );

  const pluginOpts = {
    routes,
    readMaxBytes: req.messageReceiveLimit,
    acceptCompression: [compressionGzip, compressionBrotli],
    jsonOptions: {
      typeRegistry: createRegistry(
        UnaryRequest,
        ServerStreamRequest,
        ClientStreamRequest,
        BidiStreamRequest,
        IdempotentUnaryRequest,
      ),
    },
  };
  let server:
    | FastifyInstance<http.Server>
    | FastifyInstance<https.Server>
    | FastifyInstance<http2.Http2Server>
    | FastifyInstance<http2.Http2SecureServer>;

  let httpsConfig: {
    cert?: string;
    key?: string;
    ca?: Buffer;
    requestCert?: true;
    rejectUnauthorized?: true;
    http2?: boolean;
  } = {};
  if (req.useTls && req.serverCreds !== undefined) {
    httpsConfig = {
      key: req.serverCreds.key.toString(),
      cert: req.serverCreds.cert.toString(),
    };
    if (req.clientTlsCert.length > 0) {
      httpsConfig = {
        ...httpsConfig,
        requestCert: true,
        rejectUnauthorized: true,
        ca: Buffer.from(req.clientTlsCert),
      };
    }
  }

  switch (req.httpVersion) {
    case HTTPVersion.HTTP_VERSION_1:
      if (req.useTls && req.serverCreds !== undefined) {
        // HTTPS/1.1 server
        const opts: FastifyHttpsOptions<https.Server> = {
          https: {
            ...httpsConfig,
          },
        };
        server = fastify(opts).register(fastifyConnectPlugin, pluginOpts);
      } else {
        // HTTP/1.1 server
        const opts: FastifyHttpOptions<http.Server> = {};
        server = fastify(opts).register(fastifyConnectPlugin, pluginOpts);
      }
      break;
    case HTTPVersion.HTTP_VERSION_2:
      if (req.useTls && req.serverCreds !== undefined) {
        // HTTP/2 server
        const opts: FastifyHttp2SecureOptions<http2.Http2SecureServer> = {
          http2: true,
          https: httpsConfig,
        };
        server = fastify(opts).register(fastifyConnectPlugin, pluginOpts);
      } else {
        // HTTP/2 over Cleartext server
        const opts: FastifyHttp2Options<http2.Http2Server> = {
          http2: true,
        };
        server = fastify(opts).register(fastifyConnectPlugin, pluginOpts);
      }
      break;
    case HTTPVersion.HTTP_VERSION_3:
      throw new Error("HTTP/3 is not supported");
    default:
      throw new Error("Unknown HTTP version");
  }

  process.on("SIGTERM", () => {
    void server.close();
  });
  server.listen({ host: "127.0.0.1", port: 0 }, () => {
    const addrInfo = server.addresses()[0];
    const res = new ServerCompatResponse({
      pemCert:
        req.serverCreds !== undefined
          ? Buffer.from(req.serverCreds.cert)
          : undefined,
      host: addrInfo.address,
      port: addrInfo.port,
    });
    const data = res.toBinary();
    const size = Buffer.alloc(4);
    size.writeUInt32BE(data.byteLength);
    process.stdout.write(size);
    process.stdout.write(data);
  });
}
