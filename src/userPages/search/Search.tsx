import { Navbar } from "../../components/user/navbar/Navbar";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { districtsOfKerala } from "../../App";
import { request } from "@/utils/AxiosUtils";
import { showToast } from "@/utils/alert/toast";
import { alertWithOk, handleAlert } from "@/utils/alert/SweeAlert";
import { useNavigate } from "react-router-dom";
import { useSocket } from "@/shared/hoc/GlobalSocket";
import { Footer } from "@/components/user/footer/Footer";



 const UserSearchPage = () => {
  // State for search filters
  const [ageRange, setAgeRange] = useState({ min: "", max: "" });
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [interest, setInterest] = useState<string[] | null>(null);

  const navigate = useNavigate();
  const socket = useSocket();
  ////////////////fetch intererst///////////////
  useEffect(() => {
    try {
      async function fetchInterest() {
        const response: {
          Data: { food: string[]; music: string[]; sports: string[] };
        } = await request({ url: "/user/getInterest" });
        if (response?.Data) {
          setInterest([
            ...response.Data.food,
            ...response.Data.music,
            ...response.Data.sports,
          ]);
        }
      }
      function handleFuncton(data: {
        name: string;
        from: "accept" | "reject";
      }) {
        if (data.from === "accept") {
          showToast(
            `${data.name ? data.name : "partner"} accepted your request`
          );
        } else {
          showToast(
            `${data.name ? data.name : "partner"} declined your request`,
            "warning"
          );
        }
      }
      socket?.on("requestStutus", handleFuncton);
      socket?.on("errorFromSocket", (data: { message: string }) => {
        showToast(data.message, "error");
      });
      socket?.on("new_connect", (data) => {
        if (data.data) {
          showToast("new request arraived", "info");
        }
      });
      fetchInterest();
      return () => {
        socket?.off("new_connect");
        socket?.off("requestStutus", handleFuncton);
        socket?.off("errorFromSocket");
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        handleAlert("error", error.message || "internal server error");
      }
    }
  }, []);

  /////////////// handle reset
  const handleReset = () => {
    setAgeRange({ min: "", max: "" });
    setSelectedDistrict("");
    setSelectedInterests([]);
  };

  // Handle search submission
  const handleSearch = () => {
    // Collect search parameters
    if (
      ageRange.min === "" &&
      ageRange.max === "" &&
      selectedDistrict === "" &&
      !selectedInterests?.length
    ) {
      alertWithOk("Search Result", "No Criteria found", "info");
      return;
    }
    if (
      (ageRange.min &&
        ageRange.max &&
        parseInt(ageRange.min) > parseInt(ageRange.max)) ||
      parseInt(ageRange.min) < 18 ||
      parseInt(ageRange.min) > 60 ||
      parseInt(ageRange.max) < 18 ||
      parseInt(ageRange.max) > 60
    ) {
      showToast("Please provide a valid age range", "warning");

      return;
    }

    const searchParams = {
      minAge: ageRange.min,
      maxAge: ageRange.max,
      district: selectedDistrict,
      interests: selectedInterests,
    };
    navigate(`/loginLanding?`, {
      state: { data: searchParams, from: "search" },
    });
    console.log("Search Parameters:", searchParams);
  };

  // Handle interest selection/deselection
  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests((prev) => prev.filter((item) => item !== interest));
    } else if (selectedInterests.length <= 4) {
      setSelectedInterests((prev) => [...prev, interest]);
    } else {
      showToast("Interest limit exceeded", "info");
    }
  };

  return (
    <>
      <Navbar active="search" />
      <div className="mt-24 h-auto w-auto pb-40  ">
        <div className=" max-w-2xl mx-auto p-6 border  bg-white shadow-2xl shadow-orange-300 rounded-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">User Search</h1>

          {/* Age Range Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Age Range
            </label>
            <div className="flex space-x-2">
              <Input
                type="number"
                placeholder="Min Age"
                value={ageRange.min}
                min={18}
                max={59}
                onChange={(e) =>
                  setAgeRange((prev) => ({ ...prev, min: e.target.value }))
                }
                className="w-1/2"
              />
              <Input
                type="number"
                placeholder="Max Age"
                value={ageRange.max}
                max={60}
                min={19}
                onChange={(e) =>
                  setAgeRange((prev) => ({ ...prev, max: e.target.value }))
                }
                className="w-1/2"
              />
            </div>
          </div>

          {/* District Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              District
            </label>
            <Select
              value={selectedDistrict}
              onValueChange={setSelectedDistrict}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select District" />
              </SelectTrigger>
              <SelectContent>
                {districtsOfKerala.map((district) => (
                  <SelectItem key={district} value={district}>
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Interests Filter */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Interests
            </label>
            <div className="flex flex-wrap gap-2">
              {interest?.map((interest) => (
                <Button
                  key={interest}
                  variant={
                    selectedInterests.includes(interest) ? "default" : "outline"
                  }
                  onClick={() => toggleInterest(interest)}
                  className="mb-2"
                >
                  {interest}
                </Button>
              ))}
            </div>
          </div>

          {/* Search Button */}
          <div className="flex space-x-4">
            <Button
              onClick={handleSearch}
              className="flex-1 flex items-center justify-center"
            >
              <Search className="mr-2" />
              Search
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex-1 flex items-center justify-center text-red-600 hover:text-red-700"
            >
              <X className="mr-2" />
              Reset
            </Button>
          </div>

          {(ageRange.min ||
            ageRange.max ||
            selectedDistrict ||
            selectedInterests.length > 0) && (
            <div className="mt-4 p-3 bg-gray-100 rounded-lg">
              <h2 className="text-sm font-semibold mb-2">Current Filters:</h2>
              <div className="flex flex-wrap gap-2">
                {ageRange.min && (
                  <span className="bg-blue-100 px-2 py-1 rounded-full text-xs">
                    Min Age: {ageRange.min}
                  </span>
                )}
                {ageRange.max && (
                  <span className="bg-blue-100 px-2 py-1 rounded-full text-xs">
                    Max Age: {ageRange.max}
                  </span>
                )}
                {selectedDistrict && (
                  <span className="bg-green-100 px-2 py-1 rounded-full text-xs">
                    District: {selectedDistrict}
                  </span>
                )}
                {selectedInterests.map((interest) => (
                  <span
                    key={interest}
                    className="bg-purple-100 px-2 py-1 rounded-full text-xs"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserSearchPage;
