import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth, useUser, SignOutButton } from "@clerk/clerk-react";
import {
  FileText,
  User,
  Plus,
  Edit3,
  Save,
  CheckCircle,
  ArrowLeft,
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Define a type for your user data
type UserData = {
  [key: string]: string | number;
  email: string;
  universityPRN: string;
  firstName: string;
  middleName: string;
  lastName: string;
  fullName: string;
  mobileNumber: string;
  dob: string;
  gender: string;
  degree: string;
  specialization: string;
  collegeName: string;
  tenthPercent: string;
  twelfthPercent: string;
  diplomaPercent: string;
  BEPercent: string;
  cgpa: string;
  graduationYear: string;
  technicalAchievements: string;
  personalAchievements: string;
  codechefRating: number;
  codechefLink: string;
  hackerrankRating: number;
  hackerrankLink: string;
  leetcodeLink: string;
  leetcodeproblemcount: string;
  cocubeScore: string;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"profile" | "fill">("profile");
  const [isEditing, setIsEditing] = useState(false);
  const { getToken } = useAuth();
  const [formUrl, setFormUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize with all fields set to empty strings
  const initialUserData: UserData = {
    email: "",
    universityPRN: "",
    firstName: "",
    middleName: "",
    lastName: "",
    fullName: "",
    mobileNumber: "",
    dob: "",
    gender: "",
    degree: "",
    specialization: "",
    collegeName: "",
    tenthPercent: "",
    twelfthPercent: "",
    diplomaPercent: "",
    BEPercent: "",
    cgpa:"",
    graduationYear: "",
    technicalAchievements: "",
    personalAchievements: "",
    codechefRating: 0,
    codechefLink: "",
    hackerrankRating: 0,
    hackerrankLink: "",
    leetcodeproblemcount: "",
    leetcodeLink: "",
    cocubeScore: "",
  };

  const [userData, setUserData] = useState<UserData>(initialUserData);
  const { user } = useUser();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = await getToken();
      try {
        const res = await axios.get("http://127.0.0.1:8000/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Merge the response data with initial values to ensure all fields exist
        setUserData({
          ...initialUserData,
          ...res.data,
        });
      } catch (err) {
        console.warn("No existing profile found.");
      }
    };
    fetchProfile();
  }, [getToken]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    const token = await getToken();
    setIsEditing(false);
    try {
      await axios.post("http://127.0.0.1:8000/profile", userData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Profile saved successfully");
    } catch (err) {
      console.error("Profile save failed", err);
      toast.error("Failed to save profile");
    }
  };

  const handleUpload = async () => {
    if (!formUrl.trim()) {
      toast.warn("⚠️ Form URL is required");
      return;
    }

    const token = await getToken();
    const formData = new FormData();
    formData.append("form_url", formUrl);
    formData.append(
      "json_file",
      new Blob([JSON.stringify(userData)], { type: "application/json" }),
      "data.json"
    );

    try {
      setIsProcessing(true);

      await axios.post("http://127.0.0.1:8000/submit/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("✅ Upload successful");
    } catch (err) {
      console.error("Upload error", err);
      toast.error("❌ Upload failed");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800/50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <SignOutButton>
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Sign Out
                </button>
              </SignOutButton>
              <div className="h-6 w-px bg-gray-800"></div>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-black" />
                </div>
                <span className="text-xl font-semibold tracking-tight">
                  Dashboard
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-white">
                  {user?.fullName}
                </div>
              </div>
              <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    activeTab === "profile"
                      ? "bg-white text-black"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <User className="w-5 h-5" />
                  <span className="font-medium">Profile</span>
                </button>

                <button
                  onClick={() => setActiveTab("fill")}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-all duration-200 ${
                    activeTab === "fill"
                      ? "bg-white text-black"
                      : "text-gray-400 hover:text-white hover:bg-gray-800"
                  }`}
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-medium">Fill Form</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === "profile" && (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-2xl font-bold text-white">
                    Personal Profile
                  </h2>
                  <button
                    onClick={() =>
                      isEditing ? handleSaveProfile() : setIsEditing(true)
                    }
                    className="flex items-center space-x-2 bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-medium"
                  >
                    {isEditing ? (
                      <Save className="w-4 h-4" />
                    ) : (
                      <Edit3 className="w-4 h-4" />
                    )}
                    <span>{isEditing ? "Save Changes" : "Edit Profile"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Personal Information */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                      Personal Information
                    </h3>

                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-300 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={userData.firstName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white disabled:opacity-50"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-300 mb-1">
                        Middle Name
                      </label>
                      <input
                        type="text"
                        name="middleName"
                        value={userData.middleName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white disabled:opacity-50"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-300 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={userData.lastName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white disabled:opacity-50"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-300 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={userData.fullName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white disabled:opacity-50"
                        placeholder="John Doe"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={userData.email}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white disabled:opacity-50"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-300 mb-1">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        name="mobileNumber"
                        value={userData.mobileNumber}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white disabled:opacity-50"
                        placeholder="9876543210"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-300 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="dob"
                        value={userData.dob}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white disabled:opacity-50"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-300 mb-1">
                        Gender
                      </label>
                      <div className="flex items-center space-x-4 mt-1">
                        {["Male", "Female"].map((option) => (
                          <label
                            key={option}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <div
                              className={`flex items-center justify-center w-5 h-5 rounded-full border ${
                                userData.gender === option
                                  ? "border-indigo-400"
                                  : "border-gray-500"
                              } ${!isEditing ? "opacity-50" : ""}`}
                            >
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  userData.gender === option
                                    ? "bg-indigo-400"
                                    : "bg-transparent"
                                }`}
                              ></div>
                            </div>
                            <span
                              className={`text-gray-300 ${
                                !isEditing ? "opacity-50" : ""
                              }`}
                            >
                              {option}
                            </span>
                            <input
                              type="radio"
                              name="gender"
                              value={option}
                              checked={userData.gender === option}
                              onChange={handleChange}
                              disabled={!isEditing}
                              className="sr-only" // Hide default radio but keep accessible
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                      Academic Information
                    </h3>

                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-300 mb-1">
                        University PRN
                      </label>
                      <input
                        type="text"
                        name="universityPRN"
                        value={userData.universityPRN}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white disabled:opacity-50"
                        placeholder="123456789"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-300 mb-1">
                        Degree
                      </label>
                      <div className="flex items-center space-x-4 mt-1">
                        {["BTech", "BE"].map((option) => (
                          <label
                            key={option}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <div
                              className={`flex items-center justify-center w-5 h-5 rounded-full border ${
                                userData.degree === option
                                  ? "border-indigo-400"
                                  : "border-gray-500"
                              } ${!isEditing ? "opacity-50" : ""}`}
                            >
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  userData.degree === option
                                    ? "bg-indigo-400"
                                    : "bg-transparent"
                                }`}
                              ></div>
                            </div>
                            <span
                              className={`text-gray-300 ${
                                !isEditing ? "opacity-50" : ""
                              }`}
                            >
                              {option}
                            </span>
                            <input
                              type="radio"
                              name="degree"
                              value={option}
                              checked={userData.degree === option}
                              onChange={handleChange}
                              disabled={!isEditing}
                              className="sr-only" // Hide default radio but keep accessible
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-300 mb-1">
                        Specialization
                      </label>
                      <div className="grid grid-cols-2 gap-3 mt-1">
                        {[
                          { value: "CS", label: "CS" },
                          { value: "IT", label: "IT" },
                          { value: "E&TC", label: "E&TC" },
                          { value: "AI&ML", label: "AI&ML" },
                          { value: "MECH", label: "MECH" },
                          { value: "CIVIL", label: "CIVIL" },
                        ].map((option) => (
                          <label
                            key={option.value}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <div
                              className={`flex items-center justify-center w-5 h-5 rounded-full border ${
                                userData.specialization === option.value
                                  ? "border-indigo-400"
                                  : "border-gray-500"
                              } ${!isEditing ? "opacity-50" : ""}`}
                            >
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  userData.specialization === option.value
                                    ? "bg-indigo-400"
                                    : "bg-transparent"
                                }`}
                              ></div>
                            </div>
                            <span
                              className={`text-gray-300 ${
                                !isEditing ? "opacity-70" : ""
                              }`}
                            >
                              {option.label}
                            </span>
                            <input
                              type="radio"
                              name="specialization"
                              value={option.value}
                              checked={userData.specialization === option.value}
                              onChange={handleChange}
                              disabled={!isEditing}
                              className="sr-only"
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-300 mb-1">
                        College Name
                      </label>
                      <select
                        name="collegeName"
                        value={userData.collegeName}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                          const { name, value } = e.target;
                          setUserData((prev) => ({ ...prev, [name]: value }));
                        }}
                        disabled={!isEditing}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white disabled:opacity-50 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      >
                        <option value="">Select College</option>
                        <option value="Pimpri Chinchwad Education Trust's PCCOE, Pune">
                          Pimpri Chinchwad Education Trust's PCCOE, Pune
                        </option>
                        <option value="Pimpri Chinchwad Education Trust's PCCOE&R">
                          Pimpri Chinchwad Education Trust's PCCOE&R
                        </option>
                        <option value="Pimpri Chinchwad Education Trust's NMIET">
                          Pimpri Chinchwad Education Trust's NMIET
                        </option>
                        <option value="Pimpri Chinchwad Education Trust's NCER">
                          Pimpri Chinchwad Education Trust's NCER
                        </option>
                      </select>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-300 mb-1">
                        Graduation Year
                      </label>
                      <input
                        type="text"
                        name="graduationYear"
                        value={userData.graduationYear}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white disabled:opacity-50"
                        placeholder="2023"
                      />
                    </div>
                  </div>

                  {/* Academic Scores */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                      Academic Scores
                    </h3>

                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-300 mb-1">
                        10th Percentage
                      </label>
                      <input
                        type="number"
                        name="tenthPercent"
                        value={userData.tenthPercent}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white disabled:opacity-50"
                        placeholder="85.5"
                        min="0"
                        max="100"
                        step="0.1"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-300 mb-1">
                        12th Percentage
                      </label>
                      <input
                        type="number"
                        name="twelfthPercent"
                        value={userData.twelfthPercent}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white disabled:opacity-50"
                        placeholder="85.5"
                        min="0"
                        max="100"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-300 mb-1">
                        Diploma Percentage
                      </label>
                      <input
                        type="number"
                        name="diplomaPercent"
                        value={userData.diplomaPercent}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white disabled:opacity-50"
                        placeholder="85.5"
                        min="0"
                        max="100"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-300 mb-1">
                        BE Percentage
                      </label>
                      <input
                        type="number"
                        name="BEPercent"
                        value={userData.BEPercent}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white disabled:opacity-50"
                        placeholder="85.5"
                        min="0"
                        max="100"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-300 mb-1">
                        CGPA
                      </label>
                      <input
                        type="number"
                        name="cgpa"
                        value={userData.cgpa}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white disabled:opacity-50"
                        min="0"
                        max="10"
                        step="0.1"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-300 mb-1">
                        CoCube Score
                      </label>
                      <input
                        type="text"
                        name="cocubeScore"
                        value={userData.cocubeScore}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white disabled:opacity-50"
                        placeholder="Your CoCube Score"
                      />
                    </div>
                  </div>

                  {/* Achievements and Links */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                      Achievements & Links
                    </h3>

                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-300 mb-1">
                        Technical Achievements
                      </label>
                      <textarea
                        name="technicalAchievements"
                        value={userData.technicalAchievements}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white disabled:opacity-50 h-24"
                        placeholder="List your technical achievements"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-300 mb-1">
                        Personal Achievements
                      </label>
                      <textarea
                        name="personalAchievements"
                        value={userData.personalAchievements}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white disabled:opacity-50 h-24"
                        placeholder="List your personal achievements"
                      />
                    </div>

                    {/* <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-300 mb-1">Projects</label>
                      <textarea
                        name="project"
                        value={userData.project}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white disabled:opacity-50 h-24"
                        placeholder="Describe your projects"
                      />
                    </div> */}

                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-300 mb-1">
                        CodeChef Profile
                      </label>
                      <input
                        type="url"
                        name="codechefLink"
                        value={userData.codechefLink}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white disabled:opacity-50"
                        placeholder="https://www.codechef.com/users/yourprofile"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-300 mb-1">
                        CodeChef Rating
                      </label>

                      {/* First Line (0-4) */}
                      <div className="flex items-center space-x-4 mt-1">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <label
                            key={rating}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <div
                              className={`flex items-center justify-center w-5 h-5 rounded-full border ${
                                userData.codechefRating === rating
                                  ? "border-indigo-400"
                                  : "border-gray-500"
                              } ${!isEditing ? "opacity-50" : ""}`}
                            >
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  userData.codechefRating === rating
                                    ? "bg-indigo-400"
                                    : "bg-transparent"
                                }`}
                              ></div>
                            </div>
                            <div className="flex items-center">
                              <span
                                className={`text-gray-300 ${
                                  !isEditing ? "opacity-50" : ""
                                }`}
                              >
                                {rating}
                              </span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className={`w-4 h-4 ml-1 ${
                                  userData.codechefRating === rating
                                    ? "text-indigo-400"
                                    : "text-gray-500"
                                } ${!isEditing ? "opacity-50" : ""}`}
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <input
                              type="radio"
                              name="codechefRating"
                              value={rating}
                              checked={userData.codechefRating === rating}
                              onChange={(e) =>
                                setUserData({
                                  ...userData,
                                  codechefRating: parseInt(e.target.value),
                                })
                              }
                              disabled={!isEditing}
                              className="sr-only"
                            />
                          </label>
                        ))}
                      </div>

                      {/* Second Line (5-7) */}
                      <div className="flex items-center space-x-4 mt-3">
                        {[5, 6, 7].map((rating) => (
                          <label
                            key={rating}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <div
                              className={`flex items-center justify-center w-5 h-5 rounded-full border ${
                                userData.codechefRating === rating
                                  ? "border-indigo-400"
                                  : "border-gray-500"
                              } ${!isEditing ? "opacity-50" : ""}`}
                            >
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  userData.codechefRating === rating
                                    ? "bg-indigo-400"
                                    : "bg-transparent"
                                }`}
                              ></div>
                            </div>
                            <div className="flex items-center">
                              <span
                                className={`text-gray-300 ${
                                  !isEditing ? "opacity-50" : ""
                                }`}
                              >
                                {rating}
                              </span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className={`w-4 h-4 ml-1 ${
                                  userData.codechefRating === rating
                                    ? "text-indigo-400"
                                    : "text-gray-500"
                                } ${!isEditing ? "opacity-50" : ""}`}
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <input
                              type="radio"
                              name="codechefRating"
                              value={rating}
                              checked={userData.codechefRating === rating}
                              onChange={(e) =>
                                setUserData({
                                  ...userData,
                                  codechefRating: parseInt(e.target.value),
                                })
                              }
                              disabled={!isEditing}
                              className="sr-only"
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-300 mb-1">
                        HackerRank Profile
                      </label>
                      <input
                        type="url"
                        name="hackerrankLink"
                        value={userData.hackerrankLink}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white disabled:opacity-50"
                        placeholder="https://leetcode.com/yourprofile/"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-300 mb-1">
                        HackerRank Rating
                      </label>

                      {/* First Line (0-4) */}
                      <div className="flex items-center space-x-4 mt-1">
                        {[0, 1, 2, 3, 4].map((rating) => (
                          <label
                            key={rating}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <div
                              className={`flex items-center justify-center w-5 h-5 rounded-full border ${
                                userData.hackerrankRating === rating
                                  ? "border-indigo-400"
                                  : "border-gray-500"
                              } ${!isEditing ? "opacity-50" : ""}`}
                            >
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  userData.hackerrankRating === rating
                                    ? "bg-indigo-400"
                                    : "bg-transparent"
                                }`}
                              ></div>
                            </div>
                            <div className="flex items-center">
                              <span
                                className={`text-gray-300 ${
                                  !isEditing ? "opacity-50" : ""
                                }`}
                              >
                                {rating}
                              </span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className={`w-4 h-4 ml-1 ${
                                  userData.hackerrankRating === rating
                                    ? "text-indigo-400"
                                    : "text-gray-500"
                                } ${!isEditing ? "opacity-50" : ""}`}
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <input
                              type="radio"
                              name="hackerrankRating"
                              value={rating}
                              checked={userData.hackerrankRating === rating}
                              onChange={(e) =>
                                setUserData({
                                  ...userData,
                                  hackerrankRating: parseInt(e.target.value),
                                })
                              }
                              disabled={!isEditing}
                              className="sr-only"
                            />
                          </label>
                        ))}
                      </div>

                      {/* Second Line (5-7) */}
                      <div className="flex items-center space-x-4 mt-3">
                        {[5, 6, 7].map((rating) => (
                          <label
                            key={rating}
                            className="flex items-center space-x-2 cursor-pointer"
                          >
                            <div
                              className={`flex items-center justify-center w-5 h-5 rounded-full border ${
                                userData.hackerrankRating === rating
                                  ? "border-indigo-400"
                                  : "border-gray-500"
                              } ${!isEditing ? "opacity-50" : ""}`}
                            >
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  userData.hackerrankRating === rating
                                    ? "bg-indigo-400"
                                    : "bg-transparent"
                                }`}
                              ></div>
                            </div>
                            <div className="flex items-center">
                              <span
                                className={`text-gray-300 ${
                                  !isEditing ? "opacity-50" : ""
                                }`}
                              >
                                {rating}
                              </span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                                className={`w-4 h-4 ml-1 ${
                                  userData.hackerrankRating === rating
                                    ? "text-indigo-400"
                                    : "text-gray-500"
                                } ${!isEditing ? "opacity-50" : ""}`}
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </div>
                            <input
                              type="radio"
                              name="hackerrankRating"
                              value={rating}
                              checked={userData.hackerrankRating === rating}
                              onChange={(e) =>
                                setUserData({
                                  ...userData,
                                  hackerrankRating: parseInt(e.target.value),
                                })
                              }
                              disabled={!isEditing}
                              className="sr-only"
                            />
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-300 mb-1">
                        LeetCode Profile
                      </label>
                      <input
                        type="url"
                        name="leetcodeLink"
                        value={userData.leetcodeLink}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white disabled:opacity-50"
                        placeholder="https://leetcode.com/yourprofile/"
                      />
                    </div>

                    <div className="flex flex-col">
                      <label className="text-sm font-medium text-gray-300 mb-1">
                        Leetcode Problem Solve Cout
                      </label>
                      <input
                        type="text"
                        name="leetcodeproblemcount"
                        value={userData.leetcodeproblemcount}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white disabled:opacity-50"
                        placeholder="123456789"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
            {activeTab === "fill" && (
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-8">
                <h2 className="text-2xl font-bold text-white mb-8">
                  Fill Google Form
                </h2>

                <div className="max-w-2xl">
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Google Form URL
                    </label>
                    <input
                      type="url"
                      value={formUrl}
                      onChange={(e) => setFormUrl(e.target.value)}
                      placeholder="https://forms.google.com/..."
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-white focus:border-transparent text-white placeholder-gray-500"
                    />
                    <p className="text-sm text-gray-400 mt-2">
                      Paste the Google Form URL from the company's recruitment
                      page
                    </p>
                  </div>

                  {/* Critical Warning Box (Red) */}
                  <div className="mb-4 p-4 bg-red-900/30 border border-red-700 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <h4 className="font-medium text-red-300 mb-2">
                          Critical Notice
                        </h4>
                        <ul className="space-y-2 text-sm text-red-200">
                          <li className="flex items-start space-x-2">
                            <span>•</span>
                            <span>
                              Please verify all your details before submission.
                              We are not responsible for any misinformation.
                            </span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span>•</span>
                            <span>
                              Carefully review the filled form for any unfilled
                              fields before submitting (project details, job positions, backlog details, etc).
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Important Notice Box (Yellow) */}
                  <div className="mb-6 p-4 bg-yellow-900/30 border border-yellow-700 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <div>
                        <h4 className="font-medium text-yellow-300 mb-2">
                          Important Notice
                        </h4>
                        <p className="text-sm text-yellow-200">
                          Upload required documents (resume, certificates, etc.)
                          manually as file uploads cannot be automated.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Rest of the code remains the same */}
                  <button
                    onClick={handleUpload}
                    disabled={!formUrl.trim() || isProcessing}
                    className="w-full bg-white text-black px-6 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-5 h-5" />
                        <span>Fill Form Automatically</span>
                      </>
                    )}
                  </button>

                  {isProcessing && (
                    <div className="mt-6 p-4 bg-gray-800 border border-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                        <div>
                          <h4 className="font-medium text-white">
                            Processing your form...
                          </h4>
                          <p className="text-sm text-gray-400">
                            We're analyzing the form and filling it with your
                            saved information.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-8 p-6 bg-gray-800 border border-gray-700 rounded-lg">
                    <h3 className="font-semibold text-white mb-4">
                      How it works:
                    </h3>
                    <ul className="space-y-3 text-sm text-gray-400">
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span>
                          We analyze the Google Form to identify input fields
                        </span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span>
                          Your saved profile data is automatically mapped to
                          relevant fields
                        </span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                        <span>
                          The form opens pre-filled for you to review and submit
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Dashboard;
