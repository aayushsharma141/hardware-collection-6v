# Evidence bundle signing

Bundles and the `SHA256SUMS` manifest are signed with Ed25519.

## Verifying

`verification-public-key.pub` is the public half, committed here on purpose.

```bash
# tsx is not a declared dependency; npx fetches it on first use
npx tsx scripts/evidence-engine.ts --verify-sig
```

With no signing key present, the engine reads that file and verifies without
being able to sign.

## Signing

The private key lives in the environment (the engine also reads a local,
git-ignored `docs/evidence/private.key` if one exists):

```
EVIDENCE_PRIVATE_KEY=<Ed25519 private key, PEM or base64 of one>
```

The public half is derived from it, so the two cannot drift apart.
`EVIDENCE_PUBLIC_KEY` is optional and only useful for verify-only setups.

Never commit a private key. `.gitignore` already excludes `*.key` and `*.pem`;
the previous signing key reached the repository by being force-added past that
rule, which left every signature made with it unable to distinguish a genuine
bundle from a forged one.

Outside CI, with no key configured, signing fails with "Cannot sign" because the
committed `verification-public-key.pub` is loaded as a verify-only key. Only if
both `private.key` and `verification-public-key.pub` are absent does the engine
generate an ephemeral keypair and warn that the resulting bundles prove nothing. In CI it refuses to sign
at all rather than emit a bundle nobody can check.

## Rotation

1. `node -e 'const c=require("crypto");const{privateKey}=c.generateKeyPairSync("ed25519",{privateKeyEncoding:{type:"pkcs8",format:"pem"},publicKeyEncoding:{type:"spki",format:"pem"}});console.log(Buffer.from(privateKey).toString("base64"))'`
2. Store the output as `EVIDENCE_PRIVATE_KEY` in the environment.
3. Re-sign, so existing bundles still verify: `npx tsx scripts/evidence-engine.ts --sign` (tsx is fetched by npx; it is not a declared dependency)
4. Commit the regenerated `verification-public-key.pub`, `manifest.json`
   and `signature.json` (`--sign` does not touch `index.json`; that is written by the default / `--index` run). `SHA256SUMS` should not change — the same
   artifact hashes are being re-signed, not re-measured.

Bundles signed before a rotation cannot be distinguished from forgeries once
the old key is considered compromised. Re-sign them, or annotate them as
historical.
