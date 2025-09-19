"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Globe, ArrowLeft, Info, CheckCircle, HelpCircle, Zap } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Typography } from "@/components/ui/typography"
import { ConnectWalletButton } from "@/components/connect-wallet-button"
import { useWallet } from "@/contexts/wallet-context"

export default function CreateChainPage() {
  const { address, isConnected } = useWallet()

  const [formData, setFormData] = useState({
    organization: "",
    rollupName: "",
    chainId: "39713",
    framework: "arbitrum-orbit",
    settlementLayer: "arbitrum-one",
    dataAvailability: "anytrust",
    environment: "testnet",
    customGasToken: false,
    blockGasLimit: "60000000",
    withdrawPeriod: "600",
    triggerxAutomation: false,
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Link>
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Globe className="w-5 h-5 text-primary-foreground" />
                </div>
                <Typography variant="h3" className="triggerx-logo">
                  TRIGGER<span className="triggerx-gradient">X</span>
                </Typography>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {!isConnected && <span className="text-sm text-muted-foreground">Connect wallet to deploy</span>}
              <ConnectWalletButton />
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div>
                <Typography variant="h1" className="mb-2">
                  Deploy Orbit Chain
                </Typography>
                <Typography variant="body" color="gray" className="text-muted-foreground">
                  Configure your custom blockchain parameters
                </Typography>
              </div>

              {/* Basic Configuration */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Basic Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="organization">Organization</Label>
                      <Select
                        value={formData.organization}
                        onValueChange={(value) => handleInputChange("organization", value)}
                        disabled={!isConnected}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={isConnected ? "Select organization" : "Connect wallet first"} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="personal">Personal Account</SelectItem>
                          <SelectItem value="company">Company Account</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="rollupName">
                        Rollup name
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 ml-1 inline text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Choose a unique name for your rollup</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Input
                        id="rollupName"
                        placeholder="e.g. Zora Network"
                        value={formData.rollupName}
                        onChange={(e) => handleInputChange("rollupName", e.target.value)}
                        disabled={!isConnected}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="chainId">
                        Chain ID
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 ml-1 inline text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Unique identifier for your blockchain network</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Input
                        id="chainId"
                        value={formData.chainId}
                        onChange={(e) => handleInputChange("chainId", e.target.value)}
                        disabled={!isConnected}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Build Your Stack */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Build your stack</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <Label>
                      Framework
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 ml-1 inline text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Fixed framework for this deployment</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <div className="bg-muted/30 border border-primary/20 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-500 rounded-full" />
                        <span className="font-medium">Arbitrum Orbit</span>
                        <div className="ml-auto px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">Fixed</div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        High-performance L3 framework built on Arbitrum technology
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Settlement layer</Label>
                    <div className="bg-muted/30 border border-primary/20 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-600 rounded-full" />
                        <span className="font-medium">Arbitrum One L2</span>
                        <div className="ml-auto px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">Fixed</div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">Secure and battle-tested L2 settlement layer</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Data availability</Label>
                    <div className="bg-muted/30 border border-primary/20 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-blue-600 rounded-full" />
                        <span className="font-medium">AnyTrust DA</span>
                        <div className="ml-auto px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">Fixed</div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Cost-effective data availability with trusted committee
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label>Automation Service</Label>
                    <div className="bg-muted/30 border border-accent/20 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Zap className="w-5 h-5 text-accent" />
                          <div>
                            <div className="flex items-center gap-2">
                              <Typography variant="span" className="triggerx-logo">
                                TRIGGER<span className="triggerx-gradient">X</span>
                              </Typography>
                              <span className="text-sm text-muted-foreground">Automation</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              Enable automated blockchain tasks and smart contract triggers
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={formData.triggerxAutomation}
                          onCheckedChange={(checked) => handleInputChange("triggerxAutomation", checked)}
                        />
                      </div>
                      {formData.triggerxAutomation && (
                        <div className="mt-3 p-3 bg-accent/10 rounded-lg">
                          <div className="flex items-center gap-2 text-sm text-accent">
                            <CheckCircle className="w-4 h-4" />
                            TriggerX automation service will be integrated with your orbit chain
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-xs font-medium text-blue-600">i</span>
                      </div>
                      <span className="text-sm font-medium">Customers deployed with this stack</span>
                      <Button variant="ghost" size="sm" className="ml-auto text-xs">
                        See more →
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Environment Selection */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Choose your environment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <Button
                      variant={formData.environment === "testnet" ? "default" : "outline"}
                      className="h-auto p-6 justify-start text-left"
                      onClick={() => handleInputChange("environment", "testnet")}
                      disabled={!isConnected}
                    >
                      <div className="space-y-3 w-full">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-blue-500 rounded-full" />
                          <span className="font-medium">Testnet</span>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Deploy a rollup on the Sepolia network.
                          </p>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Best used as a persistent testnet and staging environment.
                          </p>
                          <div className="text-sm font-medium text-primary">Three months free then $250 / month</div>
                        </div>
                      </div>
                    </Button>
                    <Button
                      variant={formData.environment === "mainnet" ? "default" : "outline"}
                      className="h-auto p-6 justify-start text-left"
                      onClick={() => handleInputChange("environment", "mainnet")}
                      disabled={!isConnected}
                    >
                      <div className="space-y-3 w-full">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full" />
                          <span className="font-medium">Mainnet</span>
                        </div>
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            Deploy a live network with genuine transactions
                          </p>
                          <p className="text-sm text-muted-foreground leading-relaxed">and real economic value.</p>
                          <div className="text-sm font-medium text-primary">Plans starting at $5,000 / month</div>
                        </div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary Sidebar */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-3">What's included?</h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Your own Testnet L3 (Sepolia)
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Built on Arbitrum Orbit with AnyTrust DA
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Arbitrum Stylus support built-in
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Built-in block explorer, tracer, faucet, and bridge
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Best-in-class security monitoring and architecture
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        High-availability sequencing with Conduit Elector
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Hypernode RPC that scales with your usage
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        Standard support
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-primary" />
                        99.9% uptime SLA
                      </div>
                      {formData.triggerxAutomation && (
                        <div className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-accent" />
                          <span className="triggerx-logo text-xs">
                            TRIGGER<span className="triggerx-gradient">X</span>
                          </span>
                          <span>automation service integration</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-3">Costs and pricing</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Deployment cost</span>
                        <span className="font-medium">$50</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Plan cost</span>
                        <span className="font-medium">Three months free then $250 / month</span>
                      </div>
                      {formData.triggerxAutomation && (
                        <div className="flex justify-between text-sm">
                          <span>TriggerX automation</span>
                          <span className="font-medium text-accent">Free during beta</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <HelpCircle className="w-4 h-4" />
                    Need more guidance?
                    <Button variant="link" size="sm" className="p-0 h-auto">
                      Request demo
                    </Button>
                  </div>

                  <Button className="w-full" size="lg" disabled={!isConnected}>
                    {isConnected ? "Deploy Orbit Chain" : "Connect Wallet to Deploy"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
