function Features() {

  const data = [
    "⚡ Instant Detection",
    "🛡 High Accuracy",
    "🌍 Multiple Crops Support",
    "🌱 Treatment Suggestions"
  ]

  return (
    <div style={{ marginTop: "50px", textAlign: "center" }}>

      <h2>Why LeafScan?</h2>

      {data.map((item, i) => (
        <p key={i}>{item}</p>
      ))}

    </div>
  )
}

export default Features