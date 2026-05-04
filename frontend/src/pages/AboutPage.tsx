export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-10">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">About Us</h1>
        <p className="text-muted-foreground mt-2">
          Meet the team behind MeetSum AI
        </p>
      </div>

      {/* Project Info */}
      <div className="glass-card p-6 space-y-4 text-muted-foreground">
        <h2 className="text-xl font-semibold text-foreground">Our Product</h2>

        <p>
          MeetSum AI is an AI-powered platform that converts meeting videos into
          structured summaries, transcripts, and actionable insights.
        </p>

        <p>
          Our mission is to save time and boost productivity by automating meeting documentation.
        </p>
      </div>

      {/* TEAM SECTION */}
      <div className="space-y-6">

        {/* MEMBER 1 */}
        <div className="glass-card p-5 flex flex-col sm:flex-row gap-4 items-start">
          
          <img
            src="/team/naman.jpg"
            alt="Naman"
            className="w-20 h-20 rounded-xl object-cover border border-border shadow-md"
          />

          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Naman Choudhary
            </h3>

            <p className="text-sm text-muted-foreground">
              AI Model Developer & Team Leader
            </p>

            <p className="text-sm text-muted-foreground mt-1">
              Led the AI development and optimized the model for accurate transcription and summarization.
            </p>
          </div>
        </div>
        
        {/* MEMBER 2 */}
        <div className="glass-card p-5 flex flex-col sm:flex-row gap-4 items-start">
          
          <img
            src="/team/vansh.jpg"
            alt="Vansh"
            className="w-20 h-20 rounded-xl object-cover border border-border shadow-md"
          />

          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Vansh Sharma
            </h3>

            <p className="text-sm text-muted-foreground">
              Full Stack Developer (Frontend, Backend & AI Integration)
            </p>

            <p className="text-sm text-muted-foreground mt-1">
              Built the complete system including UI, backend APIs, and AI integration for meeting processing.
            </p>
          </div>
        </div>

        {/* MEMBER 3 */}
        <div className="glass-card p-5 flex flex-col sm:flex-row gap-4 items-start">
          
          <img
            src="/team/sneha.jpg"
            alt="Sneha"
            className="w-20 h-20 rounded-xl object-cover border border-border shadow-md"
          />

          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Sneha
            </h3>

            <p className="text-sm text-muted-foreground">
              Security & Management Coordination
            </p>

            <p className="text-sm text-muted-foreground mt-1">
              Handled system security, workflow coordination, and ensured smooth project execution.
            </p>
          </div>
        </div>

        {/* MEMBER 4 */}
        <div className="glass-card p-5 flex flex-col sm:flex-row gap-4 items-start">
          
          <img
            src="/team/ritu.jpg"
            alt="Ritu"
            className="w-20 h-20 rounded-xl object-cover border border-border shadow-md"
          />

          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Ritu Kushwaha
            </h3>

            <p className="text-sm text-muted-foreground">
              Report & Notification System
            </p>

            <p className="text-sm text-muted-foreground mt-1">
              Worked on report generation and user notification features to improve usability.
            </p>
          </div>
        </div>

      </div>

      {/* Vision */}
      <div className="glass-card p-6 space-y-4 text-muted-foreground">
        <h2 className="text-xl font-semibold text-foreground">Our Vision</h2>

        <p>
          We aim to make meetings smarter, faster, and more efficient using AI,
          helping individuals and teams focus on what truly matters.
        </p>
      </div>

    </div>
  );
}