import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { HiSortAscending, HiSortDescending } from "react-icons/hi";

// mock rows — matches the real /applicants response shape, swap for real data later
const MOCK_APPLICANTS = [
  {
    id: "app_001",
    fullName: "Jade Gobagoba",
    email: "jade@example.com",
    country: "Botswana",
    track: "frontend",
    experienceLevel: "intermediate",
    status: "pending",
    applicationDate: "2026-07-21T06:55:21.586Z",
  },
  {
    id: "app_002",
    fullName: "Samuel Kebede",
    email: "samuel@example.com",
    country: "Ethiopia",
    track: "backend",
    experienceLevel: "beginner",
    status: "shortlisted",
    applicationDate: "2026-07-19T10:12:00.000Z",
  },
  {
    id: "app_003",
    fullName: "Amina Yusuf",
    email: "amina@example.com",
    country: "Kenya",
    track: "ui/ux",
    experienceLevel: "advanced",
    status: "rejected",
    applicationDate: "2026-07-15T14:30:00.000Z",
  },
];

// status → badge color, used inline below instead of a separate Badge component
const STATUS_STYLES = {
  pending: "bg-yellow-100 text-yellow-800",
  shortlisted: "bg-blue-100 text-blue-800",
  accepted: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const Applicants = () => {
  // filter state — placeholders for now, will drive the real fetch later
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [track, setTrack] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [sortBy, setSortBy] = useState("applicationDate");
  const [sortOrder, setSortOrder] = useState("desc");

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  return (
    <div className="w-full p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Applicants</CardTitle>

          {/* Filter bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-2 mt-4">
            {/* search */}
            <div className="lg:col-span-2 flex flex-col gap-1.5">
              <Label htmlFor="search">Search</Label>
              <Input
                id="search"
                placeholder="Name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {/* //status */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="status">Status</Label>
              <Select id="status" value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="shortlisted">Shortlisted</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* //track */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="track">Track</Label>
              <Select id="track" value={track} onValueChange={setTrack}>
                <SelectTrigger>
                  <SelectValue placeholder="All tracks" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="frontend">Frontend</SelectItem>
                  <SelectItem value="backend">Backend</SelectItem>
                  <SelectItem value="ui/ux">UI/UX</SelectItem>
                  <SelectItem value="data analytics">Data Analytics</SelectItem>
                  <SelectItem value="mobile">Mobile</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* //experiance */}
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="experience">Experience</Label>
              <Select
                id="experience"
                value={experienceLevel}
                onValueChange={setExperienceLevel}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Any level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* //sortBy */}
            <div className="flex flex-col gap-1.5">
              <Label>Sort by</Label>
              <div className="flex gap-2">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fullName">Name</SelectItem>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="applicationDate">Date</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                    <SelectItem value="track">Track</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* sortOrder */}
            <div className="flex flex-col justify-center items-center gap-1.5">
              <Label>sortOrder</Label>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                }
              >
                {sortOrder === "asc" ? (
                  <HiSortAscending />
                ) : (
                  <HiSortDescending />
                )}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Track</TableHead>
                  <TableHead>Experience</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {MOCK_APPLICANTS.map((a) => (
                  <TableRow key={a.id} className="cursor-pointer">
                    <TableCell className="font-medium">{a.fullName}</TableCell>
                    <TableCell>{a.email}</TableCell>
                    <TableCell>{a.country}</TableCell>
                    <TableCell className="capitalize">{a.track}</TableCell>
                    <TableCell className="capitalize">
                      {a.experienceLevel}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[a.status]}`}
                      >
                        {a.status}
                      </span>
                    </TableCell>
                    <TableCell>{formatDate(a.applicationDate)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination footer */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Showing 1–{MOCK_APPLICANTS.length} of {MOCK_APPLICANTS.length}
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Applicants;
