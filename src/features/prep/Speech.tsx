/**
 * Speaking & listening practice using the browser's Web Speech API.
 *  - Text-to-speech (speechSynthesis) reads passages aloud: available in all modern browsers.
 *  - Speech recognition scores what you say: Chrome and Edge only; other browsers get a clear notice.
 * Audio never leaves the browser except through the browser's own recognition service.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import { Eye, EyeOff, Mic, Pause, Play, RotateCcw, Square, Volume2 } from 'lucide-react';
import { Button, Select } from '../../components/ui';

type Rec = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start(): void;
  stop(): void;
  onresult: ((e: any) => void) | null;
  onend: (() => void) | null;
  onerror: ((e: any) => void) | null;
};

const RecognitionCtor: (new () => Rec) | undefined =
  typeof window !== 'undefined' ? (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition : undefined;
const hasTTS = typeof window !== 'undefined' && 'speechSynthesis' in window;

function pickVoice() {
  const voices = window.speechSynthesis.getVoices();
  return voices.find((v) => v.lang === 'en-US' && /natural|google|samantha|aria|jenny/i.test(v.name)) || voices.find((v) => v.lang.startsWith('en')) || null;
}

function useSpeaker() {
  const [state, setState] = useState<'idle' | 'speaking' | 'paused'>('idle');
  useEffect(() => () => window.speechSynthesis?.cancel(), []);
  const speak = (text: string, rate = 1) => {
    if (!hasTTS) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice();
    if (v) u.voice = v;
    u.lang = v?.lang || 'en-US';
    u.rate = rate;
    u.onend = () => setState('idle');
    u.onerror = () => setState('idle');
    window.speechSynthesis.speak(u);
    setState('speaking');
  };
  const pause = () => {
    window.speechSynthesis.pause();
    setState('paused');
  };
  const resume = () => {
    window.speechSynthesis.resume();
    setState('speaking');
  };
  const stop = () => {
    window.speechSynthesis.cancel();
    setState('idle');
  };
  return { state, speak, pause, resume, stop };
}

const words = (s: string) =>
  s
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

/** Align target and spoken words (LCS) to find which target words were said. */
function align(target: string[], spoken: string[]) {
  const n = target.length,
    m = spoken.length;
  const dp = Array.from({ length: n + 1 }, () => new Array<number>(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = target[i] === spoken[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const hit = new Array<boolean>(n).fill(false);
  let i = 0,
    j = 0;
  while (i < n && j < m) {
    if (target[i] === spoken[j]) {
      hit[i] = true;
      i++;
      j++;
    } else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }
  return hit;
}

function Unsupported({ what }: { what: string }) {
  return <div className="speech-note">{what} isn't supported in this browser. Use Chrome or Edge on desktop or Android for speech practice.</div>;
}

const RATES = [
  { value: '0.8', label: '0.8×' },
  { value: '1', label: '1×' },
  { value: '1.2', label: '1.2×' },
];

/** Listening: hear a passage read aloud, transcript hidden until you choose to reveal it. */
export function ListenBlock({ text }: { text: string }) {
  const sp = useSpeaker();
  const [rate, setRate] = useState('1');
  const [show, setShow] = useState(false);
  if (!hasTTS) return <Unsupported what="Text-to-speech" />;
  return (
    <div className="speech-card">
      <div className="speech-head">
        <Volume2 size={16} />
        <span className="grow">Listening exercise — listen first, then answer the practice questions below.</span>
      </div>
      <div className="row speech-controls">
        {sp.state === 'speaking' ? (
          <Button size="sm" variant="secondary" icon={<Pause />} onClick={sp.pause}>Pause</Button>
        ) : sp.state === 'paused' ? (
          <Button size="sm" variant="secondary" icon={<Play />} onClick={sp.resume}>Resume</Button>
        ) : (
          <Button size="sm" variant="primary" icon={<Play />} onClick={() => sp.speak(text, Number(rate))}>Play passage</Button>
        )}
        {sp.state !== 'idle' && <Button size="sm" variant="ghost" icon={<Square />} onClick={sp.stop}>Stop</Button>}
        <Select label="Speed" value={rate} onChange={setRate} options={RATES} />
        <div className="grow" />
        <Button size="sm" variant="ghost" icon={show ? <EyeOff /> : <Eye />} onClick={() => setShow((s) => !s)}>
          {show ? 'Hide transcript' : 'Show transcript'}
        </Button>
      </div>
      {show && <p className="speech-text">{text}</p>}
    </div>
  );
}

/**
 * Speaking: read a text aloud (mode "read") or repeat a sentence you only hear (mode "repeat").
 * Shows which words were recognised, word accuracy and speaking pace.
 */
export function SpeakBlock({ text, mode }: { text: string; mode: string }) {
  const repeat = mode === 'repeat';
  const free = mode === 'free';
  const sp = useSpeaker();
  const recRef = useRef<Rec | null>(null);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const [revealed, setRevealed] = useState(!repeat);
  const startedAt = useRef(0);
  const [elapsed, setElapsed] = useState(0);
  const target = useMemo(() => words(text), [text]);

  useEffect(() => () => recRef.current?.stop(), []);

  function start() {
    if (!RecognitionCtor) return;
    setError('');
    setTranscript('');
    const rec = new RecognitionCtor();
    rec.lang = 'en-US';
    rec.continuous = true;
    rec.interimResults = true;
    let finalText = '';
    rec.onresult = (e: any) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalText += e.results[i][0].transcript + ' ';
        else interim += e.results[i][0].transcript;
      }
      setTranscript((finalText + interim).trim());
    };
    rec.onerror = (e: any) => {
      setError(e.error === 'not-allowed' ? 'Microphone permission was denied. Allow it in the browser address bar and try again.' : `Speech recognition error: ${e.error}`);
      setRecording(false);
    };
    rec.onend = () => {
      setRecording(false);
      setElapsed((Date.now() - startedAt.current) / 1000);
    };
    recRef.current = rec;
    startedAt.current = Date.now();
    rec.start();
    setRecording(true);
  }

  function stop() {
    recRef.current?.stop();
  }

  const spoken = useMemo(() => words(transcript), [transcript]);
  const hit = useMemo(() => align(target, spoken), [target, spoken]);
  const done = !recording && transcript;
  const accuracy = target.length ? Math.round((hit.filter(Boolean).length / target.length) * 100) : 0;
  const wpm = elapsed > 1 ? Math.round((spoken.length / elapsed) * 60) : 0;

  return (
    <div className="speech-card">
      <div className="speech-head">
        <Mic size={16} />
        <span className="grow">
          {free
            ? 'Speaking task — prepare for 30 seconds, then speak for about a minute.'
            : repeat
            ? 'Sentence repetition — listen once, then repeat the sentence exactly.'
            : 'Reading aloud — read the text clearly at a natural pace.'}
        </span>
      </div>
      {revealed || done ? (
        <p className="speech-text">
          {done && !free
            ? text.split(/\s+/).map((w, i, arr) => {
                // map display words onto normalised target indices
                const idx = words(arr.slice(0, i + 1).join(' ')).length - 1;
                return (
                  <span key={i} className={hit[idx] ? 'word-ok' : 'word-miss'}>
                    {w}{' '}
                  </span>
                );
              })
            : text}
        </p>
      ) : (
        <p className="speech-text muted">The sentence is hidden. Press Play, then repeat it from memory.</p>
      )}
      <div className="row speech-controls">
        {hasTTS && !free && (
          <Button size="sm" variant="secondary" icon={<Volume2 />} onClick={() => sp.speak(text, 0.95)}>
            {repeat ? 'Play sentence' : 'Hear a model reading'}
          </Button>
        )}
        {RecognitionCtor ? (
          recording ? (
            <Button size="sm" variant="primary" icon={<Square />} onClick={stop}>Stop recording</Button>
          ) : (
            <Button size="sm" variant="primary" icon={<Mic />} onClick={start}>{transcript ? 'Try again' : 'Start recording'}</Button>
          )
        ) : null}
        {repeat && !revealed && <Button size="sm" variant="ghost" icon={<Eye />} onClick={() => setRevealed(true)}>Reveal</Button>}
        {transcript && !recording && (
          <Button size="sm" variant="ghost" icon={<RotateCcw />} onClick={() => { setTranscript(''); setElapsed(0); }}>Clear</Button>
        )}
        {recording && <span className="rec-dot">Recording…</span>}
      </div>
      {!RecognitionCtor && <Unsupported what="Speech recognition" />}
      {error && <div className="speech-note error">{error}</div>}
      {transcript && (
        <div className="speech-result">
          <div className="xs muted">What we heard</div>
          <p>{transcript}</p>
          {done && (
            <div className="row speech-stats">
              {!free && <span><strong>{accuracy}%</strong> words matched</span>}
              {wpm > 0 && (
                <span>
                  <strong>{wpm}</strong> words per minute {wpm < 110 ? '(a little slow — aim for 120–160)' : wpm > 170 ? '(fast — slow down slightly)' : '(good pace)'}
                </span>
              )}
              {!free && accuracy < 100 && <span className="muted">Words shown in red weren't recognised — re-read them more clearly.</span>}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
