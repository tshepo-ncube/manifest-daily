import React, { useState, useEffect, useRef } from "react";
import {
  Plus,
  Target,
  Heart,
  TrendingUp,
  Play,
  Sun,
  Moon,
  CheckCircle,
  Lightbulb,
  Eye,
  Sparkles,
  LogOut,
  Menu,
  X,
  Mic,
  Pause,
  Send,
  Trash2,
} from "lucide-react";
import LandingPage from "./components/LandingPage";
import AuthForm from "./components/AuthForm";
import CelebrationModal from "./components/CelebrationModal";
import { db, analytics as rawAnalytics, logEvent } from "./lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  Timestamp,
  setDoc,
  doc,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import type { Analytics } from "firebase/analytics";
import {
  getStorage,
  ref as storageRef,
  uploadString,
  getDownloadURL,
} from "firebase/storage";
const analytics: Analytics | undefined = rawAnalytics;

interface Goal {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  endDate: string; // ISO date string
  active?: boolean;
}

interface DailyEntry {
  id: string;
  goalId: string;
  date: string;
  intention: string;
  visualizations: string[];
  gratitudes: string[];
  wins: string[];
  lesson: string;
  affirmations: string[];
  completed: {
    intention: boolean;
    visualization: boolean;
    gratitude: boolean;
    reflection: boolean;
    affirmations: boolean;
  };
  createdAt: string;
  completedAt?: string;
}

const DEFAULT_AFFIRMATIONS = [
  "I attract the right opportunities and people effortlessly.",
  "Every day, I move closer to achieving my dreams.",
  "I am confident, capable, and deserving of success.",
  "I trust the process and embrace each step of my journey.",
  "I am grateful for all the abundance flowing into my life.",
  "I have the power to create positive change in my life.",
  "I am becoming the person I've always wanted to be.",
  "Success comes naturally to me in all areas of my life.",
  "I am open to receiving all the blessings the universe has for me.",
  "I radiate positive energy and attract positive experiences.",
];

// Helper to save or update daily entry in Firestore
async function saveDailyEntryToFirestore(
  entry: DailyEntry,
  partial: boolean = false
) {
  const user = JSON.parse(localStorage.getItem("manifesting-user") || "{}");
  try {
    await setDoc(
      doc(db, "goalEntries", `${user.id}_${entry.goalId}_${entry.date}`),
      {
        userId: user.id,
        goalId: entry.goalId,
        date: entry.date,
        intention: entry.intention,
        visualizations: entry.visualizations,
        gratitudes: entry.gratitudes,
        wins: entry.wins,
        lesson: entry.lesson,
        affirmations: entry.affirmations,
        completed: entry.completed,
        createdAt: entry.createdAt
          ? entry.createdAt
          : Timestamp.fromDate(new Date()),
        ...(Object.values(entry.completed).every(Boolean) && !entry.completedAt
          ? { completedAt: Timestamp.fromDate(new Date()) }
          : entry.completedAt
          ? { completedAt: entry.completedAt }
          : {}),
      },
      { merge: partial }
    );
  } catch (e) {
    console.error("Error saving daily entry to Firestore", e);
  }
}

// Spinner component
const Spinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <svg
      className="animate-spin h-12 w-12 text-purple-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8z"
      ></path>
    </svg>
  </div>
);

// VoiceNote component (WhatsApp-style)
type RecordingState = "idle" | "recording" | "recorded" | "playing";
const VoiceNote: React.FC<{
  onSend: (audioBlob: Blob, duration: number) => void;
  onCancel?: () => void;
}> = ({ onSend, onCancel }) => {
  const [state, setState] = useState<RecordingState>("idle");
  const [duration, setDuration] = useState(0);
  const [playbackTime, setPlaybackTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioURL, setAudioURL] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [waveformBars, setWaveformBars] = useState<number[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | null>(null);
  const generateWaveform = () => {
    const bars = Array.from({ length: 20 }, () => Math.random() * 40 + 10);
    setWaveformBars(bars);
  };
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
        setAudioURL(URL.createObjectURL(blob));
        setState("recorded");
        stream.getTracks().forEach((track) => track.stop());
      };
      mediaRecorder.start();
      setState("recording");
      setDuration(0);
      timerRef.current = setInterval(() => {
        setDuration((prev) => {
          if (prev + 0.1 >= 30) {
            stopRecording();
            return 30;
          }
          return prev + 0.1;
        });
      }, 100);
      const animateWaveform = () => {
        generateWaveform();
        animationRef.current = requestAnimationFrame(animateWaveform);
      };
      animateWaveform();
    } catch (error) {
      alert("Error accessing microphone.");
    }
  };
  const stopRecording = () => {
    if (mediaRecorderRef.current && state === "recording") {
      mediaRecorderRef.current.stop();
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    }
  };
  const cancelRecording = () => {
    stopRecording();
    setState("idle");
    setDuration(0);
    setAudioBlob(null);
    setAudioURL("");
    onCancel?.();
  };
  const sendVoiceNote = () => {
    if (audioBlob) {
      onSend(audioBlob, duration);
      setState("idle");
      setDuration(0);
      setAudioBlob(null);
      setAudioURL("");
    }
  };
  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleTimeUpdate = () => setPlaybackTime(audio.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
      setPlaybackTime(0);
      audio.currentTime = 0;
    };
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioURL]);
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (audioURL) URL.revokeObjectURL(audioURL);
    };
  }, [audioURL]);
  const renderWaveform = () => (
    <div className="flex items-center justify-center space-x-1 h-8">
      {waveformBars.map((height, index) => (
        <div
          key={index}
          className="bg-green-500 w-1 rounded-full transition-all duration-100"
          style={{ height: `${height}%` }}
        />
      ))}
    </div>
  );
  const renderPlaybackWaveform = () => {
    const progress = audioRef.current
      ? playbackTime / audioRef.current.duration || 0
      : 0;
    return (
      <div className="flex items-center justify-center space-x-1 h-6">
        {Array.from({ length: 15 }, (_, index) => {
          const isActive = index < progress * 15;
          return (
            <div
              key={index}
              className={`w-1 rounded-full ${
                isActive ? "bg-green-500" : "bg-gray-300"
              }`}
              style={{ height: `${Math.random() * 20 + 10}px` }}
            />
          );
        })}
      </div>
    );
  };
  if (state === "idle") {
    return (
      <div className="flex items-center justify-center">
        <button
          onMouseDown={startRecording}
          onTouchStart={startRecording}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full transition-all duration-200 active:scale-95 shadow-lg"
        >
          <Mic size={24} />
        </button>
      </div>
    );
  }
  if (state === "recording") {
    return (
      <div className="flex items-center space-x-4 bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          <span className="text-red-500 font-medium">
            {formatTime(duration)}
          </span>
        </div>
        <div className="flex-1">{renderWaveform()}</div>
        <div className="flex space-x-2">
          <button
            onClick={cancelRecording}
            className="p-2 text-gray-500 hover:text-red-500 transition-colors"
          >
            <X size={20} />
          </button>
          <button
            onMouseUp={stopRecording}
            onTouchEnd={stopRecording}
            className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-all duration-200"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    );
  }
  if (state === "recorded") {
    return (
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center space-x-4">
          <button
            onClick={togglePlayback}
            className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full transition-all duration-200"
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>
          <div className="flex-1">{renderPlaybackWaveform()}</div>
          <span className="text-gray-600 text-sm font-medium">
            {formatTime(playbackTime)} / {formatTime(duration)}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={cancelRecording}
              className="p-2 text-gray-500 hover:text-red-500 transition-colors"
            >
              <Trash2 size={18} />
            </button>
            <button
              onClick={sendVoiceNote}
              className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-full transition-all duration-200"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
        {audioURL && <audio ref={audioRef} src={audioURL} className="hidden" />}
      </div>
    );
  }
  return null;
};

