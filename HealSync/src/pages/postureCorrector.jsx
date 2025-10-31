import React, { useState, useEffect, useRef } from 'react';

// NOTE: All external dependencies (Tailwind, MediaPipe) are loaded dynamically 
// using dedicated useEffect hooks to ensure they are globally available.

// --- Constants ---
const EXERCISES = {
  PUSHUP: 'Pushups',
  SQUAT: 'Squats',
  CURL: 'Dumbbell Curls',
  VRIKSHASAN: 'Vrikshasan (Tree Pose)', 
  BHUJANGASANA: 'Bhujangasana (Cobra Pose)', 
};
const CAMERA_WIDTH = 640;
const CAMERA_HEIGHT = 480;

// --- Utility: Script Loader ---
/**
 * Loads an external script into the document head.
 */
const loadExternalScript = (src, onLoadCallback) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    if (onLoadCallback) script.onload = onLoadCallback;
    script.onerror = () => console.error(`Failed to load script: ${src}`);
    document.head.appendChild(script);
    return script;
};

// --- Custom Hook for Global Script Loading (Tailwind & MediaPipe) ---

const useGlobalScriptLoader = () => {
    useEffect(() => {
        // 1. Load Tailwind CSS (Must be loaded first to apply styles)
        loadExternalScript("https://cdn.tailwindcss.com");
    }, []);
};

const useMediaPipeLoader = (setIsLoaded) => {
  useEffect(() => {
    // MediaPipe CDN URLs
    const scripts = [
      "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js",
      "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js",
      "https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js"
    ];

    let scriptsLoaded = 0;
    const totalScripts = scripts.length;

    // Function to handle loading one script
    const scriptLoaded = () => {
        scriptsLoaded++;
        if (scriptsLoaded === totalScripts) {
            // Set loaded state after a small delay to ensure global availability
            setTimeout(() => {
                setIsLoaded(true);
            }, 500); 
        }
    };

    const scriptElements = scripts.map(src => loadExternalScript(src, scriptLoaded));

    // Cleanup function
    return () => {
        scriptElements.forEach(script => {
            if (script.parentNode) {
                script.parentNode.removeChild(script);
            }
        });
    };
  }, [setIsLoaded]);
};


// --- Helper Functions ---

/**
 * Calculates the angle between three points (a, b, c) in 2D space.
 */
const calculateAngle = (a, b, c) => {
  // Defensive check for valid landmark points
  if (!a || !b || !c || a.x === undefined || b.x === undefined || c.x === undefined) return 0;
  
  const radians =
    Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
  let angle = Math.abs((radians * 180.0) / Math.PI);
  if (angle > 180) angle = 360 - angle;
  return angle;
};

// --- BHUJANGASANA POSE CHECK LOGIC (Cobra Pose) ---
const checkCobraPose = (landmarks) => {
    // Check for required landmarks
    if (!landmarks[0] || !landmarks[11] || !landmarks[12] || !landmarks[23] || !landmarks[24] || !landmarks[25] || !landmarks[26]) {
        return false;
    }

    const leftShoulder = landmarks[11];
    const rightShoulder = landmarks[12];
    const leftHip = landmarks[23];
    const rightHip = landmarks[24];
    const leftKnee = landmarks[25];
    const rightKnee = landmarks[26];
    const nose = landmarks[0];

    // 1️⃣ Shoulders higher (smaller y) than hips → upper body raised
    const shoulderY = (leftShoulder.y + rightShoulder.y) / 2;
    const hipY = (leftHip.y + rightHip.y) / 2;
    // hipY > shoulderY means the shoulder is higher on the screen (lifted)
    const upperBodyLifted = hipY - shoulderY > 0.15; 

    // 2️⃣ Legs straight → hips and knees close vertically (minimal bend)
    const kneeY = (leftKnee.y + rightKnee.y) / 2;
    const legsStraight = Math.abs(kneeY - hipY) < 0.1;

    // 3️⃣ Head raised → nose above shoulders (smaller Y coordinate)
    const headLifted = shoulderY - nose.y > 0.05;

    return upperBodyLifted && legsStraight && headLifted;
};

