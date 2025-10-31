import React, { useState, useEffect, useRef } from 'react';

// --- Constants ---
const EXERCISES = {
  PUSHUP: 'Pushups',
  SQUAT: 'Squats',
  CURL: 'Dumbbell Curls',
};
const CAMERA_WIDTH = 640;
const CAMERA_HEIGHT = 480;

// --- Utility: Script Loader ---
const loadExternalScript = (src, onLoadCallback) => {
  const script = document.createElement('script');
  script.src = src;
  script.async = true;
  if (onLoadCallback) script.onload = onLoadCallback;
  script.onerror = () => console.error(`Failed to load script: ${src}`);
  document.head.appendChild(script);
  return script;
};

// --- Global Script Hooks ---
const useGlobalScriptLoader = () => {
  useEffect(() => {
    loadExternalScript("https://cdn.tailwindcss.com");
  }, []);
};

const useMediaPipeLoader = (setIsLoaded) => {
  useEffect(() => {
    const scripts = [
      "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js",
      "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js",
      "https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js"
    ];

    let loaded = 0;
    const elems = scripts.map(src => loadExternalScript(src, () => {
      loaded++;
      if (loaded === scripts.length) {
        // small delay so globals are ready
        setTimeout(() => setIsLoaded(true), 300);
      }
    }));

    return () => elems.forEach(s => s.remove());
  }, [setIsLoaded]);
};

// --- Helpers ---
const calculateAngle = (a, b, c) => {
  if (!a || !b || !c || a.x === undefined || b.x === undefined || c.x === undefined) return 0;
  const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180) angle = 360 - angle;
  return angle;
};