// Minimal ChatMessage-style playback bubble
const ChatMessage: React.FC<{
  audioBlob: Blob;
  duration: number;
  timestamp: Date;
}> = ({ audioBlob, duration, timestamp }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [audioURL, setAudioURL] = useState<string>("");
  useEffect(() => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [audioBlob]);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      audio.currentTime = 0;
    };
    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("ended", handleEnded);
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [audioURL]);
  const togglePlayback = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };
  // Animated waveform: 20 bars, animate (color) only during playback
  const totalBars = 20;
  const progress =
    audioRef.current && audioRef.current.duration
      ? currentTime / audioRef.current.duration
      : 0;
  return (
    <div className="flex justify-end mb-4">
      <div className="w-72 px-4 py-3 rounded-lg bg-gradient-to-br from-purple-500 via-blue-500 to-indigo-500 text-white shadow-lg">
        <div className="flex items-center space-x-3">
          <button
            onClick={togglePlayback}
            className="p-2 rounded-full bg-white hover:bg-indigo-100 text-purple-600 transition-colors"
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          {/* Waveform */}
          <div className="flex items-center space-x-0.5 flex-1">
            {Array.from({ length: totalBars }).map((_, idx) => {
              // Animate color if playing and bar is before progress
              const isActive = isPlaying && idx < progress * totalBars;
              return (
                <div
                  key={idx}
                  className={`w-1 rounded-full transition-colors duration-200 ${
                    isActive ? "bg-yellow-300" : "bg-indigo-200"
                  }`}
                  style={{ height: `${16 + (idx % 2 === 0 ? 8 : 0)}px` }}
                />
              );
            })}
          </div>
          <span className="text-xs font-mono text-white ml-2 min-w-[32px] text-right">
            {isPlaying ? formatTime(currentTime) : formatTime(duration)}
          </span>
        </div>
        <div className="text-xs mt-2 text-indigo-100 text-right">
          {timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
        {audioURL && <audio ref={audioRef} src={audioURL} className="hidden" />}
      </div>
    </div>
  );
};

