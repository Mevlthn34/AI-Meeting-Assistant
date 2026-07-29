import { useState } from "react";
import "./App.css";
import { analyzeMeetingAudio } from "./services/api";

function App() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const analyzeMeeting = async () => {
    if (!file) {
      setError("Lütfen önce bir ses dosyası seç.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      setResult(null);

      const data = await analyzeMeetingAudio(file);
      setResult(data);
    } catch (requestError) {
      console.error(requestError);

      setError(
        "Analiz sırasında hata oluştu. Backend ve Ollama'nın açık olduğundan emin ol."
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = () => {
    if (!result) {
      setError("Önce bir toplantı analizi yap.");
      return;
    }

    const actionItems = result.action_items?.length
      ? result.action_items
          .map((item, index) => `${index + 1}. ${item}`)
          .join("\n")
      : "Yok";

    const keyDecisions = result.key_decisions?.length
      ? result.key_decisions
          .map((item, index) => `${index + 1}. ${item}`)
          .join("\n")
      : "Bu toplantıda açık bir karar tespit edilmedi.";

    const report = `
AI MEETING ASSISTANT RAPORU

DOSYA
${result.filename || file?.name || "Bilinmiyor"}

TRANSCRIPT
${result.transcript || "Yok"}

SUMMARY
${result.summary || "Yok"}

ACTION ITEMS
${actionItems}

KEY DECISIONS
${keyDecisions}
    `.trim();

    const blob = new Blob([report], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "meeting-analysis-report.txt";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <main className="app-shell">
      <section className="hero">
        <div className="badge">Local AI • Private Processing</div>

        <h1>AI Meeting Assistant</h1>

        <p>
          Toplantı seslerini Whisper ile yazıya çevirir, Microsoft Phi-4-mini
          ile özet, aksiyon maddeleri ve önemli kararlar üretir.
        </p>
      </section>

      <section className="panel upload-panel">
        <div className="upload-zone">
          <div className="upload-content">
            <div className="upload-icon">🎙️</div>

            <h2>Toplantı kaydını yükle</h2>

            <p>MP3, WAV, OGG veya M4A formatları desteklenir.</p>

            <label
              className={`drop-zone ${file ? "has-file" : ""}`}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => {
                event.preventDefault();

                const droppedFile = event.dataTransfer.files?.[0];

                if (droppedFile) {
                  setFile(droppedFile);
                  setError("");
                }
              }}
            >
              <input
                className="hidden-file-input"
                type="file"
                accept=".mp3,.wav,.ogg,.m4a"
                onChange={(event) => {
                  setFile(event.target.files?.[0] ?? null);
                  setError("");
                }}
              />

              <div className="drop-icon">{file ? "✅" : "☁️"}</div>

              <h3>
                {file ? "Dosya hazır" : "Ses dosyasını buraya sürükle"}
              </h3>

              <p>
                {file
                  ? file.name
                  : "veya bilgisayarından seçmek için bu alana tıkla"}
              </p>
            </label>

            <button
              className="primary-button"
              type="button"
              onClick={analyzeMeeting}
              disabled={loading}
            >
              {loading
                ? "Toplantı analiz ediliyor..."
                : "Toplantıyı Analiz Et"}
            </button>

            {loading && (
              <div className="loading-box">
                <div className="spinner" />
                <span>Whisper ve Phi-4-mini çalışıyor...</span>
              </div>
            )}

            {error && <p className="error-message">{error}</p>}
          </div>
        </div>
      </section>

      <section className="results-grid">
        <article className="panel result-card full-width">
          <h2 className="card-title">📝 Transcript</h2>

          <p className={result?.transcript ? "card-text" : "empty-state"}>
            {result?.transcript || "Henüz bir toplantı analiz edilmedi."}
          </p>
        </article>

        <article className="panel result-card">
          <h2 className="card-title">📄 Summary</h2>

          <p className={result?.summary ? "card-text" : "empty-state"}>
            {result?.summary || "Toplantı özeti burada görünecek."}
          </p>
        </article>

        <article className="panel result-card">
          <h2 className="card-title">✅ Action Items</h2>

          {result?.action_items?.length ? (
            <ul className="card-list">
              {result.action_items.map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="empty-state">
              Bu toplantıda açık bir aksiyon maddesi tespit edilmedi.
            </p>
          )}
        </article>

        <article className="panel result-card full-width">
          <h2 className="card-title">📌 Key Decisions</h2>

          {result?.key_decisions?.length ? (
            <ul className="card-list">
              {result.key_decisions.map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))}
            </ul>
          ) : (
            <p className="empty-state">
              Bu toplantıda açık bir karar tespit edilmedi.
            </p>
          )}
        </article>

        {result && (
          <button
            className="download-button"
            type="button"
            onClick={downloadReport}
          >
            ⬇️ Raporu TXT Olarak İndir
          </button>
        )}
      </section>
    </main>
  );
}

export default App;