import React, { useState } from 'react';
import { X, Search, CheckCircle2, Clock, AlertTriangle, MapPin, Shield, Calendar, ArrowRight, Sparkles, Star, ThumbsUp, RotateCcw, MessageSquare } from 'lucide-react';
import { trackComplaint, rateComplaintResolution, reopenComplaint } from '../services/api';

const STATUS_STEPS = [
  { key: 'SUBMITTED', label: 'Submitted', desc: 'Received & Logged' },
  { key: 'ASSIGNED', label: 'Assigned', desc: 'Routed to Dept' },
  { key: 'IN_PROGRESS', label: 'In Progress', desc: 'Crew Dispatched' },
  { key: 'RESOLVED', label: 'Resolved', desc: 'Repaired & Verified' }
];

export default function TrackIssueModal({ isOpen, onClose, initialTrackingNumber }) {
  const [trackingNumber, setTrackingNumber] = useState(initialTrackingNumber || '');
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ratingStars, setRatingStars] = useState(5);
  const [ratingFeedback, setRatingFeedback] = useState('');
  const [reopenReason, setReopenReason] = useState('');
  const [showReopenForm, setShowReopenForm] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  if (!isOpen) return null;

  const handleRateSubmit = async (e) => {
    e.preventDefault();
    if (!complaint) return;
    setSubmittingFeedback(true);
    try {
      const updated = await rateComplaintResolution(complaint.id, {
        rating: ratingStars,
        feedback: ratingFeedback || 'Work verified and approved by citizen.',
      });
      setComplaint(updated);
      setFeedbackSuccess('Thank you! Your rating has been recorded and ticket marked CLOSED.');
      setTimeout(() => setFeedbackSuccess(''), 5000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit feedback');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleReopenSubmit = async (e) => {
    e.preventDefault();
    if (!complaint || !reopenReason.trim()) return;
    setSubmittingFeedback(true);
    try {
      const updated = await reopenComplaint(complaint.id, {
        reason: reopenReason,
      });
      setComplaint(updated);
      setShowReopenForm(false);
      setFeedbackSuccess('Ticket reopened and escalated back to municipal department queue.');
      setTimeout(() => setFeedbackSuccess(''), 5000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reopen complaint');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!trackingNumber.trim()) return;

    setLoading(true);
    setError('');
    try {
      const data = await trackComplaint(trackingNumber.trim());
      setComplaint(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Complaint not found. Please verify the tracking number (e.g. UF-2026-10001).');
      setComplaint(null);
    } finally {
      setLoading(false);
    }
  };

  const getStepStatus = (stepKey, currentStatus) => {
    const order = ['SUBMITTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
    const currentIndex = order.indexOf(currentStatus);
    const stepIndex = order.indexOf(stepKey);

    if (currentStatus === 'REJECTED') return 'rejected';
    if (currentIndex >= stepIndex) return 'completed';
    return 'pending';
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
            <Search className="w-3.5 h-3.5 text-sky-400" />
            Public Resolution Tracker
          </div>
          <h2 className="text-xl font-bold">Track Civic Issue Progress</h2>
          <p className="text-xs text-slate-300 mt-1">
            Real-time status tracking for municipal reports across city departments.
          </p>

          {/* Search Box inside header */}
          <form onSubmit={handleSearch} className="mt-4 flex gap-2">
            <input
              type="text"
              placeholder="Enter Tracking # (e.g. UF-2026-10001)"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              className="flex-1 px-4 py-2 text-xs rounded-xl bg-white/10 border border-white/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 font-mono"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 disabled:opacity-50"
            >
              {loading ? 'Searching...' : 'Track'}
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {complaint ? (
            <div className="space-y-6">
              {/* Top Banner with Tracking Number and Status */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block">
                    Ticket Reference
                  </span>
                  <span className="text-base font-extrabold font-mono text-slate-900">
                    {complaint.trackingNumber}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {complaint.departmentName && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                      {complaint.departmentName}
                    </span>
                  )}
                  {complaint.slaRemainingMinutes !== null && complaint.slaRemainingMinutes !== undefined && complaint.status !== 'RESOLVED' && (
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                      complaint.isSlaBreached
                        ? 'bg-rose-100 text-rose-700 border-rose-200'
                        : 'bg-amber-100 text-amber-800 border-amber-200'
                    }`}>
                      {complaint.isSlaBreached ? '🚨 SLA Overdue' : `⏳ ${Math.floor(complaint.slaRemainingMinutes / 60)}h left`}
                    </span>
                  )}
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    complaint.status === 'RESOLVED'
                      ? 'bg-emerald-100 text-emerald-800'
                      : complaint.status === 'IN_PROGRESS'
                      ? 'bg-indigo-100 text-indigo-800'
                      : complaint.status === 'ASSIGNED'
                      ? 'bg-sky-100 text-sky-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {complaint.status}
                  </span>
                </div>
              </div>

              {/* Progress Stepper Timeline */}
              <div className="p-4 rounded-2xl bg-white border border-slate-200">
                <div className="text-xs font-bold text-slate-800 mb-4">Resolution Lifecycle</div>
                <div className="grid grid-cols-4 gap-2 relative">
                  {STATUS_STEPS.map((step, idx) => {
                    const st = getStepStatus(step.key, complaint.status);
                    const isDone = st === 'completed';

                    return (
                      <div key={step.key} className="flex flex-col items-center text-center relative z-10">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-1 transition-colors ${
                          isDone
                            ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}>
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                        </div>
                        <span className={`text-[11px] font-bold ${isDone ? 'text-slate-900' : 'text-slate-400'}`}>
                          {step.label}
                        </span>
                        <span className="text-[9px] text-slate-400 leading-tight mt-0.5">
                          {step.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Issue Details Card */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900">{complaint.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {complaint.description}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50">
                    <MapPin className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                    <span className="truncate">{complaint.address || 'GPS Coordinates Stored'}</span>
                  </div>
                  <div className="flex items-center gap-1.5 p-2 rounded-lg bg-slate-50">
                    <Calendar className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                    <span>Reported: {new Date(complaint.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {complaint.aiConfidence && complaint.aiConfidence >= 0.75 && (
                  <div className="p-3 rounded-xl bg-indigo-50 border border-indigo-200 text-xs space-y-1">
                    <div className="font-bold text-indigo-900 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-indigo-600" />
                        AI Vision Verification:
                      </span>
                      <span className="text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-indigo-200 text-indigo-800">
                        {Math.round(complaint.aiConfidence * 100)}% Confidence
                      </span>
                    </div>
                    <p className="text-indigo-800 text-[11px]">
                      Automated neural hazard classification: <strong className="font-semibold">{complaint.aiPredictedCategory || complaint.category}</strong>
                    </p>
                  </div>
                )}

                {complaint.imageUrl && (
                  <div>
                    <div className="text-[11px] font-semibold text-slate-500 mb-1">Attached Photo Evidence:</div>
                    <div className="h-44 w-full rounded-xl overflow-hidden border border-slate-200">
                      <img src={complaint.imageUrl} alt="Complaint" className="w-full h-full object-cover" />
                    </div>
                  </div>
                )}

                {/* Resolution Notes (if resolved) */}
                {complaint.resolutionNotes && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs space-y-1">
                    <div className="font-bold text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Field Officer Resolution Notes:
                    </div>
                    <p className="text-emerald-800">{complaint.resolutionNotes}</p>
                    {complaint.resolvedAt && (
                      <div className="text-[10px] text-emerald-600">
                        Resolved on {new Date(complaint.resolvedAt).toLocaleString()}
                      </div>
                    )}
                  </div>
                )}

                {/* Citizen Feedback & Verification Loop (Phase 5) */}
                {complaint.citizenRating ? (
                  <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-900 flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        Citizen Verified Resolution Rating
                      </span>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((st) => (
                          <Star
                            key={st}
                            className={`w-3.5 h-3.5 ${
                              st <= complaint.citizenRating
                                ? 'text-amber-500 fill-amber-500'
                                : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    {complaint.citizenFeedback && (
                      <p className="text-amber-800 italic bg-white/80 p-2.5 rounded-lg border border-amber-200/60">
                        "{complaint.citizenFeedback}"
                      </p>
                    )}
                    <div className="text-[10px] text-amber-700">
                      Ticket officially finalized and CLOSED.
                    </div>
                  </div>
                ) : (complaint.status === 'RESOLVED' || complaint.status === 'CLOSED') ? (
                  <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50 via-white to-sky-50 border border-indigo-200 text-xs space-y-3 shadow-xs">
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <ThumbsUp className="w-4 h-4 text-sky-600" />
                        Verify Repair & Rate Municipal Service
                      </h4>
                      <p className="text-slate-500 text-[11px] mt-0.5">
                        Has the field crew satisfactorily resolved this issue? Confirm to close the ticket or dispute to reopen.
                      </p>
                    </div>

                    {feedbackSuccess && (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-semibold">
                        {feedbackSuccess}
                      </div>
                    )}

                    {!showReopenForm ? (
                      <form onSubmit={handleRateSubmit} className="space-y-3">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                            Rate Quality of Resolution:
                          </label>
                          <div className="flex items-center gap-1.5">
                            {[1, 2, 3, 4, 5].map((st) => (
                              <button
                                key={st}
                                type="button"
                                onClick={() => setRatingStars(st)}
                                className="p-1 hover:scale-110 transition-transform"
                              >
                                <Star
                                  className={`w-6 h-6 ${
                                    st <= ratingStars
                                      ? 'text-amber-500 fill-amber-500'
                                      : 'text-slate-300 hover:text-amber-300'
                                  }`}
                                />
                              </button>
                            ))}
                            <span className="text-xs font-bold text-amber-700 ml-2">
                              {ratingStars} / 5 Stars
                            </span>
                          </div>
                        </div>

                        <div>
                          <input
                            type="text"
                            placeholder="Optional feedback: e.g. Cleanly paved and all debris removed..."
                            value={ratingFeedback}
                            onChange={(e) => setRatingFeedback(e.target.value)}
                            className="w-full text-xs px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                          />
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <button
                            type="button"
                            onClick={() => setShowReopenForm(true)}
                            className="text-rose-600 hover:text-rose-800 text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <RotateCcw className="w-3.5 h-3.5" /> Dispute & Reopen Issue
                          </button>

                          <button
                            type="submit"
                            disabled={submittingFeedback}
                            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold text-xs shadow-sm transition-all flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {submittingFeedback ? 'Submitting...' : 'Approve & Close Ticket'}
                          </button>
                        </div>
                      </form>
                    ) : (
                      <form onSubmit={handleReopenSubmit} className="space-y-3 p-3 bg-rose-50/50 border border-rose-200 rounded-lg">
                        <div className="text-xs font-bold text-rose-900 flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                          Specify Dispute Reason:
                        </div>
                        <textarea
                          rows={2}
                          required
                          placeholder="e.g. Loose stones left in pothole, hazard still present..."
                          value={reopenReason}
                          onChange={(e) => setReopenReason(e.target.value)}
                          className="w-full text-xs p-2 border border-rose-300 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-rose-500"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setShowReopenForm(false)}
                            className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-800"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            disabled={submittingFeedback}
                            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-lg transition-colors"
                          >
                            Submit Reopen Notice
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-slate-400 space-y-2">
              <Search className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs">Enter a tracking number above to view real-time civic resolution progress.</p>
              <div className="text-[11px] text-slate-500">
                Sample tickets to test: <code className="bg-slate-100 px-1 py-0.5 rounded text-sky-700">UF-2026-10001</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-sky-700">UF-2026-10002</code>, <code className="bg-slate-100 px-1 py-0.5 rounded text-sky-700">UF-2026-10003</code>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

