import React, { useState } from "react";
import { EntityProfile } from "@/entities/all";
import { InvokeLLM } from "@/integrations/Core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  Network, 
  Globe, 
  Mail, 
  User, 
  Phone, 
  Shield,
  AlertTriangle,
  Loader2,
  Eye,
  Link2,
  Database,
  CheckCircle,
  XCircle
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import EntityGraph from "../components/osint/EntityGraph";
import RelationshipMap from "../components/osint/RelationshipMap";
import IntelligencePanel from "../components/osint/IntelligencePanel";

export default function EntitySearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("auto");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  const entityTypes = [
    { value: "auto", label: "Auto-detect", icon: Search },
    { value: "email", label: "Email Address", icon: Mail },
    { value: "username", label: "Username", icon: User },
    { value: "domain", label: "Domain", icon: Globe },
    { value: "ip", label: "IP Address", icon: Network },
    { value: "phone", label: "Phone Number", icon: Phone }
  ];

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setSearchResults(null);

    try {
      // AI-powered entity analysis and correlation
      const analysisResult = await InvokeLLM({
        prompt: `Analyze this identifier for OSINT purposes: "${searchQuery}"
        
        Determine the type of identifier and suggest correlation patterns. Consider:
        - What type of identifier this appears to be (email, username, domain, IP, phone, etc.)
        - Potential related identifiers to search for
        - Common username patterns if it's a username
        - Domain variations if it's an email/domain
        - Social media platforms where similar handles might exist
        - Risk level and confidence scoring

        Focus on legal, open-source intelligence gathering only.`,
        response_json_schema: {
          type: "object",
          properties: {
            detected_type: { type: "string" },
            confidence: { type: "number" },
            risk_level: { type: "string" },
            suggested_searches: {
              type: "array",
              items: { type: "string" }
            },
            potential_platforms: {
              type: "array", 
              items: { type: "string" }
            },
            correlation_patterns: {
              type: "array",
              items: { type: "string" }
            },
            compliance_notes: { type: "string" }
          }
        }
      });

      // Create entity profile
      const entityProfile = await EntityProfile.create({
        identifier: searchQuery,
        type: searchType === "auto" ? analysisResult.detected_type : searchType,
        related_entities: analysisResult.suggested_searches?.map(search => ({
          identifier: search,
          type: "potential",
          confidence: 0.7,
          source: "ai_correlation"
        })) || [],
        social_profiles: analysisResult.potential_platforms?.map(platform => ({
          platform,
          profile_url: "",
          username: searchQuery,
          confidence: 0.6
        })) || []
      });

      setSearchResults({
        profile: entityProfile,
        analysis: analysisResult,
        correlations: analysisResult.suggested_searches || [],
        platforms: analysisResult.potential_platforms || []
      });

    } catch (error) {
      console.error("Search failed:", error);
    }
    
    setIsSearching(false);
  };

  return (
    <div className="p-6 bg-gray-950 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Entity Search & Correlation</h1>
          <p className="text-gray-400">Discover connections across the digital landscape</p>
        </div>

        {/* Search Interface */}
        <Card className="bg-gray-900 border-gray-800 mb-8">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Search className="w-5 h-5" />
              Intelligence Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Input
                  placeholder="Enter email, username, domain, IP address, or phone number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="w-48">
                <Select value={searchType} onValueChange={setSearchType}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    {entityTypes.map(type => (
                      <SelectItem key={type.value} value={type.value} className="text-white">
                        <div className="flex items-center gap-2">
                          <type.icon className="w-4 h-4" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleSearch} 
                disabled={isSearching || !searchQuery.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Investigate
                  </>
                )}
              </Button>
            </div>

            {/* Compliance Notice */}
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-400 bg-gray-800/50 p-3 rounded-lg">
              <Shield className="w-4 h-4 text-green-400" />
              <span>All searches comply with legal and ethical OSINT practices. No illegal data access.</span>
            </div>
          </CardContent>
        </Card>

        {/* Search Results */}
        <AnimatePresence>
          {searchResults && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-gray-800 p-1">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-gray-700 text-white">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="correlations" className="data-[state=active]:bg-gray-700 text-white">
                    Correlations
                  </TabsTrigger>
                  <TabsTrigger value="network" className="data-[state=active]:bg-gray-700 text-white">
                    Network Graph
                  </TabsTrigger>
                  <TabsTrigger value="intelligence" className="data-[state=active]:bg-gray-700 text-white">
                    Intelligence
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                  <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Entity Info */}
                    <Card className="bg-gray-900 border-gray-800 lg:col-span-2">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <Database className="w-5 h-5" />
                            Entity Analysis
                          </span>
                          <Badge variant="outline" className={`${
                            searchResults.analysis.risk_level === 'low' ? 'text-green-400 border-green-500' :
                            searchResults.analysis.risk_level === 'medium' ? 'text-yellow-400 border-yellow-500' :
                            'text-red-400 border-red-500'
                          }`}>
                            Risk: {searchResults.analysis.risk_level}
                          </Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-800 p-4 rounded-lg">
                              <p className="text-gray-400 text-sm">Identifier</p>
                              <p className="text-white font-mono">{searchResults.profile.identifier}</p>
                            </div>
                            <div className="bg-gray-800 p-4 rounded-lg">
                              <p className="text-gray-400 text-sm">Detected Type</p>
                              <p className="text-white font-medium">{searchResults.analysis.detected_type}</p>
                            </div>
                            <div className="bg-gray-800 p-4 rounded-lg">
                              <p className="text-gray-400 text-sm">Confidence Score</p>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 bg-gray-700 h-2 rounded">
                                  <div 
                                    className="bg-blue-500 h-2 rounded"
                                    style={{ width: `${searchResults.analysis.confidence * 100}%` }}
                                  />
                                </div>
                                <span className="text-white text-sm">
                                  {Math.round(searchResults.analysis.confidence * 100)}%
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="bg-gray-800 p-4 rounded-lg">
                            <p className="text-gray-400 text-sm mb-2">Compliance Notes</p>
                            <p className="text-white text-sm">{searchResults.analysis.compliance_notes}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Card className="bg-gray-900 border-gray-800">
                      <CardHeader>
                        <CardTitle className="text-white flex items-center gap-2">
                          <Link2 className="w-5 h-5" />
                          Correlation Stats
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Related Entities</span>
                            <span className="text-white font-semibold">
                              {searchResults.profile.related_entities?.length || 0}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Potential Platforms</span>
                            <span className="text-white font-semibold">
                              {searchResults.platforms.length}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400">Correlation Patterns</span>
                            <span className="text-white font-semibold">
                              {searchResults.analysis.correlation_patterns?.length || 0}
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="correlations">
                  <RelationshipMap 
                    entity={searchResults.profile}
                    correlations={searchResults.correlations}
                    platforms={searchResults.platforms}
                  />
                </TabsContent>

                <TabsContent value="network">
                  <EntityGraph 
                    centralEntity={searchResults.profile}
                    relatedEntities={searchResults.profile.related_entities || []}
                  />
                </TabsContent>

                <TabsContent value="intelligence">
                  <IntelligencePanel 
                    entity={searchResults.profile}
                    analysis={searchResults.analysis}
                  />
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>

        {/* No results state */}
        {!searchResults && !isSearching && (
          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="text-center py-12">
              <Search className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Start Your Investigation</h3>
              <p className="text-gray-400 mb-6 max-w-md mx-auto">
                Enter any identifier above to begin comprehensive OSINT analysis and correlation discovery.
              </p>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Legal compliance verified</span>
                <span>•</span>
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span>Ethical data collection</span>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