// --- Pose Detection Hook (full counting logic) ---
const usePoseDetection = ({
  isMediaPipeLoaded,
  videoRef,
  canvasRef,
  status,
  exercise,
  setLeftCount,
  setRightCount,
  setMainCount,
  setSquatAngle
}) => {
  const poseRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    const cleanup = () => {
      try { cameraRef.current?.stop?.(); } catch (e) { /* ignore */ }
      try { poseRef.current?.close?.(); } catch (e) { /* ignore */ }
      cameraRef.current = null;
      poseRef.current = null;
    };

    if (status !== 'RUNNING' || !isMediaPipeLoaded) {
      cleanup();
      return;
    }

    if (typeof window.Pose === 'undefined' || typeof window.Camera === 'undefined') {
      console.error("MediaPipe libraries (Pose/Camera) are not loaded in the global scope.");
      return;
    }

    // local finite-state machines
    let leftCurlState = "down";
    let rightCurlState = "down";
    let leftReps = 0;
    let rightReps = 0;

    let pushupState = "up";
    let pushupReps = 0;

    let squatState = "up";
    let squatReps = 0;

    const pose = new window.Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    pose.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6,
    });

    poseRef.current = pose;

    pose.onResults((results) => {
      if (!canvasRef.current || !videoRef.current) return;
      const ctx = canvasRef.current.getContext('2d');
      ctx.save();
      ctx.clearRect(0, 0, CAMERA_WIDTH, CAMERA_HEIGHT);
      ctx.drawImage(results.image, 0, 0, CAMERA_WIDTH, CAMERA_HEIGHT);

      const lm = results.poseLandmarks;
      if (!lm) {
        ctx.restore();
        return;
      }

      // draw skeleton if drawing utils exist
      if (window.drawConnectors && window.drawLandmarks && window.POSE_CONNECTIONS) {
        window.drawConnectors(ctx, lm, window.POSE_CONNECTIONS, {
          color: '#1d4ed8',
          lineWidth: 3,
        });
        window.drawLandmarks(ctx, lm, {
          color: '#ef4444',
          lineWidth: 1,
        });
      }

      const isCurl = exercise === EXERCISES.CURL;
      const isPushup = exercise === EXERCISES.PUSHUP;
      const isSquat = exercise === EXERCISES.SQUAT;

      // CURL logic (both arms)
      if (isCurl) {
        if (lm[11] && lm[13] && lm[15]) {
          const leftAngle = calculateAngle(lm[11], lm[13], lm[15]);
          if (leftAngle > 150) leftCurlState = "down";
          if (leftAngle < 60 && leftCurlState === "down") {
            leftReps += 1;
            leftCurlState = "up";
            setLeftCount(leftReps);
            console.log(`CURL LEFT REP: ${leftReps}`);
          }
        }
        if (lm[12] && lm[14] && lm[16]) {
          const rightAngle = calculateAngle(lm[12], lm[14], lm[16]);
          if (rightAngle > 150) rightCurlState = "down";
          if (rightAngle < 60 && rightCurlState === "down") {
            rightReps += 1;
            rightCurlState = "up";
            setRightCount(rightReps);
            console.log(`CURL RIGHT REP: ${rightReps}`);
          }
        }
      }

      // PUSHUP logic (use elbows + hips to ensure plank)
      if (isPushup) {
        if (lm[11] && lm[13] && lm[15] && lm[12] && lm[14] && lm[16] && lm[23] && lm[24] && lm[27] && lm[28]) {
          const leftElbow = calculateAngle(lm[11], lm[13], lm[15]);
          const rightElbow = calculateAngle(lm[12], lm[14], lm[16]);
          const avgElbow = (leftElbow + rightElbow) / 2;

          const leftBack = calculateAngle(lm[11], lm[23], lm[27]);
          const rightBack = calculateAngle(lm[12], lm[24], lm[28]);
          const avgBack = (leftBack + rightBack) / 2;

          const inPlank = avgBack > 140;
          if (inPlank) {
            if (pushupState === "up" && avgElbow < 90) {
              pushupState = "down";
            } else if (pushupState === "down" && avgElbow > 150) {
              pushupReps += 1;
              setMainCount(pushupReps);
              pushupState = "up";
              console.log(`PUSHUP REP: ${pushupReps}`);
            }
          }
        }
      }

      // SQUAT logic (hip-knee-ankle angle)
      if (isSquat) {
        if (lm[24] && lm[26] && lm[28]) {
          const hip = lm[24], knee = lm[26], ankle = lm[28];
          const angle = calculateAngle(hip, knee, ankle);
          setSquatAngle(Math.round(angle));

          if (angle > 160) squatState = "up";
          if (angle < 90 && squatState === "up") {
            squatReps += 1;
            squatState = "down";
            setMainCount(squatReps);
            console.log(`SQUAT REP: ${squatReps}`);
          }
        }
      }

      ctx.restore();
    });

    // start camera
    if (videoRef.current) {
      const camera = new window.Camera(videoRef.current, {
        onFrame: async () => await pose.send({ image: videoRef.current }),
        width: CAMERA_WIDTH,
        height: CAMERA_HEIGHT,
      });
      camera.start();
      cameraRef.current = camera;
    }

    return cleanup;
  }, [status, exercise, isMediaPipeLoaded, setLeftCount, setRightCount, setMainCount, setSquatAngle]);
};

// --- UI primitives ---
const Button = ({ children, onClick, disabled = false, color = 'blue', className = '' }) => {
  const colorMap = {
    blue: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500/50 text-white',
    red: 'bg-red-600 hover:bg-red-700 focus:ring-red-500/50 text-white',
    green: 'bg-green-600 hover:bg-green-700 focus:ring-green-500/50 text-white',
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-3 font-semibold rounded-xl shadow-md transition duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 ${colorMap[color]} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = '' }) => (
  <div className={`bg-white text-gray-900 p-6 md:p-8 rounded-2xl shadow-xl transition-shadow duration-300 hover:shadow-2xl border border-blue-100 w-full ${className}`}>
    {children}
  </div>
);

