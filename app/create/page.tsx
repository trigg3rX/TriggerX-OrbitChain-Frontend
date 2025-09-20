"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Globe,
  ArrowLeft,
  Info,
  CheckCircle,
  HelpCircle,
  Zap,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Typography } from "@/components/ui/typography";
import { ConnectWalletButton } from "@/components/connect-wallet-button";
import { useWallet } from "@/contexts/wallet-context";

const API_PORT = process.env.NEXT_PUBLIC_API_PORT || 9002;
const API_BASE_URL = `http://192.168.0.223:${API_PORT}`;

export default function CreateChainPage() {
  const { address, isConnected } = useWallet();

  const [formData, setFormData] = useState({
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
  });
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleDeploy = async () => {
    if (!isConnected || !address) return;
    setLoading(true);
    setFeedback(null);

    const requestData = {
      chain_id: Number(formData.chainId),
      chain_name: formData.rollupName,
      user_address: address,
    };

    console.log("POST Request URL:", `${API_BASE_URL}/api/orbit-chain/deploy`);
    console.log("POST Request Data:", requestData);
    console.log("Full Request Body:", JSON.stringify(requestData, null, 2));

    try {
      const res = await fetch(`${API_BASE_URL}/api/orbit-chain/deploy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });
      if (!res.ok) throw new Error(await res.text());
      setFeedback("Chain deployment started successfully!");
    } catch (err: any) {
      setFeedback("Failed to deploy: " + (err?.message || "Unknown error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
          <div className="text-center mb-6 sm:mb-8">
            <Typography
              variant="h1"
              className="mb-2 sm:mb-4 text-white text-2xl sm:text-3xl lg:text-4xl"
            >
              Deploy Orbit Chain
            </Typography>
            <Typography
              variant="h3"
              className="text-gray-300 text-sm sm:text-base lg:text-lg"
            >
              Configure your custom blockchain parameters
            </Typography>
          </div>
          <div className="flex flex-col xl:flex-row gap-6 lg:gap-8 justify-center items-start">
            <div className="flex-1 max-w-4xl space-y-6 sm:space-y-8">
              {/* Basic Configuration */}
              <Card className="bg-gradient-to-r from-[#D9D9D924] to-[#14131324] border-white/10 backdrop-blur-sm">
                <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                  <CardTitle className="text-lg sm:text-xl text-white font-semibold">
                    Basic Configuration
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="rollupName"
                        className="text-white font-medium"
                      >
                        Rollup name
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 ml-1 inline text-[#F8FF7C]" />
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
                        onChange={(e) =>
                          handleInputChange("rollupName", e.target.value)
                        }
                        disabled={!isConnected}
                        className="bg-[#242323] border-white/10 text-white placeholder:text-gray-400 focus:border-[#F8FF7C] focus:ring-2 focus:ring-[#F8FF7C]/20 rounded-lg px-3 sm:px-4 py-2 sm:py-3 transition-all duration-200 text-sm sm:text-base"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="chainId"
                        className="text-white font-medium"
                      >
                        Chain ID
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Info className="w-4 h-4 ml-1 inline text-[#F8FF7C]" />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Unique identifier for your blockchain network</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                      <Input
                        id="chainId"
                        value={formData.chainId}
                        onChange={(e) =>
                          handleInputChange("chainId", e.target.value)
                        }
                        disabled={!isConnected}
                        className="bg-[#242323] border-white/10 text-white placeholder:text-gray-400 focus:border-[#F8FF7C] focus:ring-2 focus:ring-[#F8FF7C]/20 rounded-lg px-3 sm:px-4 py-2 sm:py-3 transition-all duration-200 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Build Your Stack */}
              <Card className="bg-gradient-to-r from-[#D9D9D924] to-[#14131324] border-white/10 backdrop-blur-sm">
                <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                  <CardTitle className="text-lg sm:text-xl text-white font-semibold">
                    Build your stack
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6 px-4 sm:px-6">
                  <div className="space-y-3">
                    <Label className="text-white font-medium">
                      Framework
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="w-4 h-4 ml-1 inline text-[#F8FF7C]" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Fixed framework for this deployment</p>
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <div className="bg-[#242323] border-white/10 rounded-lg p-3 sm:p-4 hover:border-[#F8FF7C]/30 transition-all duration-200">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-3 h-3 bg-[#F8FF7C] rounded-full flex-shrink-0" />
                        <span className="font-medium text-white text-sm sm:text-base">
                          Arbitrum Orbit
                        </span>
                        <div className="ml-auto px-2 sm:px-3 py-1 bg-[#F8FF7C]/10 text-[#F8FF7C] text-xs rounded-full font-medium flex-shrink-0">
                          Fixed
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-300 mt-2">
                        High-performance L3 framework built on Arbitrum
                        technology
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-white font-medium">
                      Settlement layer
                    </Label>
                    <div className="bg-[#242323] border-white/10 rounded-lg p-3 sm:p-4 hover:border-[#F8FF7C]/30 transition-all duration-200">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-3 h-3 bg-[#F8FF7C] rounded-full flex-shrink-0" />
                        <span className="font-medium text-white text-sm sm:text-base">
                          Arbitrum One L2
                        </span>
                        <div className="ml-auto px-2 sm:px-3 py-1 bg-[#F8FF7C]/10 text-[#F8FF7C] text-xs rounded-full font-medium flex-shrink-0">
                          Fixed
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-300 mt-2">
                        Secure and battle-tested L2 settlement layer
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-white font-medium">
                      Data availability
                    </Label>
                    <div className="bg-[#242323] border-white/10 rounded-lg p-3 sm:p-4 hover:border-[#F8FF7C]/30 transition-all duration-200">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-3 h-3 bg-[#F8FF7C] rounded-full flex-shrink-0" />
                        <span className="font-medium text-white text-sm sm:text-base">
                          AnyTrust DA
                        </span>
                        <div className="ml-auto px-2 sm:px-3 py-1 bg-[#F8FF7C]/10 text-[#F8FF7C] text-xs rounded-full font-medium flex-shrink-0">
                          Fixed
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-gray-300 mt-2">
                        Cost-effective data availability with trusted committee
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-white font-medium">
                      Automation Service
                    </Label>
                    <div className="bg-[#242323] border-white/10 rounded-lg p-3 sm:p-4 hover:border-[#F8FF7C]/30 transition-all duration-200">
                      <div className="flex items-start sm:items-center justify-between gap-3">
                        <div className="flex items-start sm:items-center gap-2 sm:gap-3 flex-1 min-w-0">
                          <Zap className="w-4 h-4 sm:w-5 sm:h-5 text-[#F8FF7C] flex-shrink-0 mt-0.5 sm:mt-0" />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                              <Typography
                                variant="span"
                                className="triggerx-logo text-white text-xs sm:text-sm"
                              >
                                TRIGGER
                                <span className="triggerx-gradient text-[#F8FF7C]">
                                  X
                                </span>
                              </Typography>
                              <span className="text-xs sm:text-sm text-gray-300">
                                Automation
                              </span>
                            </div>
                            <p className="text-xs sm:text-sm text-gray-300 mt-1">
                              Enable automated blockchain tasks and smart
                              contract triggers
                            </p>
                          </div>
                        </div>
                        <div className="relative flex-shrink-0">
                          <Switch
                            checked={formData.triggerxAutomation}
                            onCheckedChange={(checked) =>
                              handleInputChange("triggerxAutomation", checked)
                            }
                            className="data-[state=checked]:bg-[#F8FF7C] data-[state=unchecked]:bg-gray-600 data-[state=unchecked]:border-gray-500"
                          />
                          {!formData.triggerxAutomation && (
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-500 rounded-full border-2 border-[#242323]"></div>
                          )}
                        </div>
                      </div>
                      {formData.triggerxAutomation && (
                        <div className="mt-3 p-2 sm:p-3 bg-[#F8FF7C]/10 rounded-lg border border-[#F8FF7C]/20">
                          <div className="flex items-center gap-2 text-xs sm:text-sm text-[#F8FF7C]">
                            <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span>
                              TriggerX automation service will be integrated
                              with your orbit chain
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-[#242323]/50 border border-white/10 p-3 sm:p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 bg-[#F8FF7C]/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-[#F8FF7C]">
                          i
                        </span>
                      </div>
                      <span className="text-xs sm:text-sm font-medium text-white">
                        Customers deployed with this stack
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Environment Selection */}
              <Card className="bg-gradient-to-r from-[#D9D9D924] to-[#14131324] border-white/10 backdrop-blur-sm">
                <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                  <CardTitle className="text-lg sm:text-xl text-white font-semibold">
                    Choose your environment
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4 sm:px-6">
                  <div className="grid grid-cols-1 gap-4">
                    <Button
                      variant={
                        formData.environment === "testnet"
                          ? "default"
                          : "outline"
                      }
                      className={`h-auto p-4 sm:p-6 justify-start text-left transition-all duration-200 ${
                        formData.environment === "testnet"
                          ? "border text-white border-[#F8FF7C]"
                          : "bg-[#242323] text-white border-white/10 hover:border-[#F8FF7C]/50 hover:bg-[#242323]/80"
                      }`}
                      onClick={() =>
                        handleInputChange("environment", "testnet")
                      }
                      disabled={!isConnected}
                    >
                      <div className="space-y-2 sm:space-y-3 w-full">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${
                              formData.environment === "testnet"
                                ? "bg-[#FFFFFF]"
                                : "bg-[#F8FF7C]"
                            }`}
                          />
                          <span className="font-medium text-sm sm:text-base">
                            Testnet
                          </span>
                        </div>
                        <div className="space-y-1 sm:space-y-2">
                          <p
                            className={`text-xs sm:text-sm leading-relaxed ${
                              formData.environment === "testnet"
                                ? "text-[#FFFFFF]"
                                : "text-gray-300"
                            }`}
                          >
                            Deploy a rollup on the Sepolia network.
                          </p>
                          <p
                            className={`text-xs sm:text-sm leading-relaxed ${
                              formData.environment === "testnet"
                                ? "text-[#FFFFFF]"
                                : "text-gray-300"
                            }`}
                          >
                            Best used as a persistent testnet and staging
                            environment.
                          </p>
                          <div
                            className={`text-xs sm:text-sm font-medium ${
                              formData.environment === "testnet"
                                ? "text-[#FFFFFF]"
                                : "text-[#F8FF7C]"
                            }`}
                          >
                            Three months free then $250 / month
                          </div>
                        </div>
                      </div>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary Sidebar */}
            <div className="w-full xl:w-auto space-y-6">
              <Card className="bg-gradient-to-r from-[#D9D9D924] to-[#14131324] border-white/10 backdrop-blur-sm xl:sticky xl:top-8">
                <CardHeader className="pb-3 sm:pb-4 px-4 sm:px-6">
                  <CardTitle className="text-lg sm:text-xl text-white font-semibold">
                    Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 sm:space-y-4 px-4 sm:px-6">
                  <div>
                    <h3 className="font-medium mb-2 sm:mb-3 text-white text-sm sm:text-base">
                      What's included?
                    </h3>
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-300">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#F8FF7C] flex-shrink-0 mt-0.5" />
                        <span>Your own Testnet L3 (Sepolia)</span>
                      </div>
                      <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-300">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#F8FF7C] flex-shrink-0 mt-0.5" />
                        <span>Built on Arbitrum Orbit with AnyTrust DA</span>
                      </div>
                      <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-300">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#F8FF7C] flex-shrink-0 mt-0.5" />
                        <span>Arbitrum Stylus support built-in</span>
                      </div>
                      <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-300">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#F8FF7C] flex-shrink-0 mt-0.5" />
                        <span>
                          Built-in block explorer, tracer, faucet, and bridge
                        </span>
                      </div>
                      <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-300">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#F8FF7C] flex-shrink-0 mt-0.5" />
                        <span>
                          Best-in-class security monitoring and architecture
                        </span>
                      </div>
                      <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-300">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#F8FF7C] flex-shrink-0 mt-0.5" />
                        <span>
                          High-availability sequencing with Conduit Elector
                        </span>
                      </div>
                      <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-300">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#F8FF7C] flex-shrink-0 mt-0.5" />
                        <span>Hypernode RPC that scales with your usage</span>
                      </div>
                      <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-300">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#F8FF7C] flex-shrink-0 mt-0.5" />
                        <span>Standard support</span>
                      </div>
                      <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-300">
                        <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#F8FF7C] flex-shrink-0 mt-0.5" />
                        <span>99.9% uptime SLA</span>
                      </div>
                      {formData.triggerxAutomation && (
                        <div className="flex items-start gap-2 text-xs sm:text-sm text-gray-300">
                          <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-[#F8FF7C] flex-shrink-0 mt-0.5" />
                          <div className="flex items-center gap-1 flex-wrap">
                            <span className="triggerx-logo text-xs text-white">
                              TRIGGER
                              <span className="triggerx-gradient text-[#F8FF7C]">
                                X
                              </span>
                            </span>
                            <span>automation service integration</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-2 sm:mb-3 text-white text-sm sm:text-base">
                      Costs and pricing
                    </h3>
                    <div className="space-y-1.5 sm:space-y-2">
                      <div className="flex justify-between text-xs sm:text-sm text-gray-300">
                        <span>Deployment cost</span>
                        <span className="font-medium text-white">$50</span>
                      </div>
                      <div className="flex justify-between text-xs sm:text-sm text-gray-300">
                        <span>Plan cost</span>
                        <span className="font-medium text-white text-right">
                          Three months free then $250 / month
                        </span>
                      </div>
                      {formData.triggerxAutomation && (
                        <div className="flex justify-between text-xs sm:text-sm text-gray-300">
                          <span>TriggerX automation</span>
                          <span className="font-medium text-[#F8FF7C]">
                            Free during beta
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center gap-2 text-sm text-gray-300">
                    <HelpCircle className="w-4 h-4 text-[#F8FF7C]" />
                    Need more guidance?
                    <Button
                      variant="link"
                      size="sm"
                      className="p-0 h-auto text-[#F8FF7C] hover:text-[#F8FF7C]/80"
                    >
                      Request demo
                    </Button>
                  </div>
                  <div className="relative w-full">
                    <button
                      disabled={!isConnected || loading}
                      onClick={handleDeploy}
                      className="relative w-full text-[#000000] px-6 py-2 sm:px-8 sm:py-3 lg:px-6 xl:px-8 rounded-lg group transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="absolute inset-0 bg-[#222222] border border-[#FFFFFF80]/50 rounded-full scale-100 translate-y-0 transition-all duration-300 ease-out group-hover:translate-y-2"></span>
                      <span className="absolute inset-0 bg-[#F8FF7C] rounded-full scale-100 translate-y-0 group-hover:translate-y-0"></span>
                      <span className="font-actayRegular relative z-10 px-0 py-3 sm:px-3 md:px-6 lg:px-0 rounded-full translate-y-2 group-hover:translate-y-0 transition-all duration-300 ease-out text-xs sm:text-base">
                        {loading
                          ? "Deploying..."
                          : isConnected
                          ? "Deploy Orbit Chain"
                          : "Connect Wallet to Deploy"}
                      </span>
                    </button>
                  </div>

                  {feedback && (
                    <div
                      className={`mt-2 text-sm ${
                        feedback.startsWith("Failed")
                          ? "text-red-400"
                          : "text-[#F8FF7C]"
                      }`}
                    >
                      {feedback}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
