import { useEffect, useState } from "react";
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
import useDebounce from "../../components/hooks/useDebounce";
import { getApplicants } from "../../api/applicants";
import { toast } from "sonner";
import { Skeleton } from "../../components/ui/skeleton";
import { BiSolidError } from "react-icons/bi";
import { useNavigate } from "react-router-dom";


// const MOCK_APPLICANTS = [
//   {
//     id: "app_001",
//     fullName: "Jade Gobagoba",
//     email: "jade@example.com",
//     country: "Botswana",
//     track: "frontend",
//     experienceLevel: "intermediate",
//     status: "pending",
//     applicationDate: "2026-07-21T06:55:21.586Z",
//   },
//   {
//     id: "app_002",
//     fullName: "Samuel Kebede",
//     email: "samuel@example.com",
//     country: "Ethiopia",
//     track: "backend",
//     experienceLevel: "beginner",
//     status: "shortlisted",
//     applicationDate: "2026-07-19T10:12:00.000Z",
//   },
//   {
//     id: "app_003",
//     fullName: "Amina Yusuf",
//     email: "amina@example.com",
//     country: "Kenya",
//     track: "ui/ux",
//     experienceLevel: "advanced",
//     status: "rejected",
//     applicationDate: "2026-07-15T14:30:00.000Z",
//   },
// ];

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
  const [searchByCountry, setSearchByCountry] = useState("");
  const [status, setStatus] = useState("");
  const [track, setTrack] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [sortBy, setSortBy] = useState("applicationDate");
  const [sortOrder, setSortOrder] = useState("desc");
  const [page, setPage] = useState("1");
  const [limit, setLimit] = useState("10");

  const [meta, setMeta] = useState();
  const [applicants, setApplicants] = useState();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const debouncedSearch = useDebounce(search);
  const debouncedSearchByCountry = useDebounce(searchByCountry);

  const navigate = useNavigate();

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  const handleViewButton = ({id}) =>{
    if(!id){
      return toast.error("Applicant Not Found!", { position : 'top-right'})
    }
    return navigate(`/dashboard/applicants/${id}`)
  }

  // console.log(search, searchByCountry, status, track, experienceLevel, sortBy, sortOrder);
  useEffect(() => {
    const fetchApplicants = async () => {
      const params = {
        page,
        limit,
        search: debouncedSearch || undefined,
        country: debouncedSearchByCountry || undefined,
        status: status || undefined,
        track: track || undefined,
        experienceLevel: experienceLevel || undefined,
        sortBy,
        sortOrder,
      };

      setIsLoading(true);
      setError(null);
      try {
        const res = await getApplicants(params);
        console.log(res);
        if (res.status === 200) {
          setApplicants(res.data.data);
          setMeta(res.data.meta);
        }
      } catch (error) {
        console.log(error);
        setError(
          error.response?.data?.message ||
            "something wrong with fetching the data",
        );
        toast.error(
          error.response?.data?.message ||
            "something wrong with fetching the data",
          { position: "top-right" },
        );
      } finally {
        setIsLoading(false);
      }
    };

    console.log(page, limit);

    fetchApplicants();
  }, [
    debouncedSearch,
    debouncedSearchByCountry,
    status,
    track,
    experienceLevel,
    sortBy,
    sortOrder,
    page,
    limit,
  ]);


  return (
    <div className="w-full p-4 md:p-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl">Applicants</CardTitle>
          {/* Filter bar */}
          <div className="flex flex-col mt-4">
            {/* search */}
            <div className="w-full flex max-sm:flex-col gap-5">
              <div className="w-full lg:col-span-2 flex flex-col gap-1.5">
                <Label htmlFor="search">Search</Label>
                <Input
                  id="search"
                  placeholder="Name or email..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <div className="w-full lg:col-span-2 flex flex-col gap-1.5">
                <Label htmlFor="country">Search By Country</Label>
                <Input
                  id="country"
                  placeholder="Search by country"
                  value={searchByCountry}
                  onChange={(e) => setSearchByCountry(e.target.value)}
                />
              </div>
            </div>
            <div className="max-w-2xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mt-4">
              {/* //status */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="status">Status</Label>
                <Select
                  id="status"
                  value={status}
                  onValueChange={(value) =>
                    setStatus(value === "all" ? "" : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
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
                <Select
                  id="track"
                  value={track}
                  onValueChange={(value) =>
                    setTrack(value === "all" ? "" : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All tracks" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="frontend">Frontend</SelectItem>
                    <SelectItem value="backend">Backend</SelectItem>
                    <SelectItem value="ui-ux">UI/UX</SelectItem>
                    <SelectItem value="data-analytics">
                      Data Analytics
                    </SelectItem>
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
                  onValueChange={(value) =>
                    setExperienceLevel(value === "all" ? "" : value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
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
              <div className="flex flex-col justify-center items-start sm:items-center gap-1.5">
                <Label>Sort By Order</Label>
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
          </div>
        </CardHeader>

        <CardContent className="w-full">
          <div className="w-full overflow-x-auto rounded-md border mt-4">
            <Table className="w-full">
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>Track</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Applied</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="w-full">
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-50 text-center">
                      <Skeleton className="w-full h-full" />
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <div className="flex flex-col justify-center items-center p-10">
                        <BiSolidError className="text-gray-500 size-15" />
                        <p className="text-md font-medium text-red-300">
                          {error}
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : applicants?.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-32 text-center text-muted-foreground"
                    >
                      No applicants found.
                    </TableCell>
                  </TableRow>
                ) : (
                  applicants &&
                  applicants.map((a) => (
                    <TableRow key={a.id} className="cursor-pointer">
                      <TableCell className="font-medium">
                        {a.fullName}
                      </TableCell>
                      <TableCell>{a.email}</TableCell>
                      <TableCell>{a.country}</TableCell>
                      <TableCell className="capitalize">{a.track}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${STATUS_STYLES[a.status]}`}
                        >
                          {a.status}
                        </span>
                      </TableCell>
                      <TableCell>{formatDate(a.applicationDate)}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewButton({ id: a.id })}
                        >
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination footer */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              {`Showing ${meta?.page || 1} - ${meta?.limit || 10} of ${meta?.totalPages || 50}`}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() =>
                  setPage((prev) => Number(prev) > 1 && Number(prev) - 1)
                }
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= (meta?.totalPages ?? 1)}
                onClick={() =>
                  setPage(
                    (prev) => Number(prev) <= meta?.totalPages && Number(prev) + 1,
                  )
                }
              >
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