// --- VRIKSHASAN POSE CHECK LOGIC ---
const checkVrikshasanPose = (landmarks, calculateAngle) => {
    // Check for required landmarks
    if (!landmarks[11] || !landmarks[12] || !landmarks[23] || !landmarks[24] || !landmarks[25] || !landmarks[26] || !landmarks[15] || !landmarks[16]) {
        return false;
    }

    const [L_Sh, R_Sh, L_Hip, R_Hip, L_Knee, R_Knee, L_Wrist, R_Wrist, L_Ank, R_Ank] = [
        landmarks[11], landmarks[12], landmarks[23], landmarks[24], landmarks[25], landmarks[26], 
        landmarks[15], landmarks[16], landmarks[27], landmarks[28]
    ];

    // Determine Standing Leg (the one with the lower ankle Y-coordinate, or higher on the screen)
    const isLeftLegStanding = L_Ank.y < R_Ank.y; 

    // 1. LEG LIFTED: Check for a reasonable height difference
    const ankleYDiff = Math.abs(L_Ank.y - R_Ank.y);
    const legLifted = ankleYDiff > 0.10; 

    // 2. STANDING LEG STRAIGHTNESS (Hip-Knee-Ankle angle near 180)
    const standingHip = isLeftLegStanding ? L_Hip : R_Hip;
    const standingKnee = isLeftLegStanding ? L_Knee : R_Knee;
    const standingAnkle = isLeftLegStanding ? L_Ank : R_Ank;
    
    // Check the angle of the standing leg's knee joint
    const standingKneeAngle = calculateAngle(standingHip, standingKnee, standingAnkle);
    // Must be close to 180 (straight)
    const standingLegStraight = Math.abs(standingKneeAngle - 180) < 20; 

    // 3. HANDS UP & JOINED (Arms above shoulders and hands close)
    const wristDistance = Math.hypot(
        L_Wrist.x - R_Wrist.x,
        L_Wrist.y - R_Wrist.y
    );
    // Wrists must be close AND clearly higher (smaller Y-coord) than both shoulders
    const handsJoined = wristDistance < 0.2; 
    const armsAboveShoulders = L_Wrist.y < L_Sh.y && R_Wrist.y < R_Sh.y;
    
    const isArmsUp = handsJoined && armsAboveShoulders;

    // VRIKSHASAN is correct if all three primary conditions are met
    return legLifted && standingLegStraight && isArmsUp;
};


