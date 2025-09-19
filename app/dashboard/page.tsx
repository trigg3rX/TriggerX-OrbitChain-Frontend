"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
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
} from "lucide-react"

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
]

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")
  const [chains, setChains] = useState<OrbitChainData[]>(mockChains)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch dashboard data on component mount
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log("Fetching dashboard data from:", `${API_BASE_URL}/api/orbit-chain/dashboard`)
        
        const res = await fetch(`${API_BASE_URL}/api/orbit-chain/dashboard`)
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        
        const data = await res.json()
        console.log("Dashboard API response:", data)
        
        // Assuming the API returns an array of chains or an object with chains property
        if (Array.isArray(data)) {
          setChains(data as OrbitChainData[])
        } else if (data.chains && Array.isArray(data.chains)) {
          setChains(data.chains as OrbitChainData[])
        } else {
          console.warn("Unexpected API response format:", data)
          setChains(mockChains) // fallback to mock data
        }
      } catch (err: any) {
        console.error("Failed to fetch dashboard data:", err)
        setError(err.message || "Failed to load dashboard data")
        setChains(mockChains) // fallback to mock data
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const filteredChains = chains.filter(
    (chain) => 
      (chain.chain_name || chain.name || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
      (chain.chain_id?.toString() || chain.chainId || "").includes(searchQuery),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200"
      case "paused":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "deploying":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-semibold">OrbitChain</span>
              </div>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button size="sm" asChild>
              <Link href="/create">
                <Plus className="w-4 h-4 mr-2" />
                Deploy Chain
              </Link>
            </Button>
            <ConnectWalletButton />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Manage your deployed blockchain networks</p>
          {loading && <p className="text-sm text-blue-600 mt-2">Loading dashboard data...</p>}
          {error && <p className="text-sm text-red-600 mt-2">Error: {error}</p>}
        </div>

        {/* Overview Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Chains</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{chains.length}</div>
              <p className="text-xs text-muted-foreground">Total deployed chains</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2.55M</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">95K</div>
              <p className="text-xs text-muted-foreground">+8% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Cost</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$5,500</div>
              <p className="text-xs text-muted-foreground">+$250 from last month</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search chains by name or chain ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Orbit Chains Table */}
        <Card>
          <CardHeader>
            <CardTitle>Orbit Chains</CardTitle>
            <CardDescription>Manage your deployed blockchain networks</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="text-muted-foreground">Loading chains...</div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-3 font-medium">Chain ID</th>
                      <th className="text-left p-3 font-medium">Chain Name</th>
                      <th className="text-left p-3 font-medium">RPC URL</th>
                      <th className="text-left p-3 font-medium">User Address</th>
                      <th className="text-left p-3 font-medium">Status</th>
                      <th className="text-left p-3 font-medium">Orbit Chain Address</th>
                      <th className="text-left p-3 font-medium">Created At</th>
                      <th className="text-left p-3 font-medium">Updated At</th>
                      <th className="text-left p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredChains.map((chain, index) => (
                      <tr key={chain.id || index} className="border-b hover:bg-muted/50">
                        <td className="p-3 font-mono text-sm">{chain.chain_id || chain.chainId}</td>
                        <td className="p-3 font-medium">{chain.chain_name || chain.name}</td>
                        <td className="p-3">
                          {chain.rpc_url ? (
                            <a 
                              href={chain.rpc_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline text-sm font-mono"
                            >
                              {chain.rpc_url.length > 30 ? `${chain.rpc_url.substring(0, 30)}...` : chain.rpc_url}
                            </a>
                          ) : (
                            <span className="text-muted-foreground text-sm">Not available</span>
                          )}
                        </td>
                        <td className="p-3 font-mono text-sm">
                          {chain.user_address ? 
                            `${chain.user_address.substring(0, 6)}...${chain.user_address.substring(chain.user_address.length - 4)}` : 
                            'N/A'
                          }
                        </td>
                        <td className="p-3">
                          <Badge className={getStatusColor(chain.deployment_status || chain.status || "unknown")}>
                            {chain.deployment_status || chain.status}
                          </Badge>
                        </td>
                        <td className="p-3">
                          {chain.orbit_chain_address ? (
                            <span className="font-mono text-sm">
                              {`${chain.orbit_chain_address.substring(0, 6)}...${chain.orbit_chain_address.substring(chain.orbit_chain_address.length - 4)}`}
                            </span>
                          ) : (
                            <span className="text-muted-foreground text-sm">Not deployed</span>
                          )}
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">
                          {chain.created_at ? new Date(chain.created_at).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="p-3 text-sm text-muted-foreground">
                          {chain.updated_at ? new Date(chain.updated_at).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="p-3">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <ExternalLink className="w-4 h-4 mr-2" />
                                View Explorer
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Settings className="w-4 h-4 mr-2" />
                                Configure
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                {(chain.deployment_status || chain.status) === "active" ? (
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
                              <DropdownMenuItem className="text-destructive">
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
                {filteredChains.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No chains found. Deploy your first chain to get started.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {filteredChains.length === 0 && (
          <div className="text-center py-12">
            <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No chains found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "Try adjusting your search terms" : "Deploy your first blockchain network to get started"}
            </p>
            <Button asChild>
              <Link href="/create">
                <Plus className="w-4 h-4 mr-2" />
                Deploy Chain
              </Link>
            </Button>
          </div>
        )}
      </main>
    </div>
  )
}
