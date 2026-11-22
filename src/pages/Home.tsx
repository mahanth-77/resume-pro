export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <nav className="border-b border-border/60 bg-surface/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-accent flex items-center justify-center">
              <span className="text-white font-serif font-semibold text-lg">R</span>
            </div>
            <span className="font-serif text-xl font-semibold tracking-tight">Resume Pro</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-stone">
            <a href="#features" className="hover:text-ink transition-colors">Features</a>
            <a href="#templates" className="hover:text-ink transition-colors">Templates</a>
            <a href="#ats" className="hover:text-ink transition-colors">ATS Score</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="/login" className="text-sm text-stone hover:text-ink px-3 py-1.5">Log in</a>
            <a href="/builder" className="bg-accent hover:bg-accent-hover text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
              Get Started
            </a>
          </div>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 pt-20 pb-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-accent text-sm font-medium tracking-wider uppercase mb-4">
              ATS-Friendly Resumes. Hired Faster.
            </p>
            <h1 className="text-5xl md:text-6xl font-serif font-semibold leading-[1.1] tracking-tight text-ink mb-6">
              ATS-friendly resumes that get you noticed.
            </h1>
            <p className="text-lg text-stone leading-relaxed mb-10 max-w-md">
              Resume Pro helps you build and improve professional resumes that pass Applicant Tracking Systems and impress hiring managers — every time.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a href="/builder" className="bg-accent hover:bg-accent-hover text-white px-6 py-3.5 rounded-lg font-medium transition-colors text-center">
                Build My Resume →
              </a>
              <a href="/builder" className="border border-accent text-accent hover:bg-accent/5 px-6 py-3.5 rounded-lg font-medium transition-colors text-center">
                Check ATS Score
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="bg-surface rounded-2xl shadow-sm border border-border p-1.5">
              <div className="bg-background rounded-xl p-6 min-h-[420px]">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-2 text-sm font-medium">
                    <div className="w-6 h-6 rounded bg-accent/10 flex items-center justify-center">
                      <span className="text-accent text-xs">R</span>
                    </div>
                    Resume Pro
                  </div>
                  <span className="text-xs bg-accent text-white px-3 py-1 rounded">Live Preview</span>
                </div>
                <div className="space-y-4 text-sm">
                  <div>
                    <div className="font-serif text-xl font-semibold">Alex Martin</div>
                    <div className="text-accent text-xs tracking-wider">SENIOR MARKETING MANAGER</div>
                  </div>
                  <div className="border-t border-border pt-4">
                    <div className="text-xs font-medium text-accent mb-2">PROFESSIONAL SUMMARY</div>
                    <p className="text-stone text-xs leading-relaxed">
                      Results-driven marketing manager with 6+ years of experience developing data-informed strategies that drive growth and brand impact.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-serif font-semibold mb-4">Everything you need to get shortlisted</h2>
          <p className="text-stone max-w-xl mx-auto">Build from scratch or improve what you already have. Precise, factual, and ATS-optimized.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: "Intelligent Builder", desc: "Create professional resumes section by section with live preview and clean templates." },
            { title: "ATS Analysis", desc: "Upload any resume and get a transparent score with specific, actionable improvements." },
            { title: "Automatic Improvement", desc: "Rewrite weak sections while preserving every fact. Target 90+ when genuinely achievable." },
          ].map((f) => (
            <div key={f.title} className="bg-surface rounded-xl border border-border p-6">
              <h3 className="font-serif text-xl font-semibold mb-3">{f.title}</h3>
              <p className="text-stone text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-ink text-white py-20">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-serif font-semibold mb-4">Ready to build a resume that works?</h2>
          <p className="text-stone/80 mb-8">Start free. No credit card required.</p>
          <a href="/builder" className="inline-block bg-accent hover:bg-accent-hover text-white px-8 py-3.5 rounded-lg font-medium">
            Create My Resume
          </a>
        </div>
      </section>

      <footer className="border-t border-border py-12">
        <div className="max-w-6xl mx-auto px-6 text-sm text-stone text-center">
          © {new Date().getFullYear()} Resume Pro. All rights reserved.
        </div>
      </footer>
    </div>
  )
}