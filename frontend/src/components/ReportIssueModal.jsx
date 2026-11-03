import React, { useState } from 'react';
import { X, Camera, MapPin, AlertTriangle, CheckCircle2, Upload, Navigation, ArrowRight, Copy, Sparkles, Cpu, Check } from 'lucide-react';
import { createComplaint, uploadImageApi, analyzeIssueWithAi } from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function ReportIssueModal({ isOpen, onClose, onComplaintCreated, onOpenAuth }) {
  const { isAuthenticated, user } = useAuth();

  const [formData, setFormData] = useState({
    title: '',
    category: 'ROADS_INFRASTRUCTURE',
    severity: 'MEDIUM',
    description: '',
    address: 'Near Connaught Place Outer Circle, New Delhi',
    latitude: 28.6315,
    longitude: 77.2167,
    imageUrl: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [createdComplaint, setCreatedComplaint] = useState(null);
  const [copied, setCopied] = useState(false);
  const [aiScanning, setAiScanning] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiApplied, setAiApplied] = useState(false);

  if (!isOpen) return null;

  const handleRunAiScan = async (imgUrl) => {
    setAiScanning(true);
    setAiApplied(false);
    try {
      const res = await analyzeIssueWithAi({
        imageUrl: imgUrl || formData.imageUrl || imageFile?.name,
        title: formData.title,
        description: formData.description,
        categoryHint: formData.category,
      });
      setAiResult(res);
    } catch (err) {
      console.warn('AI analysis request failed', err);
    } finally {
      setAiScanning(false);
    }
  };

  const handleApplyAiSuggestions = () => {
    if (!aiResult) return;
    setFormData((prev) => ({
      ...prev,
      category: aiResult.detectedCategory || prev.category,
      severity: aiResult.suggestedSeverity || prev.severity,
    }));
    setAiApplied(true);
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));

    // Upload immediately
    setUploading(true);
    let uploadedUrl = null;
    try {
      const res = await uploadImageApi(file);
      uploadedUrl = res.url;
      setFormData((prev) => ({ ...prev, imageUrl: res.url }));
    } catch (err) {
      console.warn('Image upload failed, fallback to local URL', err);
    } finally {
      setUploading(false);
    }

    // Trigger AI Vision Scan
    handleRunAiScan(uploadedUrl || file.name);
  };

  const handleDetectLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData((prev) => ({
            ...prev,
            latitude: parseFloat(position.coords.latitude.toFixed(5)),
            longitude: parseFloat(position.coords.longitude.toFixed(5)),
            address: `GPS: ${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`,
          }));
        },
        () => {
          // If permission denied or unavailable, use sample coordinates
          setFormData((prev) => ({
            ...prev,
            latitude: 28.6289,
            longitude: 77.2144,
            address: 'Detected GPS Location (City Center)',
          }));
        }
      );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setError('Please sign in or select a demo role first to submit an issue.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        severity: formData.severity,
        address: formData.address,
        latitude: formData.latitude,
        longitude: formData.longitude,
        imageUrl: formData.imageUrl || (imagePreview ? imagePreview : null),
      };

      const result = await createComplaint(payload);
      setCreatedComplaint(result);
      if (onComplaintCreated) onComplaintCreated(result);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  const copyTrackingNumber = () => {
    if (createdComplaint?.trackingNumber) {
      navigator.clipboard.writeText(createdComplaint.trackingNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-400/20 text-sky-300 text-xs font-medium mb-1.5">
            <Camera className="w-3.5 h-3.5 text-sky-400" />
            Phase 2: Civic Issue Submission
          </div>
          <h2 className="text-xl font-bold">Report a Civic Hazard or Fault</h2>
          <p className="text-xs text-slate-300 mt-1">
            Submit road, sanitation, or utility defects with photo evidence and GPS tags.
          </p>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {!isAuthenticated ? (
            <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-center space-y-3">
              <AlertTriangle className="w-8 h-8 text-amber-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">Sign In Required to File Reports</h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                In UrbanFix AI, all civic tickets are cryptographically linked to your citizen identity for SLA tracking and notifications.
              </p>
              <button
                type="button"
                onClick={() => { onClose(); onOpenAuth(); }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all shadow-sm"
              >
                Sign In with Citizen Account
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : createdComplaint ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">Civic Issue Submitted Successfully!</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Your ticket has been logged in the system and routed for department dispatch.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white border border-emerald-300 max-w-sm mx-auto shadow-sm">
                <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  Tracking Number
                </div>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-lg font-mono font-extrabold text-slate-900">
                    {createdComplaint.trackingNumber}
                  </span>
                  <button
                    onClick={copyTrackingNumber}
                    title="Copy Tracking Number"
                    className="p-1.5 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                {copied && <div className="text-[10px] text-emerald-600 font-medium mt-1">Copied to clipboard!</div>}
              </div>

              <div className="text-xs text-slate-500">
                Category: <span className="font-semibold text-slate-800">{createdComplaint.category}</span> • Severity: <span className="font-semibold text-slate-800">{createdComplaint.severity}</span>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => { setCreatedComplaint(null); onClose(); }}
                  className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all"
                >
                  Done & View on Map
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Issue Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Major Pothole near Central Market"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                  >
                    <option value="ROADS_INFRASTRUCTURE">Roads & Potholes</option>
                    <option value="GARBAGE_SANITATION">Garbage & Waste</option>
                    <option value="STREETLIGHT_ELECTRICITY">Streetlights & Power</option>
                    <option value="WATER_DRAINAGE">Water & Drainage</option>
                    <option value="PARKS_GARDENS">Parks & Public Spaces</option>
                    <option value="OTHER">Other Civic Concern</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Severity Level
                  </label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                  >
                    <option value="LOW">Low (Cosmetic/Minor)</option>
                    <option value="MEDIUM">Medium (General Hazard)</option>
                    <option value="HIGH">High (Traffic/Health Risk)</option>
                    <option value="CRITICAL">Critical (Immediate Danger)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description & Context <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the issue, landmarks, and impact on pedestrians or vehicles..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Photo Evidence Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Photo Evidence (Optional / Recommended)
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex-1 border-2 border-dashed border-slate-300 hover:border-sky-500 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer bg-slate-50 hover:bg-sky-50/50 transition-colors">
                    <Upload className="w-5 h-5 text-slate-400 mb-1" />
                    <span className="text-xs font-medium text-slate-600">
                      {imageFile ? imageFile.name : 'Upload photo from device'}
                    </span>
                    <span className="text-[10px] text-slate-400">PNG, JPG, WEBP up to 10MB</span>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                  </label>

                  {imagePreview && (
                    <div className="w-16 h-16 rounded-xl border border-slate-200 overflow-hidden shrink-0 relative">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              {/* AI Vision Hazard Analyzer Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/5 via-slate-50 to-indigo-50/20 border border-indigo-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-600 border border-indigo-200">
                      <Cpu className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">AI Vision Hazard Inspection</h4>
                      <p className="text-[10px] text-slate-500">FastAPI neural vision analysis & automated classification</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={aiScanning}
                    onClick={() => handleRunAiScan()}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold shadow-sm transition-all disabled:opacity-50"
                  >
                    <Sparkles className={`w-3.5 h-3.5 ${aiScanning ? 'animate-spin' : ''}`} />
                    {aiScanning ? 'Scanning...' : 'Scan with AI'}
                  </button>
                </div>

                {aiScanning && (
                  <div className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-center space-y-1 animate-pulse">
                    <div className="text-xs font-semibold text-indigo-700 flex items-center justify-center gap-1.5">
                      <Sparkles className="w-4 h-4 animate-spin text-indigo-600" />
                      Neural Vision Engine Analyzing Evidence...
                    </div>
                    <div className="text-[10px] text-indigo-500">
                      Computing surface anomaly coordinates & severity prediction
                    </div>
                  </div>
                )}

                {aiResult && !aiScanning && (
                  <div className="p-3.5 bg-white border border-indigo-200 rounded-xl space-y-2.5 shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-200">
                            🤖 {Math.round((aiResult.confidence || 0.9) * 100)}% Confidence
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                            Severity: {aiResult.suggestedSeverity}
                          </span>
                        </div>
                        <h5 className="font-bold text-slate-900 text-xs mt-1.5">
                          {aiResult.categoryName}
                        </h5>
                      </div>

                      <button
                        type="button"
                        onClick={handleApplyAiSuggestions}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                          aiApplied
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                            : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200'
                        }`}
                      >
                        {aiApplied ? <Check className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                        {aiApplied ? 'Applied' : 'Apply AI'}
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-relaxed bg-slate-50 p-2 rounded-lg border border-slate-100">
                      {aiResult.explanation}
                    </p>

                    {aiResult.detectedLabels && aiResult.detectedLabels.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-0.5">
                        {aiResult.detectedLabels.map((lbl, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-mono font-medium border border-slate-200"
                          >
                            #{lbl.label} ({Math.round(lbl.confidence * 100)}%)
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Geolocation Section */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-sky-600" />
                    Geospatial Location
                  </span>
                  <button
                    type="button"
                    onClick={handleDetectLocation}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-sky-700 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-lg transition-colors"
                  >
                    <Navigation className="w-3 h-3" />
                    Auto-Detect GPS
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Latitude</span>
                    <input
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                      className="w-full px-2 py-1 text-xs rounded border border-slate-300 font-mono"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Longitude</span>
                    <input
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                      className="w-full px-2 py-1 text-xs rounded border border-slate-300 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block">Street Address / Landmark</span>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-2 py-1 text-xs rounded border border-slate-300"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || uploading}
                className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-md shadow-sky-600/20 disabled:opacity-50"
              >
                {submitting ? 'Submitting Civic Report...' : 'Submit Report'}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

