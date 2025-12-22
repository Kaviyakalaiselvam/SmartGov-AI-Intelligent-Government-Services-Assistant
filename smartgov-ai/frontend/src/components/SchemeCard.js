function SchemeCard({ scheme }) {
  return (
    <div style={{ border: "1px solid #ccc", padding: 15, marginBottom: 10 }}>
      <h3>{scheme.name}</h3>
      <p>{scheme.category}</p>
      <a href={scheme.apply_link} target="_blank">Apply</a>
    </div>
  );
}

export default SchemeCard;
