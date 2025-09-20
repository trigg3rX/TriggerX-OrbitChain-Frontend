"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ConnectWalletButton } from "@/components/connect-wallet-button";
import {
  Globe,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Activity,
  Users,
  DollarSign,
  ExternalLink,
  Settings,
  Trash2,
  Play,
  Pause,
  Copy,
  Check,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Typography } from "@/components/ui/typography";

// API configuration
const API_PORT = process.env.NEXT_PUBLIC_API_PORT || 9002;
const API_BASE_URL = `http://192.168.0.223:${API_PORT}`;

// Type definition for OrbitChainData
interface OrbitChainData {
  chain_id: number;
  chain_name: string;
  rpc_url?: string;
  user_address: string;
  deployment_status: string;
  orbit_chain_address?: string;
  created_at?: string;
  updated_at?: string;
  // Legacy fields for backward compatibility
  id?: string;
  name?: string;
  chainId?: string;
  status?: string;
  environment?: string;
  framework?: string;
  transactions?: string;
  users?: string;
  uptime?: string;
  cost?: string;
  deployedAt?: string;
}

// Mock data for deployed chains (fallback)
const mockChains: OrbitChainData[] = [
  {
    id: "1",
    chain_id: 39713,
    chain_name: "Zora Network",
    name: "Zora Network",
    chainId: "39713",
    status: "active",
    deployment_status: "active",
    environment: "testnet",
    framework: "Arbitrum Orbit",
    transactions: "1.2M",
    users: "45K",
    uptime: "99.9%",
    cost: "$250/mo",
    deployedAt: "2024-01-15",
    user_address: "0x1234567890123456789012345678901234567890",
    rpc_url: "https://rpc.zora.energy",
    orbit_chain_address: "0xabcdef1234567890abcdef1234567890abcdef12",
    created_at: "2024-01-15T00:00:00Z",
    updated_at: "2024-01-15T00:00:00Z",
  },
  {
    id: "2",
    chain_id: 42161,
    chain_name: "Gaming Chain",
    name: "Gaming Chain",
    chainId: "42161",
    status: "active",
    deployment_status: "active",
    environment: "mainnet",
    framework: "OP Stack",
    transactions: "850K",
    users: "32K",
    uptime: "99.8%",
    cost: "$5,000/mo",
    deployedAt: "2024-02-01",
    user_address: "0x2345678901234567890123456789012345678901",
    rpc_url: "https://rpc.gaming.chain",
    orbit_chain_address: "0xbcdef1234567890abcdef1234567890abcdef123",
    created_at: "2024-02-01T00:00:00Z",
    updated_at: "2024-02-01T00:00:00Z",
  },
  {
    id: "3",
    chain_id: 10,
    chain_name: "DeFi Protocol",
    name: "DeFi Protocol",
    chainId: "10",
    status: "paused",
    deployment_status: "paused",
    environment: "testnet",
    framework: "Arbitrum Orbit",
    transactions: "500K",
    users: "18K",
    uptime: "99.5%",
    cost: "$250/mo",
    deployedAt: "2024-01-28",
    user_address: "0x3456789012345678901234567890123456789012",
    created_at: "2024-01-28T00:00:00Z",
    updated_at: "2024-01-28T00:00:00Z",
  },
];

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [chains, setChains] = useState<OrbitChainData[]>(mockChains);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] =
    useState<keyof OrbitChainData>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log(
          "Fetching dashboard data from:",
          `${API_BASE_URL}/api/orbit-chain/dashboard`
        );

        const res = await fetch(`${API_BASE_URL}/api/orbit-chain/dashboard`);
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);

        const data = await res.json();
        console.log("Dashboard API response:", data);

        // Assuming the API returns an array of chains or an object with chains property
        if (Array.isArray(data)) {
          setChains(data as OrbitChainData[]);
        } else if (data.chains && Array.isArray(data.chains)) {
          setChains(data.chains as OrbitChainData[]);
        } else {
          console.warn("Unexpected API response format:", data);
          setChains(mockChains); // fallback to mock data
        }
      } catch (err: any) {
        console.error("Failed to fetch dashboard data:", err);
        setError(err.message || "Failed to load dashboard data");
        setChains(mockChains); // fallback to mock data
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Filter and sort chains
  const filteredChains = chains
    .filter(
      (chain) =>
        (chain.chain_name || chain.name || "")
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        (chain.chain_id?.toString() || chain.chainId || "").includes(
          searchQuery
        )
    )
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (aValue === undefined || bValue === undefined) return 0;

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

  // Pagination calculations
  const totalItems = filteredChains.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedChains = filteredChains.slice(startIndex, endIndex);

  // Reset to first page when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-[#F8FF7C]/20 text-[#F8FF7C] border-[#F8FF7C]/30";
      case "paused":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "deploying":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const copyToClipboard = async (text: string, itemId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems((prev) => new Set(prev).add(itemId));
      setTimeout(() => {
        setCopiedItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleSort = (field: keyof OrbitChainData) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
    setCurrentPage(1); // Reset to first page when sorting
  };

  const SortableHeader = ({
    field,
    children,
  }: {
    field: keyof OrbitChainData;
    children: React.ReactNode;
  }) => (
    <th
      className="text-left p-4 font-medium text-white cursor-pointer hover:text-[#F8FF7C] transition-colors duration-200 select-none"
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-2">
        {children}
        {sortField === field &&
          (sortDirection === "asc" ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          ))}
      </div>
    </th>
  );

  return (
    <div className="min-h-screen">
      <main className="container mx-auto px-4 py-20">
        <div className="text-center mb-8">
          <Typography variant="h1" className="mb-4 text-white">
            Dashboard{" "}
          </Typography>
          <Typography variant="h3" className="text-gray-300 text-lg">
            Manage your deployed blockchain networks
          </Typography>

          {/* {loading && (
            <p className="text-sm text-[#F8FF7C] mt-2">
              Loading dashboard data...
            </p>
          )}
          {error && <p className="text-sm text-red-400 mt-2">Error: {error}</p>} */}
        </div>

        {/* Overview Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-[#D9D9D924] to-[#14131324] border-white/10 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Total Chains
              </CardTitle>
              <Globe className="h-4 w-4 text-[#F8FF7C]" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <div className="h-8 bg-white/10 rounded animate-pulse"></div>
                  <div className="h-3 bg-white/5 rounded animate-pulse"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-white">
                    {chains.length}
                  </div>
                  <p className="text-xs text-gray-300">Total deployed chains</p>
                </>
              )}
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-[#D9D9D924] to-[#14131324] border-white/10 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Total Transactions
              </CardTitle>
              <Activity className="h-4 w-4 text-[#F8FF7C]" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <div className="h-8 bg-white/10 rounded animate-pulse"></div>
                  <div className="h-3 bg-white/5 rounded animate-pulse"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-white">2.55M</div>
                  <p className="text-xs text-gray-300">+12% from last month</p>
                </>
              )}
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-[#D9D9D924] to-[#14131324] border-white/10 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Active Users
              </CardTitle>
              <Users className="h-4 w-4 text-[#F8FF7C]" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <div className="h-8 bg-white/10 rounded animate-pulse"></div>
                  <div className="h-3 bg-white/5 rounded animate-pulse"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-white">95K</div>
                  <p className="text-xs text-gray-300">+8% from last month</p>
                </>
              )}
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-r from-[#D9D9D924] to-[#14131324] border-white/10 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white">
                Monthly Cost
              </CardTitle>
              <DollarSign className="h-4 w-4 text-[#F8FF7C]" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <div className="h-8 bg-white/10 rounded animate-pulse"></div>
                  <div className="h-3 bg-white/5 rounded animate-pulse"></div>
                </div>
              ) : (
                <>
                  <div className="text-2xl font-bold text-white">$5,500</div>
                  <p className="text-xs text-gray-300">+$250 from last month</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#F8FF7C] w-5 h-5" />
            <Input
              placeholder="Search by chain name, ID, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 bg-[#242323] border-white/10 text-white placeholder:text-gray-500 focus:border-[#F8FF7C] focus:ring-2 focus:ring-[#F8FF7C]/20 rounded-xl py-3 transition-all duration-200 hover:border-white/20"
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="py-2 md:py-0 bg-[#242323] border-white/10 text-white hover:border-[#F8FF7C]/50 hover:bg-[#242323]/80"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Orbit Chains Table */}
        <Card className="bg-gradient-to-r from-[#D9D9D924] to-[#14131324] border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-white font-semibold">
              Orbit Chains
            </CardTitle>
            <CardDescription className="text-gray-300">
              Manage your deployed blockchain networks
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                {/* Animated Loading Spinner */}
                <div className="relative mb-6">
                  <div className="w-16 h-16 border-4 border-white/10 rounded-full animate-spin border-t-[#F8FF7C]"></div>
                  <div className="absolute inset-0 w-16 h-16 border-4 border-transparent rounded-full animate-ping border-t-[#F8FF7C]/30"></div>
                </div>

                {/* Loading Text with Animation */}
                <div className="text-center space-y-2">
                  <h3 className="text-lg font-medium text-white animate-pulse">
                    Loading Orbit Chains
                  </h3>
                </div>

                {/* Loading Dots Animation */}
                <div className="flex space-x-1 mt-4">
                  <div className="w-2 h-2 bg-[#F8FF7C] rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-[#F8FF7C] rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-[#F8FF7C] rounded-full animate-bounce delay-200"></div>
                </div>

                {/* Progress Bar */}
                <div className="w-64 h-1 bg-white/10 rounded-full mt-6 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#F8FF7C] to-[#FFF282] rounded-full animate-pulse"></div>
                </div>
              </div>
            ) : (
              <>
                {/* Desktop Table View */}
                <div className="hidden lg:block overflow-x-auto">
                  <table
                    className="w-full border-collapse"
                    style={{ fontFamily: "var(--font-family-actay-regular)" }}
                  >
                    <thead>
                      <tr className="border-b border-white/10">
                        <SortableHeader field="chain_name">
                          Chain
                        </SortableHeader>
                        <th className="text-left p-4 font-medium text-white">
                          Network
                        </th>
                        <SortableHeader field="deployment_status">
                          Status
                        </SortableHeader>
                        <SortableHeader field="created_at">
                          Created
                        </SortableHeader>
                        <th className="text-left p-4 font-medium text-white">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedChains.map((chain, index) => (
                        <tr
                          key={chain.id || index}
                          className="border-b border-white/10 hover:bg-white/5 transition-colors duration-200"
                        >
                          <td className="p-4">
                            <div className="flex flex-col">
                              <span className="font-medium text-white text-sm">
                                {chain.chain_name || chain.name}
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="font-mono text-xs text-gray-400">
                                  ID: {chain.chain_id || chain.chainId}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col space-y-1">
                              {chain.rpc_url && (
                                <div className="flex items-center gap-2">
                                  <a
                                    href={chain.rpc_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#F8FF7C] hover:underline text-xs font-mono truncate max-w-[200px]"
                                  >
                                    RPC:{" "}
                                    {chain.rpc_url.length > 25
                                      ? `${chain.rpc_url.substring(0, 25)}...`
                                      : chain.rpc_url}
                                  </a>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-5 w-5 p-0 text-gray-400 hover:text-[#F8FF7C]"
                                    onClick={() =>
                                      copyToClipboard(
                                        chain.rpc_url || "",
                                        `rpc-${index}`
                                      )
                                    }
                                  >
                                    {copiedItems.has(`rpc-${index}`) ? (
                                      <Check className="w-3 h-3" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </Button>
                                </div>
                              )}
                              {chain.user_address && (
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs text-gray-300">
                                    User:{" "}
                                    {`${chain.user_address.substring(
                                      0,
                                      6
                                    )}...${chain.user_address.substring(
                                      chain.user_address.length - 4
                                    )}`}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-5 w-5 p-0 text-gray-400 hover:text-[#F8FF7C]"
                                    onClick={() =>
                                      copyToClipboard(
                                        chain.user_address || "",
                                        `user-${index}`
                                      )
                                    }
                                  >
                                    {copiedItems.has(`user-${index}`) ? (
                                      <Check className="w-3 h-3" />
                                    ) : (
                                      <Copy className="w-3 h-3" />
                                    )}
                                  </Button>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <Badge
                              className={`${getStatusColor(
                                chain.deployment_status ||
                                  chain.status ||
                                  "unknown"
                              )} text-xs`}
                            >
                              {chain.deployment_status || chain.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-sm text-gray-300">
                            {chain.created_at
                              ? new Date(chain.created_at).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td className="p-4">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-white hover:bg-white/10"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="bg-[#1a1a1a] border-white/10"
                              >
                                <DropdownMenuItem className="text-white hover:bg-white/10">
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  View Explorer
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-white hover:bg-white/10">
                                  <Settings className="w-4 h-4 mr-2" />
                                  Configure
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-white hover:bg-white/10">
                                  {(chain.deployment_status || chain.status) ===
                                  "active" ? (
                                    <>
                                      <Pause className="w-4 h-4 mr-2" />
                                      Pause
                                    </>
                                  ) : (
                                    <>
                                      <Play className="w-4 h-4 mr-2" />
                                      Resume
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Card View */}
                <div
                  className="lg:hidden space-y-4"
                  style={{ fontFamily: "var(--font-family-actay-regular)" }}
                >
                  {paginatedChains.map((chain, index) => (
                    <Card
                      key={chain.id || index}
                      className="bg-gradient-to-r from-[#1a1a1a] to-[#0f0f0f] border-white/10 hover:border-white/20 transition-all duration-200"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-medium text-white text-sm mb-1">
                              {chain.chain_name || chain.name}
                            </h3>
                            <div className="flex items-center gap-2">
                              <p className="font-mono text-xs text-gray-400">
                                Chain ID: {chain.chain_id || chain.chainId}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              className={`${getStatusColor(
                                chain.deployment_status ||
                                  chain.status ||
                                  "unknown"
                              )} text-xs`}
                            >
                              {chain.deployment_status || chain.status}
                            </Badge>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-white hover:bg-white/10 h-8 w-8 p-0"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="bg-[#1a1a1a] border-white/10"
                              >
                                <DropdownMenuItem className="text-white hover:bg-white/10">
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  View Explorer
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-white hover:bg-white/10">
                                  <Settings className="w-4 h-4 mr-2" />
                                  Configure
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-white hover:bg-white/10">
                                  {(chain.deployment_status || chain.status) ===
                                  "active" ? (
                                    <>
                                      <Pause className="w-4 h-4 mr-2" />
                                      Pause
                                    </>
                                  ) : (
                                    <>
                                      <Play className="w-4 h-4 mr-2" />
                                      Resume
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-400 hover:bg-red-500/10">
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>

                        <div className="space-y-2 text-xs">
                          {chain.rpc_url && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 w-16">RPC:</span>
                              <a
                                href={chain.rpc_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#F8FF7C] hover:underline font-mono truncate flex-1"
                              >
                                {chain.rpc_url.length > 30
                                  ? `${chain.rpc_url.substring(0, 30)}...`
                                  : chain.rpc_url}
                              </a>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-5 w-5 p-0 text-gray-400 hover:text-[#F8FF7C]"
                                onClick={() =>
                                  copyToClipboard(
                                    chain.rpc_url || "",
                                    `mobile-rpc-${index}`
                                  )
                                }
                              >
                                {copiedItems.has(`mobile-rpc-${index}`) ? (
                                  <Check className="w-3 h-3" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </Button>
                            </div>
                          )}

                          {chain.user_address && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 w-16">User:</span>
                              <span className="font-mono text-gray-300 truncate flex-1">
                                {`${chain.user_address.substring(
                                  0,
                                  6
                                )}...${chain.user_address.substring(
                                  chain.user_address.length - 4
                                )}`}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-5 w-5 p-0 text-gray-400 hover:text-[#F8FF7C]"
                                onClick={() =>
                                  copyToClipboard(
                                    chain.user_address || "",
                                    `mobile-user-${index}`
                                  )
                                }
                              >
                                {copiedItems.has(`mobile-user-${index}`) ? (
                                  <Check className="w-3 h-3" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </Button>
                            </div>
                          )}

                          {chain.orbit_chain_address && (
                            <div className="flex items-center gap-2">
                              <span className="text-gray-400 w-16">Orbit:</span>
                              <span className="font-mono text-gray-300 truncate flex-1">
                                {`${chain.orbit_chain_address.substring(
                                  0,
                                  6
                                )}...${chain.orbit_chain_address.substring(
                                  chain.orbit_chain_address.length - 4
                                )}`}
                              </span>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-5 w-5 p-0 text-gray-400 hover:text-[#F8FF7C]"
                                onClick={() =>
                                  copyToClipboard(
                                    chain.orbit_chain_address || "",
                                    `mobile-orbit-${index}`
                                  )
                                }
                              >
                                {copiedItems.has(`mobile-orbit-${index}`) ? (
                                  <Check className="w-3 h-3" />
                                ) : (
                                  <Copy className="w-3 h-3" />
                                )}
                              </Button>
                            </div>
                          )}

                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 w-16">Created:</span>
                            <span className="text-gray-300">
                              {chain.created_at
                                ? new Date(
                                    chain.created_at
                                  ).toLocaleDateString()
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredChains.length === 0 && (
                  <div className="text-center py-8 text-gray-300">
                    No chains found. Deploy your first chain to get started.
                  </div>
                )}

                {/* Pagination Controls */}
                {totalItems > 0 && (
                  <div className="mt-6 pt-6 border-t border-white/10">
                    {/* Mobile Layout */}
                    <div className="flex flex-col gap-4 lg:hidden">
                      {/* Items per page selector - Mobile */}
                      <div className="flex items-center justify-center gap-2">
                        <span
                          className="text-sm text-gray-400"
                          style={{
                            fontFamily: "var(--font-family-actay-regular)",
                          }}
                        >
                          Show:
                        </span>
                        <Select
                          value={itemsPerPage.toString()}
                          onValueChange={(value) => {
                            setItemsPerPage(Number(value));
                            setCurrentPage(1);
                          }}
                        >
                          <SelectTrigger className="w-20 bg-[#242323] border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:border-[#F8FF7C] focus:ring-2 focus:ring-[#F8FF7C]/20 hover:border-white/20 transition-all duration-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#242323] border-white/10">
                            <SelectItem
                              value="5"
                              className="text-white hover:bg-[#F8FF7C] hover:text-[#1a1a1a] focus:bg-[#F8FF7C] focus:text-[#1a1a1a]"
                              style={{
                                fontFamily: "var(--font-family-actay-regular)",
                              }}
                            >
                              5
                            </SelectItem>
                            <SelectItem
                              value="10"
                              className="text-white hover:bg-[#F8FF7C] hover:text-[#1a1a1a] focus:bg-[#F8FF7C] focus:text-[#1a1a1a]"
                              style={{
                                fontFamily: "var(--font-family-actay-regular)",
                              }}
                            >
                              10
                            </SelectItem>
                            <SelectItem
                              value="25"
                              className="text-white hover:bg-[#F8FF7C] hover:text-[#1a1a1a] focus:bg-[#F8FF7C] focus:text-[#1a1a1a]"
                              style={{
                                fontFamily: "var(--font-family-actay-regular)",
                              }}
                            >
                              25
                            </SelectItem>
                            <SelectItem
                              value="50"
                              className="text-white hover:bg-[#F8FF7C] hover:text-[#1a1a1a] focus:bg-[#F8FF7C] focus:text-[#1a1a1a]"
                              style={{
                                fontFamily: "var(--font-family-actay-regular)",
                              }}
                            >
                              50
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <span
                          className="text-sm text-gray-400"
                          style={{
                            fontFamily: "var(--font-family-actay-regular)",
                          }}
                        >
                          per page
                        </span>
                      </div>

                      {/* Pagination info - Mobile */}
                      <div className="text-center text-sm text-gray-400">
                        Showing {startIndex + 1} to{" "}
                        {Math.min(endIndex, totalItems)} of {totalItems} chains
                      </div>

                      {/* Pagination buttons - Mobile */}
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCurrentPage(Math.max(1, currentPage - 1))
                          }
                          disabled={currentPage === 1}
                          className="bg-[#1a1a1a] border-white/10 text-white hover:border-[#F8FF7C] disabled:opacity-50"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>

                        {/* Page numbers - Mobile (show fewer) */}
                        <div className="flex items-center gap-1">
                          {Array.from(
                            { length: Math.min(3, totalPages) },
                            (_, i) => {
                              const pageNum =
                                Math.max(
                                  1,
                                  Math.min(totalPages - 2, currentPage - 1)
                                ) + i;
                              if (pageNum > totalPages) return null;

                              return (
                                <Button
                                  key={pageNum}
                                  variant={
                                    currentPage === pageNum
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  onClick={() => setCurrentPage(pageNum)}
                                  className={
                                    currentPage === pageNum
                                      ? "bg-[#F8FF7C] text-[#1a1a1a] hover:bg-[#F8FF7C]/90"
                                      : "bg-[#1a1a1a] border-white/10 text-white hover:border-[#F8FF7C]"
                                  }
                                >
                                  {pageNum}
                                </Button>
                              );
                            }
                          )}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCurrentPage(
                              Math.min(totalPages, currentPage + 1)
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="bg-[#1a1a1a] border-white/10 text-white hover:border-[#F8FF7C] disabled:opacity-50"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Desktop Layout */}
                    <div className="hidden lg:flex items-center justify-between gap-4">
                      {/* Items per page selector - Desktop */}
                      <div className="flex items-center gap-2">
                        <span
                          className="text-sm text-gray-400"
                          style={{
                            fontFamily: "var(--font-family-actay-regular)",
                          }}
                        >
                          Show:
                        </span>
                        <Select
                          value={itemsPerPage.toString()}
                          onValueChange={(value) => {
                            setItemsPerPage(Number(value));
                            setCurrentPage(1);
                          }}
                        >
                          <SelectTrigger className="w-20 bg-[#242323] border-white/10 text-white text-sm rounded-lg px-3 py-2 focus:border-[#F8FF7C] focus:ring-2 focus:ring-[#F8FF7C]/20 hover:border-white/20 transition-all duration-200">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-[#242323] border-white/10">
                            <SelectItem
                              value="5"
                              className="text-white hover:bg-[#F8FF7C] hover:text-[#1a1a1a] focus:bg-[#F8FF7C] focus:text-[#1a1a1a]"
                              style={{
                                fontFamily: "var(--font-family-actay-regular)",
                              }}
                            >
                              5
                            </SelectItem>
                            <SelectItem
                              value="10"
                              className="text-white hover:bg-[#F8FF7C] hover:text-[#1a1a1a] focus:bg-[#F8FF7C] focus:text-[#1a1a1a]"
                              style={{
                                fontFamily: "var(--font-family-actay-regular)",
                              }}
                            >
                              10
                            </SelectItem>
                            <SelectItem
                              value="25"
                              className="text-white hover:bg-[#F8FF7C] hover:text-[#1a1a1a] focus:bg-[#F8FF7C] focus:text-[#1a1a1a]"
                              style={{
                                fontFamily: "var(--font-family-actay-regular)",
                              }}
                            >
                              25
                            </SelectItem>
                            <SelectItem
                              value="50"
                              className="text-white hover:bg-[#F8FF7C] hover:text-[#1a1a1a] focus:bg-[#F8FF7C] focus:text-[#1a1a1a]"
                              style={{
                                fontFamily: "var(--font-family-actay-regular)",
                              }}
                            >
                              50
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <span
                          className="text-sm text-gray-400"
                          style={{
                            fontFamily: "var(--font-family-actay-regular)",
                          }}
                        >
                          per page
                        </span>
                      </div>

                      {/* Pagination info - Desktop */}
                      <div className="text-sm text-gray-400">
                        Showing {startIndex + 1} to{" "}
                        {Math.min(endIndex, totalItems)} of {totalItems} chains
                      </div>

                      {/* Pagination buttons - Desktop */}
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCurrentPage(Math.max(1, currentPage - 1))
                          }
                          disabled={currentPage === 1}
                          className="bg-[#1a1a1a] border-white/10 text-white hover:border-[#F8FF7C] disabled:opacity-50"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>

                        {/* Page numbers - Desktop (show more) */}
                        <div className="flex items-center gap-1">
                          {Array.from(
                            { length: Math.min(5, totalPages) },
                            (_, i) => {
                              const pageNum =
                                Math.max(
                                  1,
                                  Math.min(totalPages - 4, currentPage - 2)
                                ) + i;
                              if (pageNum > totalPages) return null;

                              return (
                                <Button
                                  key={pageNum}
                                  variant={
                                    currentPage === pageNum
                                      ? "default"
                                      : "outline"
                                  }
                                  size="sm"
                                  onClick={() => setCurrentPage(pageNum)}
                                  className={
                                    currentPage === pageNum
                                      ? "bg-[#F8FF7C] text-[#1a1a1a] hover:bg-[#F8FF7C]/90"
                                      : "bg-[#1a1a1a] border-white/10 text-white hover:border-[#F8FF7C]"
                                  }
                                >
                                  {pageNum}
                                </Button>
                              );
                            }
                          )}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setCurrentPage(
                              Math.min(totalPages, currentPage + 1)
                            )
                          }
                          disabled={currentPage === totalPages}
                          className="bg-[#1a1a1a] border-white/10 text-white hover:border-[#F8FF7C] disabled:opacity-50"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {filteredChains.length === 0 && (
          <div className="text-center py-12">
            <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2 text-white">
              No chains found
            </h3>
            <p className="text-gray-300 mb-4">
              {searchQuery
                ? "Try adjusting your search terms"
                : "Deploy your first blockchain network to get started"}
            </p>
            <Button
              asChild
              className="bg-[#F8FF7C] text-[#1a1a1a] hover:bg-[#F8FF7C]/90 font-semibold transition-all duration-200 shadow-lg hover:shadow-[#F8FF7C]/20"
            >
              <Link href="/create">
                <Plus className="w-4 h-4 mr-2" />
                Deploy Chain
              </Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}
