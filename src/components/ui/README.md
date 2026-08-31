# `ui/`

Generic, domain-agnostic primitives — used by three or more domains and
carrying no business meaning.

A component belongs here only if you can describe it without naming a feature.
`Button` and `Modal` qualify; `ProductCard` does not — that is
`collections/`.

Currently empty. Promote a component here when its third consumer appears, not
in anticipation of one.