// --- FormTips (returns HTML strings so we can dangerouslySetInnerHTML) ---
const FormTips = ({ exercise }) => {
  const highlight = 'text-blue-600 font-semibold';
  const formatTip = (tip, keyPhrases = []) => {
    // escape then replace phrases with styled span; simple replacement (case-sensitive)
    let html = tip;
    keyPhrases.forEach(k => {
      const safe = `<span class="${highlight}">${k}</span>`;
      html = html.split(k).join(safe);
    });
    return html;
  };

  let tips = [];
  let title = "Posture Guidance";

  switch (exercise) {
    case EXERCISES.PUSHUP:
      tips = [
        formatTip("Keep your body in a straight line (head to heels).", ["straight line"]),
        formatTip("Lower your chest until your elbows reach a 90-degree angle.", ["90-degree angle"]),
        formatTip("Keep your elbows tucked close to your body (45° angle to torso).", ["elbows tucked close"]),
        formatTip("Maintain a tight core and straight back throughout the movement.", ["tight core", "straight back"]),
      ];
      break;
    case EXERCISES.SQUAT:
      tips = [
        formatTip("Keep your chest up and shoulders back.", ["chest up", "shoulders back"]),
        formatTip("Start the movement by pushing your hips back.", ["hips back"]),
        formatTip("Ensure your knees track over your toes, not collapsing inward.", ["knees track over your toes"]),
        formatTip("Descend until your hips are below or parallel to your knees.", ["below or parallel"]),
      ];
      break;
    case EXERCISES.CURL:
      tips = [
        formatTip("Keep your elbows pinned to your sides (no swinging).", ["elbows pinned"]),
        formatTip("Maintain tension by lowering the weight slowly.", ["lowering the weight slowly"]),
        formatTip("Stop just before your arm is fully straight at the bottom.", ["arm is fully straight"]),
        formatTip("Only the forearm should be moving; keep the upper arm static.", ["forearm should be moving"]),
      ];
      break;
    default:
      tips = ["Select an exercise and press 'Start Tracking' to view personalized form guidance."];
  }

  return (
    <div className="space-y-3">
      <h3 className="text-2xl font-bold text-blue-700 border-b border-blue-200 pb-2">{title}</h3>
      <ul className="list-disc list-inside space-y-3 text-lg text-gray-700 pl-4">
        {tips.map((t, i) => (
          <li key={i} dangerouslySetInnerHTML={{ __html: t }} />
        ))}
      </ul>
    </div>
  );
};