// --- Custom Hook for Pose Detection Logic ---
const usePoseDetection = ({ 
  isMediaPipeLoaded, 
  videoRef, 
  canvasRef, 
  status, 
  exercise, 
  setLeftCount, 
  setRightCount, 
  setMainCount, 
  setSquatAngle,
  setIsCorrectPose // <- PROP FOR YOGA POSE FEEDBACK
}) => {
  const poseDetectorRef = useRef(null);
  const cameraRef = useRef(null);
  const isRunning = status === 'RUNNING';

  const isCurl = exercise === EXERCISES.CURL;
  const isPushup = exercise === EXERCISES.PUSHUP;
  const isSquat = exercise === EXERCISES.SQUAT;
  const isVrikshasan = exercise === EXERCISES.VRIKSHASAN;
  const isBhujangasana = exercise === EXERCISES.BHUJANGASANA; // <- NEW CHECK

  useEffect(() => {
    // ----------------------------------------------------
    // Cleanup/Shutdown Logic
    // ----------------------------------------------------
    const cleanup = () => {
        if (cameraRef.current) {
            cameraRef.current.stop();
            cameraRef.current = null;
        }
        if (poseDetectorRef.current) {
            poseDetectorRef.current.close();
            poseDetectorRef.current = null;
        }
    };

    // If not running or still loading, just clean up and exit
    if (status !== 'RUNNING' || !isMediaPipeLoaded) {
        cleanup();
        setIsCorrectPose(false); // Reset feedback when idle
        return;
    }

    // ----------------------------------------------------
    // Initialization Logic 
    // ----------------------------------------------------
    
    if (typeof window.Pose === 'undefined' || typeof window.Camera === 'undefined') {
      console.error("MediaPipe libraries (Pose/Camera) are not loaded in the global scope.");
      return;
    }
    
    // Local state machines for counting
    let leftCurlState = "down";
    let rightCurlState = "down";
    let leftReps = 0;
    let rightReps = 0;
    
    let pushupState = "up";
    let pushupReps = 0;
    
    let squatState = "up";
    let squatReps = 0;

    // 1. Initialize Pose Detector
    const poseDetector = new window.Pose({ 
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    poseDetector.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.6,
      minTrackingConfidence: 0.6,
    });
    
    poseDetectorRef.current = poseDetector;

    // 2. Define Results Callback (The main processing loop)
    poseDetector.onResults((results) => {
      if (!canvasRef.current || !videoRef.current) return;
      
      const canvasCtx = canvasRef.current.getContext("2d");
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, CAMERA_WIDTH, CAMERA_HEIGHT);

      // Draw camera frame
      canvasCtx.drawImage(
        results.image,
        0, 0, CAMERA_WIDTH, CAMERA_HEIGHT
      );
      
      let currentCorrectPose = false; 
      
      if (results.poseLandmarks) {
        const lm = results.poseLandmarks;
        
        // --- STATIC POSE LOGIC (Vrikshasan / Bhujangasana) ---
        if (isVrikshasan) {
            currentCorrectPose = checkVrikshasanPose(lm, calculateAngle);
            setIsCorrectPose(currentCorrectPose); 
        } else if (isBhujangasana) { // <- BHUJANGASANA CHECK
            currentCorrectPose = checkCobraPose(lm);
            setIsCorrectPose(currentCorrectPose); 
        } else {
             setIsCorrectPose(false);
        }

        // --- Draw Skeleton (Dynamic Color Logic) ---
        const isStaticPose = isVrikshasan || isBhujangasana;
        const connectionColor = isStaticPose && currentCorrectPose ? "lime" : isRunning ? "#1d4ed8" : "#9ca3af";
        const landmarkColor = isStaticPose && currentCorrectPose ? "#00ff00" : isRunning ? "#ef4444" : "#9ca3af";

        if (window.drawConnectors && window.drawLandmarks && window.POSE_CONNECTIONS) {
            window.drawConnectors(canvasCtx, lm, window.POSE_CONNECTIONS, {
                color: connectionColor,
                lineWidth: 3,
            });
            window.drawLandmarks(canvasCtx, lm, {
                color: landmarkColor,
                lineWidth: 1,
            });
        }


        // --- CONDITIONAL COUNTING LOGIC (Repetitive Exercises) ---
        if (isCurl) {
          // Dumbbell Curl Logic 
          if (lm[11] && lm[13] && lm[15] && lm[12] && lm[14] && lm[16]) {
            const leftAngle = calculateAngle(lm[11], lm[13], lm[15]);
            const rightAngle = calculateAngle(lm[12], lm[14], lm[16]);

            if (leftAngle > 150) leftCurlState = "down";
            if (leftAngle < 60 && leftCurlState === "down") {
              leftReps++;
              leftCurlState = "up";
              setLeftCount(leftReps); 
            }

            if (rightAngle > 150) rightCurlState = "down";
            if (rightAngle < 60 && rightCurlState === "down") {
              rightReps++;
              rightCurlState = "up";
              setRightCount(rightReps);
            }
          }
        } 
        
        else if (isPushup) {
          // Pushup Logic
          if (lm[11] && lm[13] && lm[15] && lm[23] && lm[27] && lm[12] && lm[14] && lm[16] && lm[24] && lm[28]) {
            const leftElbowAngle = calculateAngle(lm[11], lm[13], lm[15]);
            const rightElbowAngle = calculateAngle(lm[12], lm[14], lm[16]);
            const avgElbowAngle = (leftElbowAngle + rightElbowAngle) / 2;

            const leftBackAngle = calculateAngle(lm[11], lm[23], lm[27]);
            const rightBackAngle = calculateAngle(lm[12], lm[24], lm[28]);
            const avgBackAngle = (leftBackAngle + rightBackAngle) / 2;
            
            const inPosition = avgBackAngle > 140; 

            if (inPosition) {
              if (pushupState === "up" && avgElbowAngle < 90) {
                pushupState = "down";
              } else if (pushupState === "down" && avgElbowAngle > 150) {
                pushupReps += 1;
                setMainCount(pushupReps);
                pushupState = "up";
              }
            }
          }
        } 
        
        else if (isSquat) {
          // Squat Logic
          if (lm[24] && lm[26] && lm[28]) {
            const hip = lm[24]; 
            const knee = lm[26]; 
            const ankle = lm[28]; 

            const angle = calculateAngle(hip, knee, ankle);
            setSquatAngle(Math.round(angle));

            if (angle > 160) {
              squatState = "up";
            }
            if (angle < 90 && squatState === "up") {
              squatReps++;
              squatState = "down";
              setMainCount(squatReps);
            }
          }
        }
        
      }

      canvasCtx.restore();
    });

    // 3. Start Camera and send frames to Pose Detector
    if (videoRef.current) {
      const camera = new window.Camera(videoRef.current, { 
        onFrame: async () => {
          await poseDetector.send({ image: videoRef.current });
        },
        width: CAMERA_WIDTH,
        height: CAMERA_HEIGHT,
      });
      camera.start();
      cameraRef.current = camera;
    }
    
    return cleanup;

  }, [status, exercise, isMediaPipeLoaded, setIsCorrectPose]); 
};

