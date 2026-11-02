import Food from './Food.jsx'

function Track({ children }) {
  // content twice so the -50% loop is seamless
  return (
    <div className="ribbon__track">
      <div className="ribbon__set">{children}</div>
      <div className="ribbon__set" aria-hidden="true">{children}</div>
    </div>
  )
}

export default function Ribbons() {
  return (
    <section className="ribbons" aria-hidden="true">
      <div className="ribbon ribbon--big">
        <Track>
          <span>LET'S GO!</span><em><Food kind="juice" /></em>
          <span>FRESH JUICE</span><em><Food kind="burger" /></em>
          <span>BURGERS</span><em><Food kind="fries" /></em>
          <span>CHATPATAS</span><em><Food kind="chai" /></em>
        </Track>
      </div>
      <div className="ribbon ribbon--small">
        <Track>
          <span>BAS EK AUR</span><b>✱</b>
          <span>A LITTLE BIT OF EVERYTHING</span><b>✱</b>
          <span>FRESHLY PREPARED FOR YOU</span><b>✱</b>
        </Track>
      </div>
    </section>
  )
}
