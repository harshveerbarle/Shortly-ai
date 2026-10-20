import { useState } from "react";

const features = [
  {
    icon: "🔗",
    title: "URL Shortener",
    description: "Convert long URLs into short, shareable links.",
  },
  {
    icon: "📝",
    title: "Text Summarizer",
    description: "Turn lengthy articles into concise summaries.",
  },
  {
    icon: "▶️",
    title: "YouTube Summarizer",
    description: "Get key points from YouTube videos.",
  },
];

function App() {
  // URL Shortener states
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [urlError, setUrlError] = useState("");
  const [urlCopied, setUrlCopied] = useState(false);

  // Text Summarizer states
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [summaryLength, setSummaryLength] = useState("medium");
  const [summarizing, setSummarizing] = useState(false);
  const [summaryError, setSummaryError] = useState("");
  const [summaryCopied, setSummaryCopied] = useState(false);

  // URL Shortener function
  async function handleShorten() {
    const trimmedUrl = url.trim();

    if (!trimmedUrl) {
      setUrlError("Please enter a URL.");
      return;
    }

    let parsedUrl;

    try {
      parsedUrl = new URL(trimmedUrl);
    } catch {
      setUrlError("Enter a valid URL, including https://");
      return;
    }

    if (!["http:", "https:"].includes(parsedUrl.protocol)) {
      setUrlError("Only HTTP and HTTPS URLs are allowed.");
      return;
    }

    setLoading(true);
    setUrlError("");
    setShortUrl("");
    setUrlCopied(false);

    try {
      const response = await fetch(
        "http://localhost:5000/api/urls/shorten",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            originalUrl: parsedUrl.href,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to shorten URL.");
      }

      setShortUrl(data.shortUrl);
    } catch (error) {
      setUrlError(
        error.message || "Could not connect to the backend."
      );
    } finally {
      setLoading(false);
    }
  }

  // Copy shortened URL
  async function handleCopyUrl() {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setUrlCopied(true);

      setTimeout(() => {
        setUrlCopied(false);
      }, 2000);
    } catch {
      setUrlError("Unable to copy. Please copy the link manually.");
    }
  }

  // AI Text Summarizer function
  async function handleSummarize() {
    if (!text.trim()) {
      setSummaryError("Please enter some text to summarize.");
      return;
    }

    setSummarizing(true);
    setSummaryError("");
    setSummary("");
    setSummaryCopied(false);

    try {
      const response = await fetch(
        "http://localhost:5000/api/summarize",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: text.trim(),
            length: summaryLength,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to summarize text.");
      }

      if (!data.summary) {
        throw new Error("No summary was returned.");
      }

      setSummary(data.summary);
    } catch (error) {
      setSummaryError(
        error.message || "Could not connect to the backend."
      );
    } finally {
      setSummarizing(false);
    }
  }

  // Copy generated summary
  async function handleCopySummary() {
    try {
      await navigator.clipboard.writeText(summary);
      setSummaryCopied(true);

      setTimeout(() => {
        setSummaryCopied(false);
      }, 2000);
    } catch {
      setSummaryError("Unable to copy. Please copy the summary manually.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50 text-slate-900">
      {/* NAVBAR */}
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-md">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a href="#home" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xl text-white">
              ✦
            </div>

            <span className="text-2xl font-bold tracking-tight">
              Shortly<span className="text-indigo-600">AI</span>
            </span>
          </a>

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="transition hover:text-indigo-600">
              Features
            </a>

            <a href="#workspace" className="transition hover:text-indigo-600">
              Workspace
            </a>

            <a href="#about" className="transition hover:text-indigo-600">
              About
            </a>
          </div>

          <a
            href="#workspace"
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            Get Started →
          </a>
        </nav>
      </header>

      <main>
        {/* HERO SECTION */}
        <section
          id="home"
          className="mx-auto max-w-7xl px-6 pb-16 pt-20 text-center md:pb-24 md:pt-28"
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-4 py-2 text-sm font-medium text-indigo-700">
            <span>✨</span>
            Your all-in-one AI productivity tool
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-7xl">
            Shorten Links.
            <br />
            Summarize Content.
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent">
              Save Time.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
            Make long links shorter and transform lengthy articles and videos
            into useful summaries — all in one simple workspace.
          </p>

          <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="#workspace"
              className="rounded-xl bg-indigo-600 px-7 py-3.5 font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700"
            >
              Try ShortlyAI →
            </a>

            <a
              href="#features"
              className="rounded-xl border border-slate-200 bg-white px-7 py-3.5 font-semibold text-slate-700 transition hover:border-indigo-300 hover:text-indigo-600"
            >
              Explore Features
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-500">
            <span>✓ Easy to use</span>
            <span>✓ Fast results</span>
            <span>✓ Multiple tools in one place</span>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section id="features" className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
            <div className="mb-10 text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
                What you can do
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Everything you need, in one place
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-slate-600">
                Three useful tools designed to help you work smarter.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="rounded-2xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/50"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl">
                    {feature.icon}
                  </div>

                  <h3 className="mt-5 text-xl font-bold">
                    {feature.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    {feature.description}
                  </p>

                  <a
                    href="#workspace"
                    className="mt-5 inline-block font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    Try this tool →
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WORKSPACE SECTION */}
        <section
          id="workspace"
          className="mx-auto max-w-7xl px-6 py-16 md:py-24"
        >
          <div className="mb-10 text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-indigo-600">
              Your workspace
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
              Get things done faster
            </h2>

            <p className="mx-auto mt-4 max-w-xl text-slate-600">
              Shorten links and summarize content from one convenient place.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
            {/* URL SHORTENER */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-2xl">
                  🔗
                </div>

                <div>
                  <h3 className="text-xl font-bold">URL Shortener</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Make your long links short.
                  </p>
                </div>
              </div>

              <label
                htmlFor="url-input"
                className="mt-7 block text-sm font-semibold text-slate-700"
              >
                Paste your long URL
              </label>

              <input
                id="url-input"
                type="url"
                value={url}
                onChange={(event) => {
                  setUrl(event.target.value);
                  setUrlError("");
                  setShortUrl("");
                }}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !loading) {
                    handleShorten();
                  }
                }}
                placeholder="https://example.com/your-long-link"
                className="mt-3 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />

              <button
                onClick={handleShorten}
                disabled={loading}
                className="mt-4 w-full rounded-xl bg-indigo-600 py-3.5 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Shortening..." : "Shorten URL →"}
              </button>

              {urlError && (
                <p
                  role="alert"
                  className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
                >
                  {urlError}
                </p>
              )}

              {shortUrl && (
                <div className="mt-5 rounded-xl border border-green-200 bg-green-50 p-4">
                  <p className="font-semibold text-green-800">
                    Your short URL is ready!
                  </p>

                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 block break-all text-sm text-indigo-700 underline"
                  >
                    {shortUrl}
                  </a>

                  <button
                    onClick={handleCopyUrl}
                    className="mt-4 rounded-lg border border-green-300 bg-white px-4 py-2 text-sm font-semibold text-green-800 hover:bg-green-100"
                  >
                    {urlCopied ? "✓ Copied!" : "Copy link"}
                  </button>
                </div>
              )}

              <p className="mt-4 text-xs leading-5 text-slate-400">
                Short links use your local backend and work while it is running.
              </p>
            </div>

            {/* TEXT SUMMARIZER */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 text-2xl">
                  📝
                </div>

                <div>
                  <h3 className="text-xl font-bold">Text Summarizer</h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Turn lengthy text into concise notes.
                  </p>
                </div>
              </div>

              <label
                htmlFor="summary-input"
                className="mt-7 block text-sm font-semibold text-slate-700"
              >
                Paste your text or article
              </label>

              <textarea
                id="summary-input"
                rows={5}
                value={text}
                maxLength={20000}
                onChange={(event) => {
                  setText(event.target.value);
                  setSummaryError("");
                  setSummary("");
                }}
                placeholder="Paste your article or text here..."
                className="mt-3 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />

              <p className="mt-2 text-right text-xs text-slate-400">
                {text.length}/20,000 characters
              </p>

              <label
                htmlFor="summary-length"
                className="mt-4 block text-sm font-semibold text-slate-700"
              >
                Summary length
              </label>

              <select
                id="summary-length"
                value={summaryLength}
                onChange={(event) => setSummaryLength(event.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500"
              >
                <option value="short">Short — 2–3 sentences</option>
                <option value="medium">Medium — 1–2 paragraphs</option>
                <option value="detailed">Detailed — main points explained</option>
              </select>

              <button
                onClick={handleSummarize}
                disabled={summarizing}
                className="mt-4 w-full rounded-xl bg-violet-600 py-3.5 font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {summarizing ? "Summarizing..." : "Summarize with AI →"}
              </button>

              {summaryError && (
                <p
                  role="alert"
                  className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-700"
                >
                  {summaryError}
                </p>
              )}

              {summary && (
                <div className="mt-5 rounded-xl border border-violet-200 bg-violet-50 p-4">
                  <h4 className="font-bold text-violet-900">AI Summary</h4>

                  <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                    {summary}
                  </p>

                  <button
                    onClick={handleCopySummary}
                    className="mt-4 rounded-lg border border-violet-200 bg-white px-4 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-100"
                  >
                    {summaryCopied ? "✓ Copied!" : "Copy Summary"}
                  </button>
                </div>
              )}

              <p className="mt-4 text-xs leading-5 text-slate-400">
                Powered by your Groq API integration.
              </p>
            </div>

            {/* YOUTUBE SUMMARIZER */}
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8 lg:col-span-2">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-2xl">
                    ▶️
                  </div>

                  <div>
                    <h3 className="text-xl font-bold">
                      YouTube Video Summarizer
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Get important points from videos without watching the
                      entire video.
                    </p>
                  </div>
                </div>

                <span className="w-fit rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-500">
                  Coming Soon
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="border-t border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-14 text-center">
            <h2 className="text-2xl font-bold">
              Less busywork. More productivity.
            </h2>

            <p className="mx-auto mt-3 max-w-2xl leading-7 text-slate-600">
              ShortlyAI brings link management and AI-powered summarization
              together so you can focus on what matters.
            </p>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-sm text-slate-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} ShortlyAI. All rights reserved.
          </p>

          <p>Built to help you save time ✨</p>
        </div>
      </footer>
    </div>
  );
}

export default App;