// --- UI Components ---

const Button = ({ children, onClick, disabled = false, color = 'blue' }) => {
  const baseStyle = "px-6 py-3 font-semibold rounded-xl shadow-md transition duration-200 ease-in-out transform hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4";

  const colorMap = {
    blue: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500/50 text-white",
    red: "bg-red-600 hover:bg-red-700 focus:ring-red-500/50 text-white",
    green: "bg-green-600 hover:bg-green-700 focus:ring-green-500/50 text-white",
  };

  const style = colorMap[color];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${style} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {children}
    </button>
  );
};


const Card = ({ children, className = '' }) => (
  <div
    className={`bg-white text-gray-900 p-6 md:p-8 rounded-2xl shadow-xl transition-shadow duration-300 hover:shadow-2xl border border-blue-100 w-full ${className}`}
  >
    {children}
  </div>
);


// --- Guidance Card Component (Updated) ---
const GuidanceCard = ({ exercise, isRunning, isCorrectPose }) => {
    let tips = [];
    let title = "Posture Guidance";
    const isStaticPose = exercise === EXERCISES.VRIKSHASAN || exercise === EXERCISES.BHUJANGASANA;

    // Helper function to apply styling to the key parts of the tip
    const formatTip = (tip, keyPhrases) => {
        let formattedTip = tip;
        const highlightClass = "text-blue-600 font-semibold"; 
        
        keyPhrases.forEach(phrase => {
            // Use a regex to replace all instances of the phrase
            formattedTip = formattedTip.replace(
                new RegExp(phrase, 'g'), 
                <span class="${highlightClass}">${phrase}</span>
            );
        });
        return formattedTip;
    };

    if (isRunning && isStaticPose) {
        title = "Real-time Pose Feedback";
        if (isCorrectPose) {
            // Correct Pose Feedback (Green Success)
            return (
                <div className="text-center p-4 bg-green-100 border border-green-400 rounded-xl">
                    <h3 className="text-3xl font-extrabold text-green-700">✅ CORRECT POSE!</h3>
                    <p className="text-lg text-green-600">Hold the position with a focused mind and steady breath.</p>
                </div>
            );
        } else {
            // Incorrect Pose Feedback (Display the full guidance)
            if (exercise === EXERCISES.VRIKSHASAN) {
                tips = [
                    formatTip("Look at a single fixed point (Drishti) for 10-20 seconds to aid balance.", ["Drishti"]),
                    formatTip("Press the sole of the lifted foot firmly against the inner thigh or calf (avoid the knee joint).", ["inner thigh or calf"]),
                    formatTip("Ensure your hips face forward and are level; don't let the standing hip jut out.", ["hips face forward"]),
                    formatTip("Stretch your arms straight above your head with hands joined (Namaste position).", ["arms straight", "Namaste position"]),
                    formatTip("Keep your standing leg straight but not locked.", ["standing leg straight"])
                ];
            } else if (exercise === EXERCISES.BHUJANGASANA) { // <- BHUJANGASANA LIVE TIPS
                tips = [
                    formatTip("Keep your legs straight and together; press the top of your feet down.", ["legs straight and together", "press the top of your feet"]),
                    formatTip("Engage your back muscles to lift your chest, not just your arms.", ["back muscles to lift your chest"]),
                    formatTip("Keep your elbows slightly bent and tucked close to your body.", ["elbows slightly bent and tucked"]),
                    formatTip("Avoid shrugging your shoulders toward your ears; draw them back and down.", ["draw them back and down"]),
                ];
            }
        }
    } 
    
    // Standard Repetition Exercise Tips and IDLE tips
    else {
        switch (exercise) {
            case EXERCISES.PUSHUP:
                tips = [
                    formatTip("Keep your body in a straight line (head to heels).", ["straight line"]),
                    formatTip("Lower your chest until your elbows reach a 90-degree angle.", ["90-degree angle"]),
                    formatTip("Keep your elbows tucked close to your body (45° angle to torso).", ["elbows tucked close"]),
                    formatTip("Maintain a tight core and straight back throughout the movement.", ["tight core", "straight back"])
                ];
                break;
            case EXERCISES.SQUAT:
                tips = [
                    formatTip("Keep your chest up and shoulders back.", ["chest up", "shoulders back"]),
                    formatTip("Start the movement by pushing your hips back.", ["hips back"]),
                    formatTip("Ensure your knees track over your toes, not collapsing inward.", ["knees track over your toes"]),
                    formatTip("Descend until your hips are below or parallel to your knees.", ["below or parallel"])
                ];
                break;
            case EXERCISES.CURL:
                tips = [
                    formatTip("Keep your elbows pinned to your sides (no swinging).", ["elbows pinned"]),
                    formatTip("Maintain tension by lowering the weight slowly.", ["lowering the weight slowly"]),
                    formatTip("Stop just before your arm is fully straight at the bottom.", ["arm is fully straight"]),
                    formatTip("Only the forearm should be moving; keep the upper arm static.", ["forearm should be moving"])
                ];
                break;
            case EXERCISES.VRIKSHASAN:
                 tips = [
                    "Static Pose: Vrikshasan is a static pose. Press 'Start Tracking' to begin the real-time form check.",
                    "Setup Hint: Lift one foot and place the sole on the opposite inner thigh. Bring hands overhead into Namaste.",
                 ];
                 break;
            case EXERCISES.BHUJANGASANA: // <- BHUJANGASANA IDLE TIPS
                tips = [
                    "Static Pose: Bhujangasana is a static pose. Press 'Start Tracking' to begin the real-time form check.",
                    "Setup Hint: Lie face down, place hands beneath your shoulders, lift chest while keeping hips grounded.",
                ];
                break;
            default:
                tips = ["Select an exercise and press 'Start Tracking' to view personalized form guidance."];
        }
    }

    return (
        <div className="space-y-3">
            <h3 className="text-2xl font-bold text-blue-700 border-b border-blue-200 pb-2">{title}</h3>
            <ul className="list-disc list-inside space-y-3 text-lg text-gray-700 pl-4">
                {tips.map((tip, index) => (
                    <li key={index} dangerouslySetInnerHTML={{ __html: tip }}></li>
                ))}
            </ul>
        </div>
    );
};

