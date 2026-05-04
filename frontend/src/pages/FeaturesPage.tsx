export default function FeaturesPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Features</h1>

      <div className="glass-card p-6 text-muted-foreground space-y-2">
        <p>✔ Upload meeting videos</p>
        <p>✔ AI transcript generation</p>
        <p>✔ Smart summaries</p>
        <p>✔ PDF download</p>
        <p>✔ History tracking</p>
      </div>
    </div>
  );
}