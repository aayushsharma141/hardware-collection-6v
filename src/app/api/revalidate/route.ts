import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

/**
 * Must match the secret set on the webhook in sanity.io/manage.
 *
 * `parseBody` returns `isValidSignature: null` when no secret is passed, which
 * the signature check below would reject as if the caller were untrusted. A
 * missing secret is a deployment misconfiguration rather than a bad request,
 * so it is answered separately — otherwise an unconfigured deployment looks
 * exactly like an attacker, and the webhook silently never fires.
 */
const secret = process.env.SANITY_REVALIDATE_SECRET;

export async function POST(req: NextRequest) {
  if (!secret) {
    console.error(
      'SANITY_REVALIDATE_SECRET is not set — rejecting revalidation webhook. ' +
        'Set it in the environment and on the webhook in sanity.io/manage.'
    );
    return NextResponse.json(
      { message: 'Revalidation is not configured on this deployment.' },
      { status: 500 }
    );
  }

  try {
    const { isValidSignature, body } = await parseBody<{ _type: string }>(
      req,
      secret
    );

    if (!isValidSignature) {
      // Deliberately terse: do not echo the unverified body back to the caller.
      return NextResponse.json({ message: 'Invalid signature' }, { status: 401 });
    }

    if (!body?._type) {
      return NextResponse.json(
        { message: 'Bad Request: payload has no _type' },
        { status: 400 }
      );
    }

    // Every route reads from Sanity through the shared layout, and the site is
    // small enough that a whole-layout revalidation is cheaper to reason about
    // than per-type tags. Revisit if the page count grows.
    revalidatePath('/', 'layout');

    return NextResponse.json({
      revalidated: true,
      type: body._type,
      now: Date.now(),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.error('Revalidation failed:', message);
    return NextResponse.json({ message }, { status: 500 });
  }
}
