/**
 * AtmosphericBackground
 * Fixed ground behind <main> (see `.hc-atmosphere` in globals.css): ivory with
 * three slow light pools and a paper grain. Pure CSS, so it costs no JS and
 * stays smooth while the main thread is busy.
 */
export function AtmosphericBackground() {
  return (
    <div aria-hidden="true" className="hc-atmosphere">
      <span className="hc-atm-pool hc-atm-pool--brass" />
      <span className="hc-atm-pool hc-atm-pool--wine" />
      <span className="hc-atm-pool hc-atm-pool--warm" />
      <span className="hc-atm-grain" />
    </div>
  );
}