function App() {
  const [currentView, setCurrentView] = useState<"landing" | "auth" | "app">(
    "landing"
  );
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("today");
  const [goals, setGoals] = useState<Goal[]>([]);
  const [dailyEntries, setDailyEntries] = useState<DailyEntry[]>([]);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    endDate: "",
  });
  const [selectedGoalId, setSelectedGoalId] = useState("");
  const [showCelebration, setShowCelebration] = useState(false);
  const [celebratedGoals, setCelebratedGoals] = useState<{
    [goalId: string]: string;
  }>(() => {
    const storedUser = localStorage.getItem("manifesting-user");
    const userId = storedUser ? JSON.parse(storedUser).id : undefined;
    if (userId) {
      const stored = localStorage.getItem(
        `manifesting-celebrated-goals-${userId}`
      );
      return stored ? JSON.parse(stored) : {};
    }
    return {};
  });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [editGoalData, setEditGoalData] = useState({
    title: "",
    description: "",
    endDate: "",
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<{
    goal: Goal | null;
  }>({ goal: null });
  const [selectedHistoryGoalId, setSelectedHistoryGoalId] =
    useState<string>("");
  const [expandedHistoryEntries, setExpandedHistoryEntries] = useState<
    Record<string, boolean>
  >({});
  const [loadingData, setLoadingData] = useState(false);
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  // Support form state
  const [supportTitle, setSupportTitle] = useState("");
  const [supportDescription, setSupportDescription] = useState("");
  const [supportImage, setSupportImage] = useState<string | null>(null);
  const [supportRating, setSupportRating] = useState<number>(0);
  const [supportSubmitting, setSupportSubmitting] = useState(false);
  const [supportSuccess, setSupportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Drag and drop handlers for image upload
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSupportImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleImageAreaClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const today = new Date().toDateString();
  const todayEntry = dailyEntries.find(
    (entry) => entry.date === today && entry.goalId === selectedGoalId
  );

  // Check authentication status
  useEffect(() => {
    // Check for stored user data
    const storedUser = localStorage.getItem("manifesting-user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setCurrentView("app");
      if (analytics) logEvent(analytics, "login", { method: "localStorage" });
    }
  }, []);

  // Load data from Firestore on user login
  useEffect(() => {
    async function fetchFirestoreData() {
      if (user) {
        setLoadingData(true);
        // Fetch goals
        const goalsQuery = query(
          collection(db, "goals"),
          where("userId", "==", user.id)
        );
        const goalsSnap = await getDocs(goalsQuery);
        const fetchedGoals = goalsSnap.docs.map((docSnap) => ({
          id: docSnap.id,
          ...docSnap.data(),
        })) as Goal[];
        const activeGoals = fetchedGoals.filter((g) => g.active !== false);
        setGoals(activeGoals);
        if (activeGoals.length > 0 && !selectedGoalId) {
          setSelectedGoalId(activeGoals[0].id);
        }
        // Fetch daily entries
        const entriesQuery = query(
          collection(db, "goalEntries"),
          where("userId", "==", user.id)
        );
        const entriesSnap = await getDocs(entriesQuery);
        const fetchedEntries = entriesSnap.docs.map((docSnap) => {
          const data = docSnap.data();
          // Defensive: ensure completed object is always present and correct
          const completed = {
            intention: data.completed?.intention || false,
            visualization: data.completed?.visualization || false,
            gratitude: data.completed?.gratitude || false,
            reflection: data.completed?.reflection || false,
            affirmations: data.completed?.affirmations || false,
          };
          return {
            id: docSnap.id,
            ...data,
            completed,
          };
        }) as DailyEntry[];
        setDailyEntries(fetchedEntries);
        setLoadingData(false);
      }
    }
    fetchFirestoreData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Save to localStorage whenever data changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(
        `manifesting-goals-${user.id}`,
        JSON.stringify(goals)
      );
    }
  }, [goals, user]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(
        `manifesting-entries-${user.id}`,
        JSON.stringify(dailyEntries)
      );
    }
  }, [dailyEntries, user]);

  // Check if all steps are completed
  useEffect(() => {
    if (
      todayEntry &&
      selectedGoalId &&
      Object.values(todayEntry.completed).every(Boolean) &&
      celebratedGoals[selectedGoalId] !== today
    ) {
      setShowCelebration(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todayEntry, selectedGoalId, celebratedGoals, today]);

  // On user change, load celebratedGoals from the correct key
  useEffect(() => {
    setGoals([]);
    setDailyEntries([]);
    setSelectedGoalId("");
    if (user && user.id) {
      const stored = localStorage.getItem(
        `manifesting-celebrated-goals-${user.id}`
      );
      setCelebratedGoals(stored ? JSON.parse(stored) : {});
    } else {
      setCelebratedGoals({});
    }
    if (user) setLoadingData(true);
  }, [user]);

  const handleSignOut = async () => {
    setSigningOut(true);
    if (analytics) logEvent(analytics, "logout");
    const userId = user?.id;
    localStorage.removeItem("manifesting-user");
    if (userId) {
      localStorage.removeItem(`manifesting-goals-${userId}`);
      localStorage.removeItem(`manifesting-entries-${userId}`);
      // Do not remove celebratedGoals for the current user on sign out
    }
    setGoals([]);
    setDailyEntries([]);
    setSelectedGoalId("");
    setCelebratedGoals({});
    setTimeout(() => {
      setCurrentView("landing");
      setUser(null);
      setSigningOut(false);
    }, 1000); // Give time for UI to update
  };

  const addGoal = async () => {
    if (newGoal.title.trim() && newGoal.description.trim() && newGoal.endDate) {
      const user = JSON.parse(localStorage.getItem("manifesting-user") || "{}");
      const goal: Goal = {
        id: Date.now().toString(),
        title: newGoal.title,
        description: newGoal.description,
        createdAt: new Date().toISOString(),
        endDate: newGoal.endDate,
        active: true,
      };
      setGoals([...goals, goal]);
      if (!selectedGoalId) setSelectedGoalId(goal.id);
      setNewGoal({ title: "", description: "", endDate: "" });
      if (analytics)
        logEvent(analytics, "create_goal", { goal_title: goal.title });
      // Add to Firestore
      try {
        await addDoc(collection(db, "goals"), {
          userId: user.id,
          title: goal.title,
          description: goal.description,
          createdAt: Timestamp.fromDate(new Date(goal.createdAt)),
          endDate: goal.endDate,
          active: true,
        });
      } catch (e) {
        // Optionally handle error
        console.error("Error adding goal to Firestore", e);
      }
    }
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setEditGoalData({
      title: goal.title,
      description: goal.description,
      endDate: goal.endDate,
    });
  };

  const saveEditGoal = async () => {
    if (!editingGoal) return;
    const updatedGoal = {
      ...editingGoal,
      ...editGoalData,
    };
    setGoals(goals.map((g) => (g.id === editingGoal.id ? updatedGoal : g)));
    setEditingGoal(null);
    if (analytics)
      logEvent(analytics, "edit_goal", { goal_id: editingGoal.id });
    // Update in Firestore
    try {
      await updateDoc(doc(db, "goals", editingGoal.id), {
        title: editGoalData.title,
        description: editGoalData.description,
        endDate: editGoalData.endDate,
      });
    } catch (e) {
      console.error("Error updating goal in Firestore", e);
    }
  };

  const handleDeleteGoal = async (goal: Goal) => {
    setShowDeleteConfirm({ goal });
  };

  const confirmDeleteGoal = async () => {
    const goal = showDeleteConfirm.goal;
    if (!goal) return;
    setGoals(
      goals.map((g) => (g.id === goal.id ? { ...g, active: false } : g))
    );
    if (analytics) logEvent(analytics, "delete_goal", { goal_id: goal.id });
    // Soft delete in Firestore
    try {
      await updateDoc(doc(db, "goals", goal.id), { active: false });
    } catch (e) {
      console.error("Error soft-deleting goal in Firestore", e);
    }
    // If the deleted goal is selected, select another
    if (selectedGoalId === goal.id) {
      const nextGoal = goals.find(
        (g) => g.id !== goal.id && g.active !== false
      );
      setSelectedGoalId(nextGoal ? nextGoal.id : "");
    }
    setShowDeleteConfirm({ goal: null });
  };

  const updateDailyEntry = (field: string, value: any) => {
    const existingEntry = dailyEntries.find(
      (entry) => entry.date === today && entry.goalId === selectedGoalId
    );

    if (existingEntry) {
      // Only update the relevant field and completed flag
      let updatedEntry = { ...existingEntry, [field]: value };
      if (field in existingEntry.completed) {
        updatedEntry.completed = {
          ...existingEntry.completed,
          [field]: Boolean(
            value &&
              (typeof value === "string"
                ? value.trim()
                : value.length
                ? value.some((v: any) => v)
                : value)
          ),
        };
      }
      const updatedEntries = dailyEntries.map((entry) =>
        entry.id === existingEntry.id ? updatedEntry : entry
      );
      setDailyEntries(updatedEntries);
      // Save step immediately (partial update)
      saveDailyEntryToFirestore(updatedEntry, true);
      if (analytics)
        logEvent(analytics, "update_daily_entry", {
          goal_id: selectedGoalId,
          field,
        });
      // If all steps completed, add completedAt and save
      if (Object.values(updatedEntry.completed).every(Boolean)) {
        const withCompletedAt = {
          ...updatedEntry,
          completedAt: new Date().toISOString(),
        };
        setDailyEntries(
          updatedEntries.map((entry) =>
            entry.id === existingEntry.id ? withCompletedAt : entry
          )
        );
        saveDailyEntryToFirestore(withCompletedAt);
        if (analytics)
          logEvent(analytics, "complete_daily_entry", {
            goal_id: selectedGoalId,
          });
      }
    } else {
      const user = JSON.parse(localStorage.getItem("manifesting-user") || "{}");
      // Only set completed for the field being filled
      const completed = {
        intention: false,
        visualization: false,
        gratitude: false,
        reflection: false,
        affirmations: false,
      };
      if (field in completed) {
        completed[field] = Boolean(
          value &&
            (typeof value === "string"
              ? value.trim()
              : value.length
              ? value.some((v: any) => v)
              : value)
        );
      }
      const newEntry: DailyEntry = {
        id: Date.now().toString(),
        goalId: selectedGoalId,
        date: today,
        intention: "",
        visualizations: ["", "", ""],
        gratitudes: ["", "", ""],
        wins: ["", "", ""],
        lesson: "",
        affirmations: DEFAULT_AFFIRMATIONS.slice(0, 3),
        completed,
        [field]: value,
        createdAt: new Date().toISOString(),
      };
      setDailyEntries([...dailyEntries, newEntry]);
      saveDailyEntryToFirestore(newEntry, true);
      if (analytics)
        logEvent(analytics, "create_daily_entry", {
          goal_id: selectedGoalId,
          field,
        });
      if (field === "completed" && Object.values(completed).every(Boolean)) {
        const withCompletedAt = {
          ...newEntry,
          completedAt: new Date().toISOString(),
        };
        setDailyEntries((prev) =>
          prev.map((entry) =>
            entry.id === newEntry.id ? withCompletedAt : entry
          )
        );
        saveDailyEntryToFirestore(withCompletedAt);
        if (analytics)
          logEvent(analytics, "complete_daily_entry", {
            goal_id: selectedGoalId,
          });
      }
    }
  };

  const toggleCompleted = (step: keyof DailyEntry["completed"]) => {
    const completed = { ...todayEntry?.completed } || {
      intention: false,
      visualization: false,
      gratitude: false,
      reflection: false,
      affirmations: false,
    };
    completed[step] = !completed[step];
    updateDailyEntry("completed", completed);
  };

  const speakAffirmations = () => {
    if ("speechSynthesis" in window && todayEntry?.affirmations) {
      const text = todayEntry.affirmations.join(". ");
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.7;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
      if (analytics)
        logEvent(analytics, "play_affirmations", { goal_id: selectedGoalId });
    }
  };

  const selectedGoal = goals.find((g) => g.id === selectedGoalId);

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSupportImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle support form submit
  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !supportTitle.trim() ||
      !supportDescription.trim() ||
      supportRating === 0
    )
      return;
    setSupportSubmitting(true);
    try {
      const user = JSON.parse(localStorage.getItem("manifesting-user") || "{}");
      let imageUrl = null;
      if (supportImage) {
        // Optionally upload to Firebase Storage in future, for now store as base64
        imageUrl = supportImage;
      }
      await addDoc(collection(db, "supportTickets"), {
        userId: user.id || null,
        email: user.email || null,
        title: supportTitle,
        description: supportDescription,
        rating: supportRating,
        image: imageUrl,
        createdAt: Timestamp.fromDate(new Date()),
      });
      setSupportSuccess(true);
      setSupportTitle("");
      setSupportDescription("");
      setSupportImage(null);
      setSupportRating(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      alert("Failed to submit ticket. Please try again.");
    } finally {
      setSupportSubmitting(false);
    }
  };

  // Step 6: Voice Note (local state only)
  const [todayVoiceNote, setTodayVoiceNote] = useState<Blob | null>(null);
  const [todayVoiceNoteUrl, setTodayVoiceNoteUrl] = useState<string | null>(
    null
  );
  const [todayVoiceNoteDuration, setTodayVoiceNoteDuration] =
    useState<number>(0);
  const [todayVoiceNoteRecording, setTodayVoiceNoteRecording] = useState(false);
  const [todayVoiceNoteTimer, setTodayVoiceNoteTimer] = useState(0);
  const [todayVoiceNoteComplete, setTodayVoiceNoteComplete] = useState(false);
  const [todayVoiceNoteMessage, setTodayVoiceNoteMessage] = useState("");
  const [todayVoiceNoteTimestamp, setTodayVoiceNoteTimestamp] =
    useState<Date | null>(null);

  const handleStartVoiceNote = async () => {
    setTodayVoiceNoteMessage("");
    setTodayVoiceNote(null);
    setTodayVoiceNoteUrl(null);
    setTodayVoiceNoteDuration(0);
    setTodayVoiceNoteComplete(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new window.MediaRecorder(stream);
      voiceNoteChunksRef.current = [];
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) voiceNoteChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(voiceNoteChunksRef.current, {
          type: "audio/webm",
        });
        setTodayVoiceNote(blob);
        setTodayVoiceNoteUrl(URL.createObjectURL(blob));
        setTodayVoiceNoteDuration(todayVoiceNoteTimer);
        setTodayVoiceNoteComplete(true);
        setTodayVoiceNoteMessage("Thanks for sharing your day! 🎤");
      };
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setTodayVoiceNoteRecording(true);
    } catch (err) {
      alert("Could not access microphone.");
    }
  };

  const handleStopVoiceNote = () => {
    if (mediaRecorderRef.current && todayVoiceNoteRecording) {
      mediaRecorderRef.current.stop();
      setTodayVoiceNoteRecording(false);
    }
  };

  const handleDeleteVoiceNote = () => {
    setTodayVoiceNote(null);
    setTodayVoiceNoteUrl(null);
    setTodayVoiceNoteDuration(0);
    setTodayVoiceNoteComplete(false);
    setTodayVoiceNoteMessage("");
  };

  if (currentView === "landing") {
    return <LandingPage onGetStarted={() => setCurrentView("auth")} />;
  }

  if (currentView === "auth") {
    return (
      <AuthForm
        onBack={() => setCurrentView("landing")}
        onAuthSuccess={() => {
          setCurrentView("app");
          window.location.reload(); // Hard refresh after login
        }}
      />
    );
  }

  if (signingOut) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
        <Spinner />
        <p className="mt-6 text-lg text-gray-700 font-semibold">
          Signing out...
        </p>
      </div>
    );
  }

  // Show spinner while loading data after login
  if (currentView === "app" && loadingData) {
    return <Spinner />;
  }

  const renderTodayView = () => (
    <div className="space-y-6 pb-20">
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Today's Manifestation Journey
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Follow your 5-step daily process for {selectedGoal?.title}
        </p>
      </div>

      {/* Goal Selection */}
      {goals.length > 1 && (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-purple-100">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Goal for Today
          </label>
          <select
            value={selectedGoalId}
            onChange={(e) => setSelectedGoalId(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
          >
            {goals.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.title}
              </option>
            ))}
          </select>
        </div>
      )}

      {selectedGoal &&
        (() => {
          const entry = todayEntry;
          if (isAllStepsCompletedForToday(entry)) {
            // All steps completed, show message
            const completedAt = entry?.completedAt
              ? new Date(entry.completedAt)
              : new Date();
            const nextAllowed = new Date(completedAt);
            nextAllowed.setDate(nextAllowed.getDate() + 1);
            nextAllowed.setHours(8, 0, 0, 0);
            return (
              <div className="bg-white rounded-xl shadow-lg p-8 border border-green-200 text-center mt-8">
                <h3 className="text-2xl font-bold text-green-700 mb-4">
                  All steps completed for today!
                </h3>
                <p className="text-lg text-gray-700 mb-2">
                  You can complete all steps for this goal again tomorrow at
                  8am.
                </p>
                <p className="text-sm text-gray-500">
                  Come back after {nextAllowed.toLocaleString()} to continue
                  your journey.
                </p>
              </div>
            );
          }
          // Otherwise, show the cards as before
          return (
            <>
              {/* Step 1: Set Clear Intention */}
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-orange-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Sun
                      size={20}
                      className="text-orange-600 mr-2 sm:mr-3 flex-shrink-0"
                    />
                    <h3 className="text-lg sm:text-xl font-semibold text-orange-800">
                      1. Set Clear Intention (Morning)
                    </h3>
                  </div>
                  <button
                    onClick={() => toggleCompleted("intention")}
                    className={`p-2 rounded-full transition-colors flex-shrink-0 ${
                      entry?.completed.intention
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600"
                    }`}
                    disabled={entry?.completed.intention}
                  >
                    <CheckCircle size={18} />
                  </button>
                </div>
                <p className="text-gray-600 mb-4 text-sm sm:text-base">
                  Write 1-2 sentences describing your goal as if it's already
                  happening:
                </p>
                <textarea
                  placeholder={`"I am leading a thriving ${selectedGoal.title.toLowerCase()}, achieving all my objectives with confidence and success."`}
                  value={entry?.intention || ""}
                  onChange={(e) =>
                    updateDailyEntry("intention", e.target.value)
                  }
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm sm:text-base resize-none"
                  disabled={entry?.completed.intention}
                />
              </div>
              {/* Step 2: Visualize the Day Ahead */}
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-blue-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Eye
                      size={20}
                      className="text-blue-600 mr-2 sm:mr-3 flex-shrink-0"
                    />
                    <h3 className="text-lg sm:text-xl font-semibold text-blue-800">
                      2. Visualize the Day Ahead (Morning)
                    </h3>
                  </div>
                  <button
                    onClick={() => toggleCompleted("visualization")}
                    className={`p-2 rounded-full transition-colors flex-shrink-0 ${
                      entry?.completed.visualization
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600"
                    }`}
                    disabled={entry?.completed.visualization}
                  >
                    <CheckCircle size={18} />
                  </button>
                </div>
                <p className="text-gray-600 mb-4 text-sm sm:text-base">
                  List 3 key actions for today and visualize yourself doing
                  them.
                </p>
                <div className="space-y-3">
                  {(entry?.visualizations || ["", "", ""]).map((viz, index) => (
                    <input
                      key={index}
                      type="text"
                      placeholder={`Action ${
                        index + 1
                      }: e.g., "Draft project proposal"`}
                      value={viz}
                      onChange={(e) => {
                        const newViz = [
                          ...(entry?.visualizations || ["", "", ""]),
                        ];
                        newViz[index] = e.target.value;
                        updateDailyEntry("visualizations", newViz);
                      }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                      disabled={entry?.completed.visualization}
                    />
                  ))}
                </div>
              </div>
              {/* Step 3: Express Gratitude */}
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-green-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Heart
                      size={20}
                      className="text-green-600 mr-2 sm:mr-3 flex-shrink-0"
                    />
                    <h3 className="text-lg sm:text-xl font-semibold text-green-800">
                      3. Express Gratitude (Morning/Evening)
                    </h3>
                  </div>
                  <button
                    onClick={() => toggleCompleted("gratitude")}
                    className={`p-2 rounded-full transition-colors flex-shrink-0 ${
                      entry?.completed.gratitude
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600"
                    }`}
                    disabled={entry?.completed.gratitude}
                  >
                    <CheckCircle size={18} />
                  </button>
                </div>
                <p className="text-gray-600 mb-4 text-sm sm:text-base">
                  Write 3 things you're grateful for related to your journey
                </p>
                <div className="space-y-3">
                  {(entry?.gratitudes || ["", "", ""]).map(
                    (gratitude, index) => (
                      <input
                        key={index}
                        type="text"
                        placeholder={`Gratitude ${
                          index + 1
                        }: e.g., "Grateful for the progress I made yesterday"`}
                        value={gratitude}
                        onChange={(e) => {
                          const newGratitudes = [
                            ...(entry?.gratitudes || ["", "", ""]),
                          ];
                          newGratitudes[index] = e.target.value;
                          updateDailyEntry("gratitudes", newGratitudes);
                        }}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm sm:text-base"
                        disabled={entry?.completed.gratitude}
                      />
                    )
                  )}
                </div>
              </div>
              {/* Step 4: Reflect on Wins & Lessons */}
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-purple-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Moon
                      size={20}
                      className="text-purple-600 mr-2 sm:mr-3 flex-shrink-0"
                    />
                    <h3 className="text-lg sm:text-xl font-semibold text-purple-800">
                      4. Reflect on Wins & Lessons (Evening)
                    </h3>
                  </div>
                  <button
                    onClick={() => toggleCompleted("reflection")}
                    className={`p-2 rounded-full transition-colors flex-shrink-0 ${
                      entry?.completed.reflection
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600"
                    }`}
                    disabled={entry?.completed.reflection}
                  >
                    <CheckCircle size={18} />
                  </button>
                </div>
                <p className="text-gray-600 mb-4 text-sm sm:text-base">
                  Write 3 wins from your day
                </p>
                <div className="space-y-3 mb-6">
                  {(entry?.wins || ["", "", ""]).map((win, index) => (
                    <input
                      key={index}
                      type="text"
                      placeholder={`Win ${
                        index + 1
                      }: e.g., "Completed important presentation"`}
                      value={win}
                      onChange={(e) => {
                        const newWins = [...(entry?.wins || ["", "", ""])];
                        newWins[index] = e.target.value;
                        updateDailyEntry("wins", newWins);
                      }}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                      disabled={entry?.completed.reflection}
                    />
                  ))}
                </div>
                <p className="text-gray-600 mb-2 text-sm sm:text-base">
                  Write 1 challenge/lesson learned:
                </p>
                <textarea
                  placeholder="Lesson: e.g., 'Need to improve time management for better productivity'"
                  value={entry?.lesson || ""}
                  onChange={(e) => updateDailyEntry("lesson", e.target.value)}
                  rows={2}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base resize-none"
                  disabled={entry?.completed.reflection}
                />
              </div>
              {/* Step 5: Affirmations */}
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-indigo-100">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <Sparkles
                      size={20}
                      className="text-indigo-600 mr-2 sm:mr-3 flex-shrink-0"
                    />
                    <h3 className="text-lg sm:text-xl font-semibold text-indigo-800">
                      5. Affirmations (Morning/Evening)
                    </h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={speakAffirmations}
                      className="p-2 bg-indigo-100 hover:bg-indigo-200 rounded-full transition-colors"
                      disabled={entry?.completed.affirmations}
                    >
                      <Play size={18} className="text-indigo-600" />
                    </button>
                    <button
                      onClick={() => toggleCompleted("affirmations")}
                      className={`p-2 rounded-full transition-colors ${
                        entry?.completed.affirmations
                          ? "bg-green-100 text-green-600"
                          : "bg-gray-100 text-gray-400 hover:bg-green-100 hover:text-green-600"
                      }`}
                      disabled={entry?.completed.affirmations}
                    >
                      <CheckCircle size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 mb-4 text-sm sm:text-base">
                  Calmly say these to yourself at least 5 times today
                </p>
                <div className="space-y-3">
                  {(
                    entry?.affirmations || DEFAULT_AFFIRMATIONS.slice(0, 3)
                  ).map((affirmation, index) => (
                    <textarea
                      key={index}
                      value={affirmation}
                      onChange={(e) => {
                        const newAffirmations = [
                          ...(entry?.affirmations ||
                            DEFAULT_AFFIRMATIONS.slice(0, 3)),
                        ];
                        newAffirmations[index] = e.target.value;
                        updateDailyEntry("affirmations", newAffirmations);
                        if (analytics)
                          logEvent(analytics, "edit_affirmations", {
                            goal_id: selectedGoalId,
                          });
                      }}
                      rows={2}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm sm:text-base resize-none"
                      // disabled={entry?.completed.affirmations}
                      disabled={true}
                    />
                  ))}
                </div>
              </div>
              {/* Step 6: Voice Note */}
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-indigo-100 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 18.75v1.5m0 0h3.375m-3.375 0H8.625M12 3v9.75m0 0a3 3 0 01-3 3m3-3a3 3 0 003 3"
                        />
                      </svg>
                    </span>
                    <h3 className="text-lg sm:text-xl font-semibold text-indigo-800">
                      6. Reflect on your day
                    </h3>
                  </div>
                </div>
                {!todayVoiceNote && (
                  <VoiceNote
                    onSend={(blob, duration) => {
                      setTodayVoiceNote(blob);
                      setTodayVoiceNoteDuration(duration);
                      setTodayVoiceNoteMessage(
                        "Thanks for sharing your day! 🎤"
                      );
                      setTodayVoiceNoteTimestamp(new Date());
                    }}
                  />
                )}
                {todayVoiceNote && (
                  <div className="flex flex-col items-center">
                    <ChatMessage
                      audioBlob={todayVoiceNote}
                      duration={todayVoiceNoteDuration}
                      timestamp={todayVoiceNoteTimestamp || new Date()}
                    />
                    <div className="mt-2">
                      <div className="bg-indigo-100 text-indigo-800 rounded-2xl px-4 py-2 max-w-xs shadow text-sm text-center">
                        {todayVoiceNoteMessage}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          );
        })()}

      {goals.length === 0 && (
        <div className="text-center py-12">
          <Target size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No Goals Yet
          </h3>
          <p className="text-gray-500 mb-6">
            Start by creating your first goal to begin your manifestation
            journey.
          </p>
          <button
            onClick={() => setActiveTab("goals")}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            Create Your First Goal
          </button>
        </div>
      )}
    </div>
  );

  const renderGoals = () => (
    <div className="space-y-6 pb-20">
      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
          Your Goals
        </h2>
        <p className="text-gray-600 text-sm sm:text-base">
          Define your aspirations and manifest your dreams
        </p>
      </div>
      {/* Show add goal form directly if user has 0 goals */}
      {goals.length === 0 && (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-purple-100">
          <h3 className="text-lg sm:text-xl font-semibold text-purple-800 mb-4">
            Add Your First Goal
          </h3>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Goal title (e.g., 'Launch Successful SaaS Business')"
              value={newGoal.title}
              onChange={(e) =>
                setNewGoal({ ...newGoal, title: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
            />
            <textarea
              placeholder="Describe your goal in detail... What does success look like?"
              value={newGoal.description}
              onChange={(e) =>
                setNewGoal({ ...newGoal, description: e.target.value })
              }
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base resize-none"
            />
            <input
              type="date"
              value={newGoal.endDate}
              onChange={(e) =>
                setNewGoal({ ...newGoal, endDate: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
              min={new Date().toISOString().split("T")[0]}
            />
            <button
              onClick={addGoal}
              className="flex items-center bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base"
            >
              <Plus size={18} className="mr-2" />
              Add Goal
            </button>
          </div>
        </div>
      )}
      {/* Add New Goal Modal for users with more than 1 goal */}
      {showAddGoalModal && goals.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md relative">
            <button
              onClick={() => setShowAddGoalModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Add New Goal
            </h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Goal title (e.g., 'Launch Successful SaaS Business')"
                value={newGoal.title}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, title: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
              />
              <textarea
                placeholder="Describe your goal in detail... What does success look like?"
                value={newGoal.description}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, description: e.target.value })
                }
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base resize-none"
              />
              <input
                type="date"
                value={newGoal.endDate}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, endDate: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm sm:text-base"
                min={new Date().toISOString().split("T")[0]}
              />
              <button
                onClick={async () => {
                  await addGoal();
                  setShowAddGoalModal(false);
                }}
                className="flex items-center bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base"
              >
                <Plus size={18} className="mr-2" />
                Add Goal
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Goals List */}
      <div className="grid gap-6">
        {goals
          .filter((g) => g.active !== false)
          .map((goal) => (
            <div
              key={goal.id}
              className="bg-white rounded-xl shadow-lg p-4 sm:p-6 border border-gray-100 relative"
            >
              <div className="absolute top-4 right-4 flex gap-2">
                <button
                  onClick={() => handleEditGoal(goal)}
                  className="p-2 rounded-full bg-blue-100 hover:bg-blue-200 text-blue-700"
                  title="Edit Goal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a4 4 0 01-2.828 1.172H7v-2a4 4 0 011.172-2.828z"
                    />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteGoal(goal)}
                  className="p-2 rounded-full bg-red-100 hover:bg-red-200 text-red-700"
                  title="Delete Goal"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                {goal.title}
              </h3>
              <p className="text-gray-600 mb-4 text-sm sm:text-base">
                {goal.description}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                Created: {new Date(goal.createdAt).toLocaleDateString()}
              </p>
              <p className="text-xs sm:text-sm text-gray-500">
                End Date:{" "}
                {goal.endDate
                  ? new Date(goal.endDate).toLocaleDateString()
                  : "-"}
              </p>
            </div>
          ))}
      </div>
      {/* FAB for adding new goal, only if user has at least 1 goal */}
      {goals.length >= 1 && (
        <button
          onClick={() => setShowAddGoalModal(true)}
          className="fixed bottom-16 right-12 z-50 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl focus:outline-none focus:ring-4 focus:ring-purple-300"
          title="Add New Goal"
        >
          <Plus size={32} />
        </button>
      )}
      {editingGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md relative">
            <button
              onClick={() => setEditingGoal(null)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h3 className="text-xl font-bold mb-4 text-gray-800">Edit Goal</h3>
            <div className="space-y-4">
              <input
                type="text"
                value={editGoalData.title}
                onChange={(e) =>
                  setEditGoalData({ ...editGoalData, title: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              />
              <textarea
                value={editGoalData.description}
                onChange={(e) =>
                  setEditGoalData({
                    ...editGoalData,
                    description: e.target.value,
                  })
                }
                rows={3}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base resize-none"
              />
              <input
                type="date"
                value={editGoalData.endDate}
                onChange={(e) =>
                  setEditGoalData({ ...editGoalData, endDate: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base"
              />
              <button
                onClick={saveEditGoal}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      {showDeleteConfirm.goal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl p-8 shadow-2xl w-full max-w-md relative">
            <button
              onClick={() => setShowDeleteConfirm({ goal: null })}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              Delete Goal?
            </h3>
            <p className="mb-6 text-gray-700">
              Are you sure you want to delete the goal{" "}
              <span className="font-semibold">
                "{showDeleteConfirm.goal.title}"
              </span>
              ?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeleteConfirm({ goal: null })}
                className="flex-1 py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteGoal}
                className="flex-1 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderHistory = () => {
    // Group entries by goalId
    const entriesByGoal: Record<string, DailyEntry[]> = {};
    dailyEntries.forEach((entry) => {
      if (!entriesByGoal[entry.goalId]) entriesByGoal[entry.goalId] = [];
      entriesByGoal[entry.goalId].push(entry);
    });

    // For each goal, sort entries by date (most recent first)
    Object.keys(entriesByGoal).forEach((goalId) => {
      entriesByGoal[goalId].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    });

    // Only show active goals
    const activeGoals = goals.filter((g) => g.active !== false);
    // Default to first goal if none selected
    const selectedGoalId = selectedHistoryGoalId || activeGoals[0]?.id || "";
    const selectedGoal = activeGoals.find((g) => g.id === selectedGoalId);
    const entries = selectedGoal ? entriesByGoal[selectedGoal.id] || [] : [];

    return (
      <div>
        {/* Goal Selector Dropdown */}
        <div className="mb-8 flex items-center gap-4">
          <label
            htmlFor="history-goal-select"
            className="text-lg font-semibold text-purple-800"
          >
            Select Goal:
          </label>
          <select
            id="history-goal-select"
            value={selectedGoalId}
            onChange={(e) => setSelectedHistoryGoalId(e.target.value)}
            className="p-3 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
          >
            {activeGoals.map((goal) => (
              <option key={goal.id} value={goal.id}>
                {goal.title}
              </option>
            ))}
          </select>
        </div>
        {/* Timeline for selected goal */}
        {selectedGoal && entries.length > 0 ? (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-purple-800 mb-6 flex items-center gap-2">
              <Target className="w-7 h-7 text-indigo-400 animate-bounce" />
              {selectedGoal.title}{" "}
              <span className="text-base font-normal text-gray-500">
                Timeline
              </span>
              {selectedGoal.endDate && (
                <span className="ml-4 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-semibold border border-indigo-200">
                  {getTimeRemaining(selectedGoal.endDate)}
                </span>
              )}
            </h2>
            <div className="relative pl-8 before:absolute before:top-0 before:left-4 before:bottom-0 before:w-1 before:bg-gradient-to-b before:from-purple-300 before:to-indigo-300">
              {entries.map((entry, idx) => {
                const isExpanded = expandedHistoryEntries[entry.id] || false;
                return (
                  <div
                    key={entry.id}
                    className="relative mb-12 animate-fade-in-up"
                    style={{ animationDelay: `${idx * 0.1}s` }}
                  >
                    {/* Timeline Dot */}
                    <div className="absolute left-0 top-2 w-8 h-8 flex items-center justify-center">
                      <div className="w-5 h-5 bg-gradient-to-br from-purple-400 to-indigo-400 rounded-full border-4 border-white shadow-lg animate-pulse" />
                    </div>
                    {/* Card */}
                    <div className="ml-8 bg-white rounded-xl shadow-lg p-6 border border-purple-100 hover:shadow-2xl transition-shadow duration-300">
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() =>
                          setExpandedHistoryEntries((prev) => ({
                            ...prev,
                            [entry.id]: !isExpanded,
                          }))
                        }
                      >
                        <h3 className="text-lg font-bold text-purple-700 mb-0">
                          {new Date(entry.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </h3>
                        <button
                          className="ml-2 p-1 rounded-full hover:bg-purple-50 transition-colors"
                          aria-label={
                            isExpanded ? "Collapse details" : "Expand details"
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedHistoryEntries((prev) => ({
                              ...prev,
                              [entry.id]: !isExpanded,
                            }));
                          }}
                        >
                          <svg
                            className={`w-5 h-5 text-purple-500 transition-transform duration-200 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </button>
                      </div>
                      {/* Details: show only if expanded */}
                      <div
                        className={`transition-all duration-300 overflow-hidden ${
                          isExpanded
                            ? "max-h-[500px] mt-4 opacity-100"
                            : "max-h-0 opacity-0"
                        }`}
                        style={{ pointerEvents: isExpanded ? "auto" : "none" }}
                      >
                        <ul className="space-y-2">
                          {entry.intention && (
                            <li className="flex items-center gap-2">
                              <Sun className="w-4 h-4 text-orange-400 animate-pulse" />
                              <span className="font-medium text-orange-700">
                                Intention:
                              </span>
                              <span>{entry.intention}</span>
                            </li>
                          )}
                          {entry.visualizations.some((v) => v) && (
                            <li className="flex items-center gap-2">
                              <Eye className="w-4 h-4 text-blue-400 animate-spin" />
                              <span className="font-medium text-blue-700">
                                Actions:
                              </span>
                              <span>
                                {entry.visualizations
                                  .filter(Boolean)
                                  .join(", ")}
                              </span>
                            </li>
                          )}
                          {entry.gratitudes.some((g) => g) && (
                            <li className="flex items-center gap-2">
                              <Heart className="w-4 h-4 text-green-400 animate-bounce" />
                              <span className="font-medium text-green-700">
                                Gratitudes:
                              </span>
                              <span>
                                {entry.gratitudes.filter(Boolean).join(", ")}
                              </span>
                            </li>
                          )}
                          {entry.wins.some((w) => w) && (
                            <li className="flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-purple-400 animate-pulse" />
                              <span className="font-medium text-purple-700">
                                Wins:
                              </span>
                              <span>
                                {entry.wins.filter(Boolean).join(", ")}
                              </span>
                            </li>
                          )}
                          {entry.lesson && (
                            <li className="flex items-center gap-2">
                              <Lightbulb className="w-4 h-4 text-yellow-400 animate-bounce" />
                              <span className="font-medium text-yellow-700">
                                Lesson:
                              </span>
                              <span>{entry.lesson}</span>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Lightbulb size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No History Yet
            </h3>
            <p className="text-gray-500">
              Start completing your daily manifestation steps to build your
              journey history.
            </p>
          </div>
        )}
      </div>
    );
  };

  // Support view
  const renderSupport = () => (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <h2 className="text-2xl font-bold mb-4 text-purple-700">
        Support, Feedback & Feature Request
      </h2>
      <p className="text-gray-600 mb-4">
        Submit a ticket, rate the app, or upload a screenshot/image.
      </p>
      {supportSuccess ? (
        <div className="bg-green-100 border border-green-300 text-green-800 rounded-lg px-6 py-4 mb-6 text-center">
          Thank you for your feedback! Your ticket has been submitted. 💜
          <button
            className="block mt-4 text-purple-700 underline"
            onClick={() => setSupportSuccess(false)}
          >
            Submit another
          </button>
        </div>
      ) : (
        <form
          className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 border border-purple-100 flex flex-col gap-4"
          onSubmit={handleSupportSubmit}
        >
          <div>
            <label className="block text-sm font-medium text-purple-800 mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base"
              value={supportTitle}
              onChange={(e) => setSupportTitle(e.target.value)}
              required
              maxLength={80}
              placeholder="Short summary (e.g., 'Bug in Progress tab')"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-800 mb-1">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-base resize-none"
              value={supportDescription}
              onChange={(e) => setSupportDescription(e.target.value)}
              required
              rows={4}
              placeholder="Describe your issue, feedback, or suggestion in detail..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-800 mb-1">
              Screenshot/Image (optional)
            </label>
            <div
              className="w-full flex flex-col items-center justify-center border-2 border-dashed border-purple-300 rounded-lg p-4 cursor-pointer hover:border-purple-500 transition-colors bg-purple-50/30 text-purple-700 text-center"
              onClick={handleImageAreaClick}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              tabIndex={0}
              role="button"
              aria-label="Upload image by clicking or dragging"
            >
              {supportImage ? (
                <img
                  src={supportImage}
                  alt="Preview"
                  className="max-h-32 rounded-lg border border-gray-200 mb-2"
                />
              ) : (
                <>
                  <span className="text-3xl mb-2">🖼️</span>
                  <p className="text-sm">
                    Drag & drop an image here, or{" "}
                    <span className="underline">click to select</span>
                  </p>
                </>
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                tabIndex={-1}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-purple-800 mb-1">
              Rate the us <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2 text-2xl">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  className={star <= supportRating ? "" : "opacity-40"}
                  onClick={() => setSupportRating(star)}
                  aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                >
                  {star <= supportRating ? "⭐" : "☆"}
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-60"
            disabled={
              supportSubmitting ||
              !supportTitle.trim() ||
              !supportDescription.trim() ||
              supportRating === 0
            }
          >
            {supportSubmitting ? "Submitting..." : "Submit Ticket"}
          </button>
        </form>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-lg border-b border-purple-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              Manifest Daily
            </h1>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <span className="hidden sm:inline text-sm text-gray-600">
                {user?.email}
              </span>
              <button
                onClick={handleSignOut}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors p-2"
              >
                <LogOut size={18} className="sm:mr-2" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="sm:hidden p-2 text-gray-600 hover:text-gray-800"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white shadow-lg border-b border-gray-200 sticky top-16 z-30">
          <div className="px-4 py-2">
            {[
              { id: "today", label: "Today's Practice", icon: Sun },
              { id: "goals", label: "Goals", icon: Target },
              { id: "progress", label: "Progress", icon: TrendingUp },
              { id: "support", label: "Support", icon: Heart },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id);
                  setMobileMenuOpen(false);
                  if (analytics) logEvent(analytics, "switch_tab", { tab: id });
                }}
                className={`flex items-center w-full py-3 px-2 font-medium text-sm transition-colors ${
                  activeTab === id
                    ? "text-purple-600 bg-purple-50"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon size={18} className="mr-3" />
                {label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Desktop Navigation */}
      <nav className="hidden sm:block bg-white shadow-md border-b border-gray-200 sticky top-16 z-30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8">
            {[
              { id: "today", label: "Today's Practice", icon: Sun },
              { id: "goals", label: "Goals", icon: Target },
              { id: "progress", label: "Progress", icon: TrendingUp },
              { id: "support", label: "Support", icon: Heart },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => {
                  setActiveTab(id);
                  if (analytics) logEvent(analytics, "switch_tab", { tab: id });
                }}
                className={`flex items-center py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === id
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <Icon size={20} className="mr-2" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        {activeTab === "today" && renderTodayView()}
        {activeTab === "goals" && renderGoals()}
        {activeTab === "progress" && renderHistory()}
        {activeTab === "support" && renderSupport()}
      </main>

      {/* Celebration Modal */}
      <CelebrationModal
        isOpen={showCelebration}
        onClose={() => {
          setShowCelebration(false);
          if (selectedGoalId && user && user.id) {
            setCelebratedGoals((prev) => {
              const updated = { ...prev, [selectedGoalId]: today };
              localStorage.setItem(
                `manifesting-celebrated-goals-${user.id}`,
                JSON.stringify(updated)
              );
              if (analytics)
                logEvent(analytics, "complete_all_steps", {
                  goal_id: selectedGoalId,
                });
              return updated;
            });
          }
        }}
        goalTitle={selectedGoal?.title || ""}
      />
    </div>
  );
}

// Helper to get days/months remaining
function getTimeRemaining(endDate: string) {
  const now = new Date();
  const end = new Date(endDate);
  const diff = end.getTime() - now.getTime();
  if (diff < 0) return "Past due";
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days < 31) return `${days} day${days === 1 ? "" : "s"} left`;
  const months = Math.floor(days / 30);
  return `${months} month${months === 1 ? "" : "s"} left`;
}

// Helper to check if all steps are completed for today and if next entry is allowed
function isAllStepsCompletedForToday(entry: DailyEntry | undefined) {
  if (!entry || !Object.values(entry.completed).every(Boolean)) return false;
  if (!entry.completedAt) return true;
  const completedAt = new Date(entry.completedAt);
  const now = new Date();
  // Next entry allowed after 8am the next day
  const nextAllowed = new Date(completedAt);
  nextAllowed.setDate(nextAllowed.getDate() + 1);
  nextAllowed.setHours(8, 0, 0, 0);
  return now < nextAllowed;
}

export default App;
