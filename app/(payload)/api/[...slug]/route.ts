/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */
import type { NextRequest } from "next/server"

import config from "@payload-config"
import { REST_DELETE, REST_GET, REST_PATCH, REST_POST } from "@payloadcms/next/rest"

export const GET = (req: NextRequest, { params }: { params: { slug: string[] } }) => REST_GET(req, { params, config })

export const POST = (req: NextRequest, { params }: { params: { slug: string[] } }) => REST_POST(req, { params, config })

export const DELETE = (req: NextRequest, { params }: { params: { slug: string[] } }) =>
  REST_DELETE(req, { params, config })

export const PATCH = (req: NextRequest, { params }: { params: { slug: string[] } }) =>
  REST_PATCH(req, { params, config })
