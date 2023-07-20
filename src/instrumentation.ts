import { registerOTel } from '@vercel/otel'

export function register() {
  registerOTel('next-app')
}

// insert instrumentation script in src on same level as app (not in app)
// npm i @vercel/otel @opentelemetry/sdk-node @opentelemetry/resources @opentelemetry/semantic-conventions @opentelemetry/sdk-trace-base @opentelemetry/exporter-trace-otlp-http
// set up backend collector containers https://github.com/vercel/opentelemetry-collector-dev-setup
// script | "dev": "NEXT_OTEL_VERBOSE=1 next dev" , "start": "NEXT_OTEL_VERBOSE=1 next"