// --- Main Application Component ---

export default function App() {
  const [exercise, setExercise] = useState(EXERCISES.VRIKSHASAN); // Changed default to Vrikshasan for testing
  const [status, setStatus] = useState('IDLE'); // 'IDLE', 'RUNNING', 'STOPPED'
  const [isMediaPipeLoaded, setIsMediaPipeLoaded] = useState(false); 
  
  // Repetition Counters and Status
  const [mainCount, setMainCount] = useState(0); 
  const [leftCount, setLeftCount] = useState(0); 
  const [rightCount, setRightCount] = useState(0); 
  const [squatAngle, setSquatAngle] = useState(0); 
  const [isCorrectPose, setIsCorrectPose] = useState(false); // <- NEW STATE FOR YOGA

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const isRunning = status === 'RUNNING';
  const isCurl = exercise === EXERCISES.CURL;
  // Define isStaticPose here to use in the JSX header logic
  const isStaticPose = exercise === EXERCISES.VRIKSHASAN || exercise === EXERCISES.BHUJANGASANA; 

  // 0. Load the Tailwind CDN script first (outside the MediaPipe loader)
  useGlobalScriptLoader();

  // 1. Load the MediaPipe scripts dynamically
  useMediaPipeLoader(setIsMediaPipeLoaded);

  // 2. Integrate custom hook for detection logic
  usePoseDetection({
    isMediaPipeLoaded, 
    videoRef,
    canvasRef,
    status,
    exercise,
    setLeftCount,
    setRightCount,
    setMainCount,
    setSquatAngle,
    setIsCorrectPose // <- PASS NEW STATE
  });


  // --- Controls and Cleanup ---

  const resetCounts = () => {
    setMainCount(0);
    setLeftCount(0);
    setRightCount(0);
    setSquatAngle(0);
    setIsCorrectPose(false); // Reset Vrikshasan feedback
    setStatus('IDLE');
  };

  const handleStart = () => {
    if (!isMediaPipeLoaded) {
      console.warn("AI Model is still loading. Please wait...");
      return;
    }
    resetCounts(); // Reset counts before starting new session
    setStatus('RUNNING');
  };

  const handleStop = () => {
    setStatus('STOPPED'); 
  };

  // --- UI Rendering Logic ---

  const renderCounterDisplay = () => {
    const isSquat = exercise === EXERCISES.SQUAT;
    
    // Base style for the counter boxes
    const countBoxBase = "text-center p-3 rounded-xl shadow-inner min-w-[130px] flex-1";

    if (isStaticPose) {
        const feedbackColor = isCorrectPose ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800";
        // --- CHANGE: Simplified feedback text to just CORRECT/INCORRECT with emoji ---
        const feedbackText = isCorrectPose ? "✅ CORRECT" : "❌ INCORRECT"; 
        
        return (
          <div className={`${countBoxBase} ${feedbackColor} flex items-center justify-center h-[90px]`}>
  {/* --- REMOVED: <p className="text-sm font-medium">Pose Status</p> --- */}
  <p className="text-3xl font-extrabold leading-none">
    {isRunning ? feedbackText : "IDLE"}
  </p>
</div>

        );
    }

    if (isCurl) {
      return (
        <div className="flex space-x-4">
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
    
    else if (isSquat || exercise === EXERCISES.PUSHUP) {
      let secondBoxContent;
      if (isSquat) {
        const angleFeedback = squatAngle > 160 ? "Standing" : squatAngle > 90 ? "Descending" : squatAngle > 0 ? "Deep Squat" : "Not Detected";
        secondBoxContent = (
            <>
                <p className="text-sm font-medium">Knee Angle / Depth</p>
                <p className="text-xl font-bold">{squatAngle}° ({angleFeedback})</p>
            </>
        );
      } else { // Pushup
        secondBoxContent = (
            <>
                <p className="text-sm font-medium">Goal</p>
                <p className="text-xl font-bold">90° Elbow Bend</p>
            </>
        );
      }

      return (
        <div className="flex space-x-4">
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
        {/* --- CHANGE: Renamed App Title --- */}
        <h1 className="text-5xl font-extrabold text-center text-blue-800 tracking-tight">
            Posturise
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Controls Panel (Left Column - lg:col-span-1) */}
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

                {/* Tracking Buttons */}
                <div className="flex space-x-4">
                  <Button onClick={handleStart} disabled={isRunning || !isMediaPipeLoaded} color="blue" className="flex-1">
                    {isRunning ? 'Tracking...' : 'Start Tracking'}
                  </Button>
                  <Button onClick={handleStop} disabled={!isRunning} color="red" className="flex-1">
                    Stop Tracking
                  </Button>
                </div>
                
                {/* Reset Button */}
                <Button onClick={resetCounts} disabled={isRunning} color="green" className="w-full">
                    Reset Session
                </Button>
            </div>
            
            {/* Live Counter Display: Real-time Metrics (Header is conditional) */}
            <div className="border-t border-blue-100 pt-6">
                {/* --- CHANGE: Conditionally change header for Yoga poses --- */}
                <h3 className="text-xl font-bold mb-4 text-center text-blue-700">
                    {isStaticPose ? "Pose Status" : "Real-time Metrics"}
                </h3>
                <div className="flex justify-center">
                    {renderCounterDisplay()}
                </div>
            </div>
          </Card>
          
          {/* Camera/Canvas Panel (Right Column - lg:col-span-2) */}
          <Card className="lg:col-span-2 flex flex-col items-center p-4">
            <h2 className="text-2xl font-bold mb-4 text-blue-700">Visual Tracker</h2>
            
            <div className="relative w-full max-w-[640px] aspect-[640/480] bg-gray-900 rounded-xl overflow-hidden shadow-inner shadow-gray-400">
              {/* Hidden video element - used as input source for canvas */}
              <video ref={videoRef} className="hidden" playsInline />
              
              {/* Visible canvas - draws video frame and pose landmarks */}
              <canvas
                ref={canvasRef}
                width={CAMERA_WIDTH}
                height={CAMERA_HEIGHT}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay for loading/idle status */}
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

            {/* Posture Guidance Card (Spanning 3 Columns) */}
            <Card className="lg:col-span-3">
                <GuidanceCard 
                    exercise={exercise} 
                    isRunning={isRunning} 
                    isCorrectPose={isCorrectPose}
                />
            </Card>

        </div>
        
      </div>
    </div>
  );
}