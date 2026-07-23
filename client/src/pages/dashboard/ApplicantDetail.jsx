import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  applicantsDetail,
  updateApplicantStatus,
  updateApplicantNote,
} from "../../api/applicants";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HiArrowLeft } from "react-icons/hi";
import { BiSolidError } from "react-icons/bi";
import { FiGithub, FiLinkedin, FiGlobe } from "react-icons/fi";

const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-800",
  shortlisted: "bg-blue-100 text-blue-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const ApplicantDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [applicant, setApplicant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [statusValue, setStatusValue] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);

  const [notesValue, setNotesValue] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);

  const formatDate = (iso) =>
    iso
      ? new Date(iso).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "—";

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const res = await applicantsDetail(id);
        setApplicant(res.data);
        setStatusValue(res.data.status || "");
        setNotesValue(res.data.notes || "");
      } catch (err) {
        const message =
          err.response?.data?.message || "Failed to load applicant details.";
        setError(message);
        toast.error(message, { position: "top-right" });
      } finally {
        setLoading(false);
        console.log(applicant);
      }
    };

    fetchDetail();
  }, [id]);

  const handleStatusUpdate = async () => {
    if (!statusValue || statusValue === applicant.status) return;

    setSavingStatus(true);
    try {
      const res = await updateApplicantStatus(id, statusValue);
      setApplicant((prev) => ({
        ...prev,
        status: res.data.status ?? statusValue,
      }));
      toast.success("Status updated.", { position: "top-right" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status.", {
        position: "top-right",
      });
    } finally {
      setSavingStatus(false);
    }
  };

  const handleNotesSave = async () => {
    setSavingNotes(true);
    try {
      const res = await updateApplicantNote(id, notesValue);
      setApplicant((prev) => ({
        ...prev,
        notes: res.data.notes ?? notesValue,
      }));
      toast.success("Note saved.", { position: "top-right" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save note.", {
        position: "top-right",
      });
    } finally {
      setSavingNotes(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full p-4 md:p-6 space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-60 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4 md:p-6 flex flex-col items-center justify-center gap-3 py-20">
        <BiSolidError className="text-red-500 size-12" />
        <p className="text-red-500 font-medium">{error}</p>
        <Button variant="outline" onClick={() => navigate("/dashboard/applicants")}>
          Back to Applicants
        </Button>
      </div>
    );
  }

  if (!applicant) return null;

  const hasLinks = applicant.portfolioUrl || applicant.githubUrl || applicant.linkedInUrl;

  return (
    <div className="w-full p-4 md:p-6 space-y-6">
      <Button
        variant="ghost"
        size="sm"
        className="gap-2"
        onClick={() => navigate("/dashboard/applicants")}
      >
        <HiArrowLeft /> Back to Applicants
      </Button>

      <Card>
        <CardContent className="pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{applicant.fullName}</h1>
            <p className="text-muted-foreground">{applicant.email}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Applied {formatDate(applicant.applicationDate)}
            </p>
          </div>
          <span
            className={`self-start sm:self-auto px-3 py-1 rounded-full text-sm font-medium capitalize ${
              STATUS_STYLES[applicant.status] || "bg-gray-100 text-gray-800"
            }`}
          >
            {applicant.status}
          </span>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Applicant Info</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Phone</p>
                <p className="font-medium">{applicant.phoneNumber || "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Country</p>
                <p className="font-medium">{applicant.country || "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Track</p>
                <p className="font-medium capitalize">
                  {applicant.track || "—"}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Experience Level</p>
                <p className="font-medium capitalize">
                  {applicant.experienceLevel || "—"}
                </p>
              </div>

              {applicant.skills && applicant.skills.length > 0 && (
                <div className="sm:col-span-2">
                  <p className="text-muted-foreground mb-1.5">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {applicant.skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded-md bg-muted text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {hasLinks && (
                <div className="sm:col-span-2 flex flex-wrap gap-4 pt-2">
                  {applicant.portfolioUrl && (
                    <a
                      href={applicant.portfolioUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-blue-600 hover:underline"
                    >
                      <FiGlobe /> Portfolio
                    </a>
                  )}
                  {applicant.githubUrl && (
                    <a
                      href={applicant.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-blue-600 hover:underline"
                    >
                      <FiGithub /> GitHub
                    </a>
                  )}
                  {applicant.linkedInUrl && (
                    <a
                      href={applicant.linkedInUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1.5 text-blue-600 hover:underline"
                    >
                      <FiLinkedin /> LinkedIn
                    </a>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {applicant.motivation && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Motivation</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {applicant.motivation}
                </p>
              </CardContent>
            </Card>
          )}
          {applicant.notes && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-wrap leading-relaxed">
                  {applicant.notes}
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Update Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Label>Status</Label>
              <Select value={statusValue} onValueChange={setStatusValue}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
              <Button
                className="w-full"
                disabled={savingStatus || statusValue === applicant.status}
                onClick={handleStatusUpdate}
              >
                {savingStatus ? "Updating..." : "Update Status"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Internal Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                placeholder="Add a note about this applicant..."
                value={notesValue}
                maxLength={1000}
                onChange={(e) => setNotesValue(e.target.value)}
                rows={6}
              />
              <p className="text-xs text-muted-foreground text-right">
                {notesValue.length}/1000
              </p>
              <Button
                className="w-full"
                variant="secondary"
                disabled={savingNotes}
                onClick={handleNotesSave}
              >
                {savingNotes ? "Saving..." : "Save Note"}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ApplicantDetail;