// --- Main Component (full UI + state) ---
export default function PostureCorrector() {
  const [exercise, setExercise] = useState(EXERCISES.CURL);
  const [status, setStatus] = useState('IDLE'); // 'IDLE' | 'RUNNING' | 'STOPPED'
  const [isMediaPipeLoaded, setIsMediaPipeLoaded] = useState(false);

  const [mainCount, setMainCount] = useState(0);
  const [leftCount, setLeftCount] = useState(0);
  const [rightCount, setRightCount] = useState(0);
  const [squatAngle, setSquatAngle] = useState(0);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const isRunning = status === 'RUNNING';
  const isCurl = exercise === EXERCISES.CURL;
  const isSquat = exercise === EXERCISES.SQUAT;

  useGlobalScriptLoader();
  useMediaPipeLoader(setIsMediaPipeLoaded);

  usePoseDetection({
    isMediaPipeLoaded,
    videoRef,
    canvasRef,
    status,
    exercise,
    setLeftCount,
    setRightCount,
    setMainCount,
    setSquatAngle
  });

  const resetCounts = () => {
    setMainCount(0);
    setLeftCount(0);
    setRightCount(0);
    setSquatAngle(0);
    setStatus('IDLE');
  };

  const handleStart = () => {
    if (!isMediaPipeLoaded) {
      console.warn("AI Model is still loading. Please wait...");
      return;
    }
    resetCounts();
    setStatus('RUNNING');
  };

  const handleStop = () => {
    setStatus('STOPPED');
  };

  const renderCounterDisplay = () => {
    const countBoxBase = "text-center p-3 rounded-xl shadow-inner min-w-[130px] flex-1";

    if (isCurl) {
      return (
        <div className="flex space-x-4 w-full">
          <div className={`${countBoxBase} bg-blue-100 text-blue-800`}>
            <p className="text-sm font-medium">Left Reps</p>
            <p className="text-3xl font-extrabold">{leftCount}</p>
          </div>
          <div className={`${countBoxBase} bg-blue-100 text-blue-800`}>
            <p className="text-sm font-medium">Right Reps</p>
            <p className="text-3xl font-extrabold">{rightCount}</p>
          </div>
        </div>
      );
    }

    if (isSquat || exercise === EXERCISES.PUSHUP) {
      let secondBoxContent;
      if (isSquat) {
        const angleFeedback = squatAngle > 160 ? "Standing" : squatAngle > 90 ? "Descending" : squatAngle > 0 ? "Deep Squat" : "Not Detected";
        secondBoxContent = (
          <>
            <p className="text-sm font-medium">Knee Angle / Depth</p>
            <p className="text-xl font-bold">{squatAngle}° ({angleFeedback})</p>
          </>
        );
      } else {
        secondBoxContent = (
          <>
            <p className="text-sm font-medium">Goal</p>
            <p className="text-xl font-bold">90° Elbow Bend</p>
          </>
        );
      }

      return (
        <div className="flex space-x-4 w-full">
          <div className={`${countBoxBase} bg-blue-100 text-blue-800`}>
            <p className="text-sm font-medium">Total {exercise}</p>
            <p className="text-3xl font-extrabold">{mainCount}</p>
          </div>
          <div className={`${countBoxBase} bg-white text-gray-700 border border-blue-200 shadow-none`}>
            {secondBoxContent}
          </div>
        </div>
      );
    }

    return (
      <div className={`${countBoxBase} bg-blue-100 text-blue-800`}>
        <p className="text-sm font-medium">Reps</p>
        <p className="text-3xl font-extrabold">{mainCount}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-blue-50 text-gray-900 p-4 sm:p-8 flex items-center justify-center font-sans">
      <div className="w-full max-w-6xl space-y-8">
        <h1 className="text-5xl font-extrabold text-center text-blue-800 tracking-tight">
          Posture Corrector
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-1 h-full space-y-8">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold border-b border-blue-200 pb-3 text-blue-700">Session Control</h2>

              <div className="space-y-3">
                <label htmlFor="exercise-select" className="block text-lg font-semibold text-gray-700">
                  Choose Your Challenge
                </label>
                <select
                  id="exercise-select"
                  value={exercise}
                  onChange={(e) => { setExercise(e.target.value); resetCounts(); }}
                  disabled={isRunning || !isMediaPipeLoaded}
                  className="w-full p-3 rounded-lg bg-blue-50 border border-blue-300 text-gray-900 appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-70 transition duration-150"
                >
                  {Object.values(EXERCISES).map((ex) => (
                    <option key={ex} value={ex}>{ex}</option>
                  ))}
                </select>
              </div>

              <div className="flex space-x-4">
                <Button onClick={handleStart} disabled={isRunning || !isMediaPipeLoaded} color="blue" className="flex-1">
                  {isRunning ? 'Tracking...' : 'Start Tracking'}
                </Button>
                <Button onClick={handleStop} disabled={!isRunning} color="red" className="flex-1">
                  Stop Tracking
                </Button>
              </div>

              <Button onClick={resetCounts} disabled={isRunning} color="green" className="w-full">
                Reset Counts
              </Button>
            </div>

            <div className="border-t border-blue-100 pt-6">
              <h3 className="text-xl font-bold mb-4 text-center text-blue-700">Real-time Metrics</h3>
              <div className="flex justify-center">
                {renderCounterDisplay()}
              </div>
            </div>
          </Card>

          <Card className="lg:col-span-2 flex flex-col items-center p-4">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Visual Tracker</h2>

            <div className="relative w-full max-w-[640px] aspect-[640/480] bg-gray-900 rounded-xl overflow-hidden shadow-inner shadow-gray-400">
              <video ref={videoRef} className="hidden" playsInline />

              <canvas
                ref={canvasRef}
                width={CAMERA_WIDTH}
                height={CAMERA_HEIGHT}
                className="w-full h-full object-cover"
              />

              {(!isRunning || !isMediaPipeLoaded) && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-gray-300 backdrop-blur-sm">
                  {!isMediaPipeLoaded ? (
                    <p className="text-xl font-bold text-blue-400 p-4 rounded-lg bg-gray-900/50">Loading AI Model...</p>
                  ) : (
                    <p className="text-xl p-4 rounded-lg bg-gray-900/50">Select exercise and press 'Start Tracking'</p>
                  )}
                </div>
              )}
            </div>
          </Card>

          <Card className="lg:col-span-3">
            <FormTips exercise={exercise} />
          </Card>
        </div>
      </div>
    </div>
  );
}
